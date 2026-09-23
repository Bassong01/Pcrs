const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const app = require('../app');

describe('Criminal Record Verification (Local Register)', () => {
  let officerToken;
  let recordId;

  beforeAll(async () => {
    await pool.query('TRUNCATE TABLE audit_logs, criminal_records, persons_of_interest, users RESTART IDENTITY CASCADE');

    const passwordHash = await bcrypt.hash('Officer123!', 10);
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, badge_number, station, region)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      ['policeofficer', passwordHash, 'Jean', 'Mballa', 'police_officer', 'PO-014', 'Yaoundé Central', 'Centre']
    );
    const officerId = userResult.rows[0].id;
    officerToken = jwt.sign(
      { id: officerId, email: 'policeofficer', role: 'police_officer' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const personResult = await pool.query(
      `INSERT INTO persons_of_interest (first_name, last_name, id_number, registered_by)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Marcel', 'Ebogo', 'CM-ID-77213', officerId]
    );

    const recordResult = await pool.query(
      `INSERT INTO criminal_records (person_id, offence, offence_date, court)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [personResult.rows[0].id, 'Receiving Stolen Goods', '2025-03-11', 'Douala High Court']
    );
    recordId = recordResult.rows[0].id;
  });

  afterAll(async () => {
    await pool.end();
  });

  test('TC-05: rejects unauthenticated access to the register', async () => {
    const res = await request(app).get('/api/records');
    expect(res.status).toBe(401);
  });

  test('TC-05: newly created records default to unverified', async () => {
    const res = await request(app).get('/api/records').set('Authorization', `Bearer ${officerToken}`);
    expect(res.status).toBe(200);
    const record = res.body.records.find((r) => r.id === recordId);
    expect(record.verification_status).toBe('unverified');
  });

  test('TC-05: marks a record as verified against the local register', async () => {
    const res = await request(app)
      .put(`/api/records/${recordId}/verify`)
      .set('Authorization', `Bearer ${officerToken}`)
      .send({ verification_status: 'verified', notes: 'Confirmed against Douala High Court docket.' });
    expect(res.status).toBe(200);
    expect(res.body.verification_status).toBe('verified');
    expect(res.body.verified_by).toBeDefined();
  });

  test('TC-05: flags a record when the local register is inconclusive', async () => {
    const res = await request(app)
      .put(`/api/records/${recordId}/verify`)
      .set('Authorization', `Bearer ${officerToken}`)
      .send({ verification_status: 'flagged', notes: 'Discrepancy in offence date needs review.' });
    expect(res.status).toBe(200);
    expect(res.body.verification_status).toBe('flagged');
  });

  test('TC-05: returns 404 when verifying a record that does not exist', async () => {
    const res = await request(app)
      .put('/api/records/999999/verify')
      .set('Authorization', `Bearer ${officerToken}`)
      .send({ verification_status: 'verified' });
    expect(res.status).toBe(404);
  });
});
