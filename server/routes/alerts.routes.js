const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');
const { validateRequest, requiredText, optionalText, positiveId, paginationRules } = require('../middleware/validate');
const { body } = require('express-validator');
const { notifyAlert } = require('../realtime');

const router = express.Router();

// GET /api/alerts — List wanted alerts
router.get('/', authenticate, authorize('admin', 'police_officer', 'judicial_authority'), paginationRules(), validateRequest, async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;
    let query = `SELECT wa.*, p.first_name || ' ' || p.last_name as person_name, p.alias, p.photo_url,
                 c.reference_no as case_ref, c.title as case_title,
                 iu.first_name || ' ' || iu.last_name as issued_by_name,
                 au.first_name || ' ' || au.last_name as authorized_by_name
                 FROM wanted_alerts wa
                 JOIN persons_of_interest p ON wa.person_id = p.id
                 LEFT JOIN criminal_cases c ON wa.case_id = c.id
                 JOIN users iu ON wa.issued_by = iu.id
                 LEFT JOIN users au ON wa.authorized_by = au.id`;
    const params = [];
    const conditions = [];

    if (status) {
      params.push(status);
      conditions.push(`wa.status = $${params.length}`);
    }
    if (priority) {
      params.push(priority);
      conditions.push(`wa.priority = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(p.first_name ILIKE $${params.length} OR p.last_name ILIKE $${params.length} OR wa.alert_ref ILIKE $${params.length} OR wa.reason ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const countParams = params.slice();
    const countQuery = `SELECT COUNT(*) FROM wanted_alerts wa JOIN persons_of_interest p ON wa.person_id = p.id${conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''}`;
    const countResult = await pool.query(countQuery, countParams);

    query += ' ORDER BY wa.created_at DESC';
    params.push(parseInt(limit));
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    res.json({
      alerts: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) {
    console.error('Get alerts error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/alerts/:id — Get alert details
router.get('/:id', authenticate, authorize('admin', 'police_officer', 'judicial_authority'), positiveId(), validateRequest, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT wa.*, p.first_name || ' ' || p.last_name as person_name, p.alias, p.photo_url, p.physical_desc,
       c.reference_no as case_ref, c.title as case_title,
       iu.first_name || ' ' || iu.last_name as issued_by_name,
       au.first_name || ' ' || au.last_name as authorized_by_name
       FROM wanted_alerts wa
       JOIN persons_of_interest p ON wa.person_id = p.id
       LEFT JOIN criminal_cases c ON wa.case_id = c.id
       JOIN users iu ON wa.issued_by = iu.id
       LEFT JOIN users au ON wa.authorized_by = au.id
       WHERE wa.id = $1`, [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get alert error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/alerts — Create new wanted alert
router.post('/', authenticate, authorize('police_officer', 'admin'), [
  body('person_id').isInt({ min: 1 }).withMessage('person_id must be a positive integer.').toInt(),
  requiredText('reason', 'Reason'), body('case_id').optional().isInt({ min: 1 }).withMessage('case_id must be a positive integer.').toInt(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid alert priority.'),
  optionalText('description'), optionalText('last_known_loc', 300), optionalText('region', 100), optionalText('station', 200), validateRequest,
], auditLog('ALERT_CREATE', 'wanted_alerts'), async (req, res) => {
  const client = await pool.connect();
  try {
    const { person_id, case_id, reason, priority, description, last_known_loc, region, station } = req.body;

    if (!person_id || !reason) {
      return res.status(400).json({ error: 'Required fields: person_id, reason.' });
    }

    await client.query('BEGIN');

    const personResult = await client.query('SELECT id FROM persons_of_interest WHERE id = $1', [person_id]);
    if (personResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: `Person with ID ${person_id} was not found. Open Persons of interest and use an existing ID.` });
    }

    if (case_id) {
      const caseResult = await client.query('SELECT id FROM criminal_cases WHERE id = $1', [case_id]);
      if (caseResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: `Case with ID ${case_id} was not found. Leave Case ID empty or use an existing case.` });
      }
    }

    // Generate alert reference
    const year = new Date().getFullYear();
    const countResult = await client.query("SELECT COUNT(*) FROM wanted_alerts WHERE alert_ref LIKE $1", [`WA-${year}%`]);
    const count = parseInt(countResult.rows[0].count) + 1;
    const alert_ref = `WA-${year}-${String(count).padStart(3, '0')}`;

    const result = await client.query(
      `INSERT INTO wanted_alerts (person_id, case_id, alert_ref, reason, priority, description, last_known_loc, issued_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [person_id, case_id, alert_ref, reason, priority || 'medium', description, last_known_loc, req.user.id]
    );

    await client.query('COMMIT');

    const fullPersonResult = await pool.query('SELECT * FROM persons_of_interest WHERE id = $1', [person_id]);
    notifyAlert({
      alert: result.rows[0],
      action: 'created',
      actor: req.user,
      person: fullPersonResult.rows[0] || null,
      region: region || req.user.region,
      station: station || req.user.station,
    });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => { });
    console.error('Create alert error:', err);
    res.status(500).json({ error: 'Server error.' });
  } finally { client.release(); }
});

// PUT /api/alerts/:id/authorize — Authorize alert (Judicial Authority)
router.put('/:id/authorize', authenticate, authorize('judicial_authority', 'admin'), positiveId(), validateRequest, auditLog('ALERT_AUTHORIZE', 'wanted_alerts'), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE wanted_alerts SET status = 'authorized', authorized_by = $1, authorized_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND status = 'pending' RETURNING *`,
      [req.user.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found or not in pending status.' });
    }

    // Mark person as wanted only once a judicial authority has authorized the alert
    await pool.query('UPDATE persons_of_interest SET is_wanted = true WHERE id = $1', [result.rows[0].person_id]);

    const personResult = await pool.query('SELECT * FROM persons_of_interest WHERE id = $1', [result.rows[0].person_id]);
    notifyAlert({
      alert: result.rows[0],
      action: 'authorized',
      actor: req.user,
      person: personResult.rows[0] || null,
      region: req.user.region,
      station: req.user.station,
    });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Authorize alert error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/alerts/:id/reject — Reject alert (Judicial Authority)
router.put('/:id/reject', authenticate, authorize('judicial_authority', 'admin'), [positiveId(), optionalText('rejected_reason'), validateRequest], auditLog('ALERT_REJECT', 'wanted_alerts'), async (req, res) => {
  try {
    const { rejected_reason } = req.body;
    const result = await pool.query(
      `UPDATE wanted_alerts SET status = 'rejected', authorized_by = $1, authorized_at = CURRENT_TIMESTAMP,
       rejected_reason = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND status = 'pending' RETURNING *`,
      [req.user.id, rejected_reason || 'Rejected by judicial authority', req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found or not in pending status.' });
    }

    const personResult = await pool.query('SELECT * FROM persons_of_interest WHERE id = $1', [result.rows[0].person_id]);
    notifyAlert({
      alert: result.rows[0],
      action: 'rejected',
      actor: req.user,
      person: personResult.rows[0] || null,
      region: req.user.region,
      station: req.user.station,
    });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Reject alert error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/alerts/:id/issue — Issue authorized alert
router.put('/:id/issue', authenticate, authorize('police_officer', 'admin', 'judicial_authority'), positiveId(), validateRequest, auditLog('ALERT_ISSUE', 'wanted_alerts'), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE wanted_alerts SET status = 'issued', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status = 'authorized' RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found or not in authorized status.' });
    }

    const personResult = await pool.query('SELECT * FROM persons_of_interest WHERE id = $1', [result.rows[0].person_id]);
    notifyAlert({
      alert: result.rows[0],
      action: 'issued',
      actor: req.user,
      person: personResult.rows[0] || null,
      region: req.user.region,
      station: req.user.station,
    });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Issue alert error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/alerts/:id/resolve — Resolve alert
router.put('/:id/resolve', authenticate, authorize('police_officer', 'admin'), positiveId(), validateRequest, auditLog('ALERT_RESOLVE', 'wanted_alerts'), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE wanted_alerts SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status = 'issued' RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found or not in issued status.' });
    }

    // Update person wanted status
    if (result.rows[0].person_id) {
      const activeAlerts = await pool.query(
        "SELECT COUNT(*) FROM wanted_alerts WHERE person_id = $1 AND status IN ('pending', 'authorized', 'issued')",
        [result.rows[0].person_id]
      );
      if (parseInt(activeAlerts.rows[0].count) === 0) {
        await pool.query('UPDATE persons_of_interest SET is_wanted = false WHERE id = $1', [result.rows[0].person_id]);
      }
    }

    const personResult = await pool.query('SELECT * FROM persons_of_interest WHERE id = $1', [result.rows[0].person_id]);
    notifyAlert({
      alert: result.rows[0],
      action: 'resolved',
      actor: req.user,
      person: personResult.rows[0] || null,
      region: req.user.region,
      station: req.user.station,
    });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Resolve alert error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/alerts/:id/cancel — Cancel alert
router.put('/:id/cancel', authenticate, authorize('police_officer', 'admin', 'judicial_authority'), positiveId(), validateRequest, auditLog('ALERT_CANCEL', 'wanted_alerts'), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE wanted_alerts SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status IN ('pending', 'authorized', 'issued') RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found or already resolved/cancelled.' });
    }

    const personResult = await pool.query('SELECT * FROM persons_of_interest WHERE id = $1', [result.rows[0].person_id]);
    notifyAlert({
      alert: result.rows[0],
      action: 'cancelled',
      actor: req.user,
      person: personResult.rows[0] || null,
      region: req.user.region,
      station: req.user.station,
    });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Cancel alert error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
