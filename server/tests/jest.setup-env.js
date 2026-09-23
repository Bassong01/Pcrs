// Points the app at an isolated local test database instead of the
// shared Supabase instance, so the automated test suite never touches
// real records.
process.env.DATABASE_URL = '';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'pcrs_test_db';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'postgres';
process.env.JWT_SECRET = 'test_jwt_secret_for_automated_tests_only';
process.env.JWT_EXPIRES_IN = '1h';
