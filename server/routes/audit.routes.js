const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest, paginationRules } = require('../middleware/validate');

const router = express.Router();

// GET /api/audit — List audit logs (Admin + General Inspectorate)
router.get('/', authenticate, authorize('admin', 'general_inspectorate'), paginationRules(30), validateRequest, async (req, res) => {
  try {
    const { action, user_id, entity_type, from_date, to_date } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const offset = (page - 1) * limit;
    let query = `SELECT al.*, u.first_name || ' ' || u.last_name as user_name, u.role as user_role
                 FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id`;
    const params = [];
    const conditions = [];

    if (action) {
      params.push(action);
      conditions.push(`al.action = $${params.length}`);
    }
    if (user_id) {
      params.push(user_id);
      conditions.push(`al.user_id = $${params.length}`);
    }
    if (entity_type) {
      params.push(entity_type);
      conditions.push(`al.entity_type = $${params.length}`);
    }
    if (from_date) {
      params.push(from_date);
      conditions.push(`al.created_at >= $${params.length}`);
    }
    if (to_date) {
      params.push(to_date);
      conditions.push(`al.created_at <= $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const countParams = params.slice();
    const countQuery = `SELECT COUNT(*) FROM audit_logs al${conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''}`;
    const countResult = await pool.query(countQuery, countParams);

    query += ' ORDER BY al.created_at DESC';
    params.push(parseInt(limit));
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    res.json({
      logs: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) {
    console.error('Get audit logs error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
