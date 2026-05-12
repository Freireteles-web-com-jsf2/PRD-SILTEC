-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to set audit columns from current user
-- Only sets fields that exist in the table
CREATE OR REPLACE FUNCTION set_audit_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF HAS_COLUMN('public', TG_TABLE_NAME, 'created_by') THEN
      IF NEW.created_by IS NULL THEN
        NEW.created_by = get_current_church_id();
      END IF;
    END IF;
    IF HAS_COLUMN('public', TG_TABLE_NAME, 'updated_by') THEN
      IF NEW.updated_by IS NULL THEN
        NEW.updated_by = get_current_church_id();
      END IF;
    END IF;
    IF HAS_COLUMN('public', TG_TABLE_NAME, 'recorded_by') THEN
      IF NEW.recorded_by IS NULL THEN
        NEW.recorded_by = get_current_church_id();
      END IF;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF HAS_COLUMN('public', TG_TABLE_NAME, 'updated_by') THEN
      NEW.updated_by = get_current_church_id();
    END IF;
    IF HAS_COLUMN('public', TG_TABLE_NAME, 'recorded_by') THEN
      NEW.recorded_by = get_current_church_id();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create helper function to check if column exists
CREATE OR REPLACE FUNCTION HAS_COLUMN(schemaname text, tablename text, columnname text)
RETURNS BOOLEAN AS $$
BEGIN
  PERFORM 1 FROM information_schema.columns 
  WHERE table_schema = schemaname 
    AND table_name = tablename 
    AND column_name = columnname;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to set church_id from session for inserts
CREATE OR REPLACE FUNCTION set_church_id_default()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.church_id IS NULL THEN
    NEW.church_id = get_current_church_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_member_timeline_updated_at ON member_timeline;
DROP TRIGGER IF EXISTS set_member_timeline_audit ON member_timeline;
DROP TRIGGER IF EXISTS update_member_roles_updated_at ON member_roles;
DROP TRIGGER IF EXISTS set_member_roles_audit ON member_roles;
DROP TRIGGER IF EXISTS update_member_attendances_updated_at ON member_attendances;
DROP TRIGGER IF EXISTS set_member_attendances_audit ON member_attendances;

-- Apply triggers to all tables

-- members table
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_members_audit
  BEFORE INSERT OR UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_members_church_id
  BEFORE INSERT ON members
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();

-- family_groups table
CREATE TRIGGER update_family_groups_updated_at
  BEFORE UPDATE ON family_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_family_groups_audit
  BEFORE INSERT OR UPDATE ON family_groups
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_family_groups_church_id
  BEFORE INSERT ON family_groups
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();

-- family_members table
CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_family_members_audit
  BEFORE INSERT OR UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_family_members_church_id
  BEFORE INSERT ON family_members
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();

-- member_timeline table
CREATE TRIGGER update_member_timeline_updated_at
  BEFORE UPDATE ON member_timeline
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_member_timeline_audit
  BEFORE INSERT OR UPDATE ON member_timeline
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_member_timeline_church_id
  BEFORE INSERT ON member_timeline
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();

-- member_roles table
CREATE TRIGGER update_member_roles_updated_at
  BEFORE UPDATE ON member_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_member_roles_audit
  BEFORE INSERT OR UPDATE ON member_roles
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_member_roles_church_id
  BEFORE INSERT ON member_roles
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();

-- member_attendances table
CREATE TRIGGER update_member_attendances_updated_at
  BEFORE UPDATE ON member_attendances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_member_attendances_audit
  BEFORE INSERT OR UPDATE ON member_attendances
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_member_attendances_church_id
  BEFORE INSERT ON member_attendances
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();

-- events table
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_events_audit
  BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_events_church_id
  BEFORE INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();

COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger function to auto-update updated_at column on UPDATE';
COMMENT ON FUNCTION set_audit_columns() IS 'Trigger function to auto-set audit columns from session';
COMMENT ON FUNCTION set_church_id_default() IS 'Trigger function to auto-set church_id from session on INSERT';
COMMENT ON FUNCTION HAS_COLUMN(text,text,text) IS 'Helper to check if column exists in table';