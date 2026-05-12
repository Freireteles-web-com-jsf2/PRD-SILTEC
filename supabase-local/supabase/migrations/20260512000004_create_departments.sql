-- Create departments table and add FK constraints to existing tables

-- 1) Create departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID,
  updated_by UUID
);

-- 2) Indexes
CREATE INDEX idx_departments_church_id ON departments(church_id);
CREATE INDEX idx_departments_church_id_status ON departments(church_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_leader ON departments(leader_id);

-- 3) Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- 4) RLS policies
CREATE POLICY departments_select ON departments
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY departments_insert ON departments
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY departments_update ON departments
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY departments_delete ON departments
  FOR DELETE USING (church_id = get_current_church_id());

GRANT SELECT, INSERT, UPDATE, DELETE ON departments TO authenticated;

-- 5) Add FK constraints to existing tables (NOT VALID to avoid failures with existing data)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'members_department_id_fkey'
  ) THEN
    ALTER TABLE members ADD CONSTRAINT members_department_id_fkey
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'events_department_id_fkey'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_department_id_fkey
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'member_roles_department_id_fkey'
  ) THEN
    ALTER TABLE member_roles ADD CONSTRAINT member_roles_department_id_fkey
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL NOT VALID;
  END IF;
END $$;

-- 6) Validate FKs (background-friendly, won't lock for long)
ALTER TABLE members VALIDATE CONSTRAINT members_department_id_fkey;
ALTER TABLE events VALIDATE CONSTRAINT events_department_id_fkey;
ALTER TABLE member_roles VALIDATE CONSTRAINT member_roles_department_id_fkey;

-- 7) Add department_id FK on family_groups.leader_id too
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'departments_leader_id_fkey'
  ) THEN
    ALTER TABLE departments ADD CONSTRAINT departments_leader_id_fkey
      FOREIGN KEY (leader_id) REFERENCES members(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 8) Trigger: updated_at for departments
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_departments_audit
  BEFORE INSERT OR UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_departments_church_id
  BEFORE INSERT ON departments
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();

COMMENT ON TABLE departments IS 'Church departments/ministries for organizing members and events';
COMMENT ON COLUMN departments.leader_id IS 'Member who leads this department (references members.id)';
