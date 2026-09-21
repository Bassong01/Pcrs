-- ============================================================
-- Police Criminal Record System — PostgreSQL Schema
-- Based on UML Class Diagram from Internship Report
-- ============================================================

-- Clean up if re-running
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS wanted_alerts CASCADE;
DROP TABLE IF EXISTS criminal_records CASCADE;
DROP TABLE IF EXISTS case_persons CASCADE;
DROP TABLE IF EXISTS persons_of_interest CASCADE;
DROP TABLE IF EXISTS criminal_cases CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS case_status CASCADE;
DROP TYPE IF EXISTS alert_status CASCADE;
DROP TYPE IF EXISTS alert_priority CASCADE;
DROP TYPE IF EXISTS gender_type CASCADE;
DROP TYPE IF EXISTS record_verification CASCADE;

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'admin',
  'police_officer',
  'judicial_authority',
  'general_inspectorate'
);

CREATE TYPE case_status AS ENUM (
  'open',
  'under_investigation',
  'closed',
  'archived'
);

CREATE TYPE alert_status AS ENUM (
  'pending',
  'authorized',
  'rejected',
  'issued',
  'resolved',
  'cancelled'
);

CREATE TYPE alert_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE gender_type AS ENUM (
  'male',
  'female',
  'other'
);

CREATE TYPE record_verification AS ENUM (
  'unverified',
  'verified',
  'flagged'
);

-- ============================================================
-- USERS TABLE
-- Represents: User (abstract), AdminOfficer, PoliceOfficer,
--             JudicialAuthority, GeneralInspectorate
-- ============================================================

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  role          user_role NOT NULL,
  badge_number  VARCHAR(50) UNIQUE,
  station       VARCHAR(200),
  region        VARCHAR(100),
  phone         VARCHAR(20),
  is_active     BOOLEAN DEFAULT TRUE,
  last_login    TIMESTAMP,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'System accounts and access roles for authorized personnel.';
COMMENT ON COLUMN users.id IS 'Unique user identifier.';
COMMENT ON COLUMN users.email IS 'Unique login username.';
COMMENT ON COLUMN users.password_hash IS 'Encrypted password hash; never store plain-text passwords.';
COMMENT ON COLUMN users.first_name IS 'User given name.';
COMMENT ON COLUMN users.last_name IS 'User family name.';
COMMENT ON COLUMN users.role IS 'Permission category assigned to the user.';
COMMENT ON COLUMN users.badge_number IS 'Official badge or staff identifier.';
COMMENT ON COLUMN users.station IS 'Assigned office, station, or institution.';
COMMENT ON COLUMN users.region IS 'Administrative region of assignment.';
COMMENT ON COLUMN users.phone IS 'Contact telephone number.';
COMMENT ON COLUMN users.is_active IS 'Whether the account can currently sign in.';
COMMENT ON COLUMN users.last_login IS 'Most recent successful sign-in time.';
COMMENT ON COLUMN users.created_at IS 'Time the account was created.';
COMMENT ON COLUMN users.updated_at IS 'Time the account was last updated.';

-- ============================================================
-- CRIMINAL CASES TABLE
-- Represents: CriminalCase class
-- ============================================================

CREATE TABLE criminal_cases (
  id              SERIAL PRIMARY KEY,
  reference_no    VARCHAR(50) UNIQUE NOT NULL,
  title           VARCHAR(300) NOT NULL,
  nature          VARCHAR(200) NOT NULL,
  description     TEXT,
  location        VARCHAR(300),
  region          VARCHAR(100),
  incident_date   DATE NOT NULL,
  status          case_status DEFAULT 'open',
  registered_by   INTEGER NOT NULL REFERENCES users(id),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE criminal_cases IS 'Registered criminal cases and their investigation status.';

-- ============================================================
-- PERSONS OF INTEREST TABLE
-- Represents: PersonOfInterest class
-- ============================================================

CREATE TABLE persons_of_interest (
  id                SERIAL PRIMARY KEY,
  first_name        VARCHAR(100) NOT NULL,
  last_name         VARCHAR(100) NOT NULL,
  alias             VARCHAR(200),
  date_of_birth     DATE,
  gender            gender_type,
  nationality       VARCHAR(100) DEFAULT 'Cameroonian',
  id_number         VARCHAR(100),
  phone             VARCHAR(20),
  address           VARCHAR(500),
  physical_desc     TEXT,
  photo_url         VARCHAR(500),
  is_wanted         BOOLEAN DEFAULT FALSE,
  registered_by     INTEGER NOT NULL REFERENCES users(id),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE persons_of_interest IS 'Identity and investigation details for persons linked to cases.';

-- ============================================================
-- CASE-PERSONS JUNCTION TABLE
-- Many-to-Many: CriminalCase <-> PersonOfInterest
-- ============================================================

CREATE TABLE case_persons (
  id          SERIAL PRIMARY KEY,
  case_id     INTEGER NOT NULL REFERENCES criminal_cases(id) ON DELETE CASCADE,
  person_id   INTEGER NOT NULL REFERENCES persons_of_interest(id) ON DELETE CASCADE,
  role_in_case VARCHAR(100) DEFAULT 'suspect',
  added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(case_id, person_id)
);
COMMENT ON TABLE case_persons IS 'Links cases to persons and records each person''s role in a case.';

-- ============================================================
-- CRIMINAL RECORDS TABLE
-- Represents: CriminalRecord class (composition with PersonOfInterest)
-- ============================================================

CREATE TABLE criminal_records (
  id                  SERIAL PRIMARY KEY,
  person_id           INTEGER NOT NULL REFERENCES persons_of_interest(id) ON DELETE CASCADE,
  offence             VARCHAR(300) NOT NULL,
  offence_date        DATE,
  offence_location    VARCHAR(300),
  sentence            VARCHAR(500),
  court               VARCHAR(200),
  verdict_date        DATE,
  verification_status record_verification DEFAULT 'unverified',
  verified_by         INTEGER REFERENCES users(id),
  verified_at         TIMESTAMP,
  notes               TEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE criminal_records IS 'Court and offence history associated with a person.';

-- ============================================================
-- WANTED ALERTS TABLE
-- Represents: WantedAlert class with lifecycle states
-- ============================================================

CREATE TABLE wanted_alerts (
  id              SERIAL PRIMARY KEY,
  person_id       INTEGER NOT NULL REFERENCES persons_of_interest(id),
  case_id         INTEGER REFERENCES criminal_cases(id),
  alert_ref       VARCHAR(50) UNIQUE NOT NULL,
  reason          TEXT NOT NULL,
  priority        alert_priority DEFAULT 'medium',
  status          alert_status DEFAULT 'pending',
  description     TEXT,
  last_known_loc  VARCHAR(300),
  issued_by       INTEGER NOT NULL REFERENCES users(id),
  authorized_by   INTEGER REFERENCES users(id),
  authorized_at   TIMESTAMP,
  rejected_reason TEXT,
  resolved_at     TIMESTAMP,
  cancelled_at    TIMESTAMP,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE wanted_alerts IS 'Requests and issued alerts for wanted persons.';

-- ============================================================
-- AUDIT LOGS TABLE
-- Represents: AuditLog class
-- ============================================================

CREATE TABLE audit_logs (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id),
  action        VARCHAR(100) NOT NULL,
  entity_type   VARCHAR(100),
  entity_id     INTEGER,
  details       TEXT,
  ip_address    VARCHAR(45),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE audit_logs IS 'Immutable history of important actions performed in the system.';

-- ============================================================
-- INDEXES for performance
-- ============================================================

CREATE INDEX idx_cases_status ON criminal_cases(status);
CREATE INDEX idx_cases_region ON criminal_cases(region);
CREATE INDEX idx_cases_registered_by ON criminal_cases(registered_by);
CREATE INDEX idx_persons_name ON persons_of_interest(last_name, first_name);
CREATE INDEX idx_persons_id_number ON persons_of_interest(id_number);
CREATE INDEX idx_records_person ON criminal_records(person_id);
CREATE INDEX idx_alerts_status ON wanted_alerts(status);
CREATE INDEX idx_alerts_person ON wanted_alerts(person_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
