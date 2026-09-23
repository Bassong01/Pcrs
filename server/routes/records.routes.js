const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');
const { validateRequest, requiredText, optionalText, positiveId, paginationRules } = require('../middleware/validate');
const { body } = require('express-validator');

const router = express.Router();

// GET /api/records — List criminal records
router.get('/', authenticate, authorize('admin', 'police_officer', 'judicial_authority'), paginationRules(), validateRequest, async (req, res) => {
  try {
    const { search, status } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    let query = `SELECT cr.*, p.first_name || ' ' || p.last_name as person_name, p.alias, p.id_number
                 FROM criminal_records cr
                 JOIN persons_of_interest p ON cr.person_id = p.id`;
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(p.first_name ILIKE $${params.length} OR p.last_name ILIKE $${params.length} OR cr.offence ILIKE $${params.length})`);
    }
    if (status) {
      params.push(status);
      conditions.push(`cr.verification_status = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const countParams = params.slice();
    const countQuery = `SELECT COUNT(*) FROM criminal_records cr JOIN persons_of_interest p ON cr.person_id = p.id${conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''}`;
    const countResult = await pool.query(countQuery, countParams);

    query += ' ORDER BY cr.created_at DESC';
    params.push(parseInt(limit));
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    res.json({
      records: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) {
    console.error('Get records error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/records/:id — Get specific record
router.get('/:id', authenticate, authorize('admin', 'police_officer', 'judicial_authority'), positiveId(), validateRequest, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cr.*, p.first_name || ' ' || p.last_name as person_name, p.alias, p.id_number, p.photo_url,
       v.first_name || ' ' || v.last_name as verified_by_name
       FROM criminal_records cr
       JOIN persons_of_interest p ON cr.person_id = p.id
       LEFT JOIN users v ON cr.verified_by = v.id
       WHERE cr.id = $1`, [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get record error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/records — Create criminal record
router.post('/', authenticate, authorize('police_officer', 'admin'), [
  body('person_id').isInt({ min: 1 }).withMessage('person_id must be a positive integer.').toInt(),
  requiredText('offence', 'Offence', 300), optionalText('offence_location', 300), optionalText('sentence'), optionalText('court', 200), optionalText('notes'),
  body('offence_date').optional().isISO8601().withMessage('offence_date must be a valid date.'), body('verdict_date').optional().isISO8601().withMessage('verdict_date must be a valid date.'), validateRequest,
], auditLog('RECORD_CREATE', 'criminal_records'), async (req, res) => {
  try {
    const { person_id, offence, offence_date, offence_location, sentence, court, verdict_date, notes } = req.body;

    if (!person_id || !offence) {
      return res.status(400).json({ error: 'Required fields: person_id, offence.' });
    }

    const result = await pool.query(
      `INSERT INTO criminal_records (person_id, offence, offence_date, offence_location, sentence, court, verdict_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [person_id, offence, offence_date, offence_location, sentence, court, verdict_date, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create record error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/records/:id/verify — Mark record as verified
router.put('/:id/verify', authenticate, authorize('police_officer', 'admin', 'judicial_authority'), [
  positiveId(), body('verification_status').optional().isIn(['unverified', 'verified', 'flagged']).withMessage('Invalid verification status.'), optionalText('notes'), validateRequest,
], auditLog('RECORD_VERIFY', 'criminal_records'), async (req, res) => {
  try {
    const { id } = req.params;
    const { verification_status, notes } = req.body;

    const result = await pool.query(
      `UPDATE criminal_records SET verification_status = $1, verified_by = $2, verified_at = CURRENT_TIMESTAMP,
       notes = COALESCE($3, notes), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
      [verification_status || 'verified', req.user.id, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Verify record error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
