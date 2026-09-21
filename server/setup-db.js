/**
 * Database Setup Script
 * Creates the database, runs schema, seeds data with proper bcrypt hashes
 */
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setup() {
  // Connect to default postgres database to create our db
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    console.log('🔧 Setting up Police Criminal Record System database...\n');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'pcrs_db';
    const dbCheck = await adminPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

    if (dbCheck.rows.length === 0) {
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created.`);
    } else {
      console.log(`ℹ️  Database "${dbName}" already exists.`);
    }

    await adminPool.end();

    // Connect to our database
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

    // Run schema
    console.log('📋 Running schema...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
    await pool.query(schemaSQL);
    console.log('✅ Schema applied.');

    // Hash passwords for demo accounts
    console.log('🔐 Hashing demo passwords...');
    const salt = await bcrypt.genSalt(10);
    const passwords = {
      admin: await bcrypt.hash('Admin123!', salt),
      officer: await bcrypt.hash('Officer123!', salt),
      judge: await bcrypt.hash('Judge123!', salt),
      inspector: await bcrypt.hash('Inspector123!', salt),
    };

    // Read and modify seed data with real bcrypt hashes
    let seedSQL = fs.readFileSync(path.join(__dirname, '..', 'database', 'seed.sql'), 'utf8');

    // Replace placeholder hashes in order of appearance in the INSERT
    const placeholders = seedSQL.match(/\$2b\$10\$placeholder/g);
    if (placeholders) {
      // The seed file has 6 users: admin, officer, judge, inspector, officer2, officer3
      const hashOrder = [passwords.admin, passwords.officer, passwords.judge, passwords.inspector, passwords.officer, passwords.officer];
      let idx = 0;
      seedSQL = seedSQL.replace(/\$2b\$10\$placeholder/g, () => hashOrder[idx++]);
    }

    console.log('🌱 Seeding demo data...');
    await pool.query(seedSQL);
    console.log('✅ Demo data seeded.');

    await pool.end();

    console.log('\n🎉 Database setup complete!\n');
    console.log('Demo Accounts:');
    console.log('  Admin:              admin              / Admin123!');
    console.log('  Police officer:     policeofficer      / Officer123!');
    console.log('  Judicial authority: judicialauthority  / Judge123!');
    console.log('  Inspectorate:       inspectorate       / Inspector123!\n');

  } catch (err) {
    console.error('❌ Setup error:', err.message);
    process.exit(1);
  }
}

setup();
