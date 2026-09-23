const request = require('supertest');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const app = require('../app');

describe('Authentication Testing (Login)', () => {
  beforeAll(async () => {
    await pool.query('TRUNCATE TABLE audit_logs, criminal_records, persons_of_interest, users RESTART IDENTITY CASCADE');
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, badge_number, station, region)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      ['admin', passwordHash, 'Claude', 'Abanda', 'admin', 'ADM-001', 'DITT Headquarters', 'Centre']
    );
  });

  afterAll(async () => {
    await pool.end();
  });

  test('TC-01: rejects login with an unknown username', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'ghost', password: 'Whatever123!' });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  test('TC-01: rejects login with a wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin', password: 'WrongPass123!' });
    expect(res.status).toBe(401);
  });

  test('TC-02: accepts login with valid credentials and returns a signed JWT', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'admin', password: 'Admin123!' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('admin');
    expect(res.body.user.role).toBe('admin');
  });

  test('TC-02: /api/auth/me rejects requests without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('TC-02: /api/auth/me returns the profile for a valid token', async () => {
    const login = await request(app).post('/api/auth/login').send({ email: 'admin', password: 'Admin123!' });
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('admin');
    expect(res.body.role).toBe('admin');
  });
});
