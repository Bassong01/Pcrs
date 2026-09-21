const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');
const { validateRequest, requiredText, optionalText, positiveId, paginationRules } = require('../middleware/validate');
const { body } = require('express-validator');

const router = express.Router();

// GET /api/cases — List cases
router.get('/', authenticate, paginationRules(), validateRequest, async (req, res) => {
  try {
    const { status, region, search } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;
    let query = `SELECT c.*, u.first_name || ' ' || u.last_name as registered_by_name,
                 (SELECT COUNT(*) FROM case_persons cp WHERE cp.case_id = c.id) as persons_count
                 FROM criminal_cases c
                 JOIN users u ON c.registered_by = u.id`;
    const params = [];
    const conditions = [];

    if (status) {
      params.push(status);
      conditions.push(`c.status = $${params.length}`);
    }
    if (region) {
      params.push(region);
      conditions.push(`c.region = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(c.title ILIKE $${params.length} OR c.reference_no ILIKE $${params.length} OR c.description ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const countQuery = `SELECT COUNT(*) FROM criminal_cases c${conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''}`;
    const countResult = await pool.query(countQuery, params.slice(0, conditions.length ? params.length : 0));

    query += ' ORDER BY c.created_at DESC';
    params.push(parseInt(limit));
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    res.json({
      cases: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) {
    console.error('Get cases error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/cases/:id — Get case details
router.get('/:id', authenticate, positiveId(), validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const caseResult = await pool.query(
      `SELECT c.*, u.first_name || ' ' || u.last_name as registered_by_name
       FROM criminal_cases c JOIN users u ON c.registered_by = u.id WHERE c.id = $1`, [id]
    );

    if (caseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    // Get linked persons
    const personsResult = await pool.query(
      `SELECT p.*, cp.role_in_case FROM persons_of_interest p
       JOIN case_persons cp ON p.id = cp.person_id WHERE cp.case_id = $1`, [id]
    );

    // Get linked alerts
    const alertsResult = await pool.query(
      'SELECT * FROM wanted_alerts WHERE case_id = $1 ORDER BY created_at DESC', [id]
    );

    res.json({
      ...caseResult.rows[0],
      persons: personsResult.rows,
      alerts: alertsResult.rows
    });
  } catch (err) {
    console.error('Get case error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/cases — Register new case
router.post('/', authenticate, authorize('police_officer', 'admin'), [
  requiredText('title', 'Title', 300), requiredText('nature', 'Nature', 200),
  body('incident_date').isISO8601().withMessage('A valid incident date is required.'),
  optionalText('description'), optionalText('location', 300), optionalText('region', 100), validateRequest,
], auditLog('CASE_CREATE', 'criminal_cases'), async (req, res) => {
  try {
    const { title, nature, description, location, region, incident_date } = req.body;

    if (!title || !nature || !incident_date) {
      return res.status(400).json({ error: 'Required fields: title, nature, incident_date.' });
    }

    // Generate reference number
    const yearResult = await pool.query("SELECT COUNT(*) FROM criminal_cases WHERE reference_no LIKE 'CR-' || EXTRACT(YEAR FROM CURRENT_DATE)::text || '%'");
    const count = parseInt(yearResult.rows[0].count) + 1;
    const year = new Date().getFullYear();
    const reference_no = `CR-${year}-${String(count).padStart(4, '0')}`;

    const result = await pool.query(
      `INSERT INTO criminal_cases (reference_no, title, nature, description, location, region, incident_date, registered_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [reference_no, title, nature, description, location, region, incident_date, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create case error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/cases/:id — Update case
router.put('/:id', authenticate, authorize('police_officer', 'admin'), [
  positiveId(), body('incident_date').optional().isISO8601().withMessage('incident_date must be a valid date.'),
  body('status').optional().isIn(['open', 'under_investigation', 'closed', 'archived']).withMessage('Invalid case status.'), validateRequest,
], auditLog('CASE_UPDATE', 'criminal_cases'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, nature, description, location, region, incident_date, status } = req.body;

    const result = await pool.query(
      `UPDATE criminal_cases SET title = COALESCE($1, title), nature = COALESCE($2, nature),
       description = COALESCE($3, description), location = COALESCE($4, location),
       region = COALESCE($5, region), incident_date = COALESCE($6, incident_date),
       status = COALESCE($7, status), updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [title, nature, description, location, region, incident_date, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update case error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/cases/:id/persons — Link person to case
router.post('/:id/persons', authenticate, authorize('police_officer', 'admin'), [
  positiveId(), body('person_id').isInt({ min: 1 }).withMessage('person_id must be a positive integer.').toInt(),
  body('role_in_case').optional().isLength({ max: 100 }).withMessage('role_in_case is too long.'), validateRequest,
], async (req, res) => {
  try {
    const { id } = req.params;
    const { person_id, role_in_case } = req.body;

    const result = await pool.query(
      'INSERT INTO case_persons (case_id, person_id, role_in_case) VALUES ($1, $2, $3) RETURNING *',
      [id, person_id, role_in_case || 'suspect']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Person already linked to this case.' });
    }
    console.error('Link person error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
