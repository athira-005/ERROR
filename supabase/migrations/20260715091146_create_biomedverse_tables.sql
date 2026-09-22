/*
# BioMedVerse: Create progress tracking tables (single-tenant, no auth)

1. New Tables
- `lab_progress`: Tracks per-device lab completion and module progress
  - id (uuid PK)
  - device_id (text, which device)
  - module (text, which module: intro, working-principle, components, block-diagram, maintenance, troubleshooting, viva, quiz, lab)
  - completed (boolean)
  - score (int, for quiz scores)
  - created_at, updated_at (timestamps)
- `quiz_results`: Stores quiz attempt results
  - id (uuid PK)
  - device_id (text)
  - score (int, percentage)
  - total_questions (int)
  - correct_answers (int)
  - created_at (timestamp)
- `favorites`: Stores favorited devices
  - id (uuid PK)
  - device_id (text)
  - created_at (timestamp)
- `recent_access`: Tracks recently accessed modules
  - id (uuid PK)
  - device_id (text)
  - module (text)
  - accessed_at (timestamp)
- `certificates`: Earned certificates
  - id (uuid PK)
  - device_id (text)
  - certificate_type (text)
  - created_at (timestamp)

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD on all tables (single-tenant, no auth, data is intentionally shared/public).
*/

CREATE TABLE IF NOT EXISTS lab_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  module text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  score int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(device_id, module)
);

ALTER TABLE lab_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_lab_progress" ON lab_progress;
CREATE POLICY "anon_select_lab_progress" ON lab_progress FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_lab_progress" ON lab_progress;
CREATE POLICY "anon_insert_lab_progress" ON lab_progress FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_lab_progress" ON lab_progress;
CREATE POLICY "anon_update_lab_progress" ON lab_progress FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_lab_progress" ON lab_progress;
CREATE POLICY "anon_delete_lab_progress" ON lab_progress FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  score int NOT NULL DEFAULT 0,
  total_questions int NOT NULL DEFAULT 0,
  correct_answers int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_quiz_results" ON quiz_results;
CREATE POLICY "anon_select_quiz_results" ON quiz_results FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_quiz_results" ON quiz_results;
CREATE POLICY "anon_insert_quiz_results" ON quiz_results FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_quiz_results" ON quiz_results;
CREATE POLICY "anon_delete_quiz_results" ON quiz_results FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_favorites" ON favorites;
CREATE POLICY "anon_select_favorites" ON favorites FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_favorites" ON favorites;
CREATE POLICY "anon_insert_favorites" ON favorites FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_favorites" ON favorites;
CREATE POLICY "anon_delete_favorites" ON favorites FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS recent_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  module text NOT NULL,
  accessed_at timestamptz DEFAULT now()
);

ALTER TABLE recent_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_recent_access" ON recent_access;
CREATE POLICY "anon_select_recent_access" ON recent_access FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_recent_access" ON recent_access;
CREATE POLICY "anon_insert_recent_access" ON recent_access FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_recent_access" ON recent_access;
CREATE POLICY "anon_delete_recent_access" ON recent_access FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  certificate_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_certificates" ON certificates;
CREATE POLICY "anon_select_certificates" ON certificates FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_certificates" ON certificates;
CREATE POLICY "anon_insert_certificates" ON certificates FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_certificates" ON certificates;
CREATE POLICY "anon_delete_certificates" ON certificates FOR DELETE
  TO anon, authenticated USING (true);
