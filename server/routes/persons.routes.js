const express = require('express');
const path = require('path');
const multer = require('multer');
const pool = require('../config/db');
const supabase = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');
const { validateRequest, requiredText, optionalText, positiveId, paginationRules } = require('../middleware/validate');
const { body } = require('express-validator');

const router = express.Router();

const PHOTO_BUCKET = 'person-photos';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed.'));
  },
});

// GET /api/persons — List / search persons of interest
router.get('/', authenticate, paginationRules(), validateRequest, async (req, res) => {
  try {
    const { search, wanted } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;
    let query = `SELECT p.*, u.first_name || ' ' || u.last_name as registered_by_name,
                 (SELECT COUNT(*) FROM criminal_records cr WHERE cr.person_id = p.id) as records_count,
                 (SELECT COUNT(*) FROM case_persons cp WHERE cp.person_id = p.id) as cases_count
                 FROM persons_of_interest p
                 JOIN users u ON p.registered_by = u.id`;
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(p.first_name ILIKE $${params.length} OR p.last_name ILIKE $${params.length} OR p.alias ILIKE $${params.length} OR p.id_number ILIKE $${params.length})`);
    }
    if (wanted === 'true') {
      conditions.push('p.is_wanted = true');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const countParams = params.slice();
    const countQuery = `SELECT COUNT(*) FROM persons_of_interest p${conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : ''}`;
    const countResult = await pool.query(countQuery, countParams);

    query += ' ORDER BY p.created_at DESC';
    params.push(parseInt(limit));
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    res.json({
      persons: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (err) {
    console.error('Get persons error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/persons/:id — Get person details
router.get('/:id', authenticate, positiveId(), validateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const personResult = await pool.query(
      `SELECT p.*, u.first_name || ' ' || u.last_name as registered_by_name
       FROM persons_of_interest p JOIN users u ON p.registered_by = u.id WHERE p.id = $1`, [id]
    );

    if (personResult.rows.length === 0) {
      return res.status(404).json({ error: 'Person not found.' });
    }

    // Get criminal records
    const recordsResult = await pool.query(
      'SELECT * FROM criminal_records WHERE person_id = $1 ORDER BY offence_date DESC', [id]
    );

    // Get linked cases
    const casesResult = await pool.query(
      `SELECT c.*, cp.role_in_case FROM criminal_cases c
       JOIN case_persons cp ON c.id = cp.case_id WHERE cp.person_id = $1 ORDER BY c.created_at DESC`, [id]
    );

    // Get wanted alerts
    const alertsResult = await pool.query(
      'SELECT * FROM wanted_alerts WHERE person_id = $1 ORDER BY created_at DESC', [id]
    );

    res.json({
      ...personResult.rows[0],
      criminal_records: recordsResult.rows,
      cases: casesResult.rows,
      alerts: alertsResult.rows
    });
  } catch (err) {
    console.error('Get person error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

router.post('/:id/photo', authenticate, authorize('police_officer', 'admin'), upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Photo file is required.' });
    }

    const ext = path.extname(req.file.originalname) || '.jpg';
    const objectPath = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(objectPath, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return res.status(500).json({ error: 'Server error while uploading photo.' });
    }

    const { data: publicUrlData } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(objectPath);
    const photoUrl = publicUrlData.publicUrl;

    const result = await pool.query(
      `UPDATE persons_of_interest SET photo_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [photoUrl, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Person not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Upload person photo error:', err);
    res.status(500).json({ error: 'Server error while uploading photo.' });
  }
});

// POST /api/persons — Register new person of interest
router.post('/', authenticate, authorize('police_officer', 'admin'), [
  optionalText('first_name', 100), optionalText('last_name', 100),
  optionalText('alias', 200), optionalText('nationality', 100), optionalText('id_number', 100), optionalText('phone', 20),
  optionalText('address'), optionalText('physical_desc'), optionalText('photo_url'),
  body('date_of_birth').optional().isISO8601().withMessage('date_of_birth must be a valid date.'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender.'), validateRequest,
], auditLog('PERSON_CREATE', 'persons_of_interest'), async (req, res) => {
  try {
    const { first_name, last_name, alias, date_of_birth, gender, nationality, id_number, phone, address, physical_desc, photo_url } = req.body;

    const safeFirstName = (first_name || '').trim() || 'Unknown';
    const safeLastName = (last_name || '').trim() || 'Suspect';

    const result = await pool.query(
      `INSERT INTO persons_of_interest (first_name, last_name, alias, date_of_birth, gender, nationality, id_number, phone, address, physical_desc, photo_url, registered_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [safeFirstName, safeLastName, alias, date_of_birth, gender, nationality || 'Cameroonian', id_number, phone, address, physical_desc, photo_url, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create person error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/persons/:id — Update person
router.put('/:id', authenticate, authorize('police_officer', 'admin'), [
  positiveId(), body('date_of_birth').optional().isISO8601().withMessage('date_of_birth must be a valid date.'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender.'), validateRequest,
], auditLog('PERSON_UPDATE', 'persons_of_interest'), async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, alias, date_of_birth, gender, nationality, id_number, phone, address, physical_desc, photo_url } = req.body;

    const result = await pool.query(
      `UPDATE persons_of_interest SET
       first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name),
       alias = COALESCE($3, alias), date_of_birth = COALESCE($4, date_of_birth),
       gender = COALESCE($5, gender), nationality = COALESCE($6, nationality),
       id_number = COALESCE($7, id_number), phone = COALESCE($8, phone),
       address = COALESCE($9, address), physical_desc = COALESCE($10, physical_desc),
       photo_url = COALESCE($11, photo_url), updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 RETURNING *`,
      [first_name, last_name, alias, date_of_birth, gender, nationality, id_number, phone, address, physical_desc, photo_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Person not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update person error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
