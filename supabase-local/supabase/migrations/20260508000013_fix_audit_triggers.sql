-- Fix audit triggers to handle missing columns

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_audit_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=TG_TABLE_NAME AND column_name='created_by') THEN
      IF NEW.created_by IS NULL THEN NEW.created_by = get_current_church_id(); END IF;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=TG_TABLE_NAME AND column_name='updated_by') THEN
      IF NEW.updated_by IS NULL THEN NEW.updated_by = get_current_church_id(); END IF;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=TG_TABLE_NAME AND column_name='updated_by') THEN
      NEW.updated_by = get_current_church_id();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_church_id_default()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.church_id IS NULL THEN NEW.church_id = get_current_church_id(); END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remove and recreate triggers for member_timeline
DROP TRIGGER IF EXISTS update_member_timeline_updated_at ON member_timeline;
DROP TRIGGER IF EXISTS set_member_timeline_audit ON member_timeline;
DROP TRIGGER IF EXISTS set_member_timeline_church_id ON member_timeline;

CREATE TRIGGER update_member_timeline_updated_at
  BEFORE UPDATE ON member_timeline
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_member_timeline_audit
  BEFORE INSERT OR UPDATE ON member_timeline
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_member_timeline_church_id
  BEFORE INSERT ON member_timeline
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();

-- Remove and recreate triggers for member_roles
DROP TRIGGER IF EXISTS update_member_roles_updated_at ON member_roles;
DROP TRIGGER IF EXISTS set_member_roles_audit ON member_roles;
DROP TRIGGER IF EXISTS set_member_roles_church_id ON member_roles;

CREATE TRIGGER update_member_roles_updated_at
  BEFORE UPDATE ON member_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_member_roles_audit
  BEFORE INSERT OR UPDATE ON member_roles
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_member_roles_church_id
  BEFORE INSERT ON member_roles
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();

-- Remove and recreate triggers for member_attendances
DROP TRIGGER IF EXISTS update_member_attendances_updated_at ON member_attendances;
DROP TRIGGER IF EXISTS set_member_attendances_audit ON member_attendances;
DROP TRIGGER IF EXISTS set_member_attendances_church_id ON member_attendances;

CREATE TRIGGER update_member_attendances_updated_at
  BEFORE UPDATE ON member_attendances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_member_attendances_audit
  BEFORE INSERT OR UPDATE ON member_attendances
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER set_member_attendances_church_id
  BEFORE INSERT ON member_attendances
  FOR EACH ROW EXECUTE FUNCTION set_church_id_default();