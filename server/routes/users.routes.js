const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');
const { validateRequest, requiredText, optionalText, positiveId, paginationRules } = require('../middleware/validate');
const { body } = require('express-validator');

const router = express.Router();

// GET /api/users — List all users (Admin + General Inspectorate)
router.get('/', authenticate, authorize('admin', 'general_inspectorate'), paginationRules(), validateRequest, async (req, res) => {
  try {
    const { role, search } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;
    let query = 'SELECT id, email, first_name, last_name, role, badge_number, station, region, phone, is_active, last_login, created_at FROM users';
    const params = [];
    const conditions = [];

    if (role) {
      params.push(role);
      conditions.push(`role = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(first_name ILIKE $${params.length} OR last_name ILIKE $${params.length} OR email ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users${conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''}`,
      params
    );

    query += ' ORDER BY created_at DESC';
    params.push(limit);
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    res.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/users — Create new user (Admin only)
router.post('/', authenticate, authorize('admin'), [
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').isString().isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters.'),
  requiredText('first_name', 'First name', 100), requiredText('last_name', 'Last name', 100),
  body('role').isIn(['admin', 'police_officer', 'judicial_authority', 'general_inspectorate']).withMessage('Invalid user role.'),
  optionalText('badge_number', 50), optionalText('station', 200), optionalText('region', 100), optionalText('phone', 20),
  validateRequest,
], auditLog('USER_CREATE', 'users'), async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, badge_number, station, region, phone } = req.body;

    if (!email || !password || !first_name || !last_name || !role) {
      return res.status(400).json({ error: 'Required fields: email, password, first_name, last_name, role.' });
    }

    // Check if email exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, badge_number, station, region, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, email, first_name, last_name, role, badge_number, station, region, phone, is_active, created_at`,
      [email, password_hash, first_name, last_name, role, badge_number, station, region, phone]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/users/:id — Update user (Admin only)
router.put('/:id', authenticate, authorize('admin'), [
  positiveId(), body('email').optional().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('role').optional().isIn(['admin', 'police_officer', 'judicial_authority', 'general_inspectorate']).withMessage('Invalid user role.'),
  body('is_active').optional().isBoolean().withMessage('is_active must be boolean.'), validateRequest,
], auditLog('USER_UPDATE', 'users'), async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, role, badge_number, station, region, phone, is_active } = req.body;

    const result = await pool.query(
      `UPDATE users SET email = COALESCE($1, email), first_name = COALESCE($2, first_name),
       last_name = COALESCE($3, last_name), role = COALESCE($4, role), badge_number = COALESCE($5, badge_number),
       station = COALESCE($6, station), region = COALESCE($7, region), phone = COALESCE($8, phone),
       is_active = COALESCE($9, is_active), updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING id, email, first_name, last_name, role, badge_number, station, region, phone, is_active`,
      [email, first_name, last_name, role, badge_number, station, region, phone, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/users/:id — Deactivate user (Admin only)
router.delete('/:id', authenticate, authorize('admin'), positiveId(), validateRequest, auditLog('USER_DEACTIVATE', 'users'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User deactivated successfully.', id: parseInt(id) });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
