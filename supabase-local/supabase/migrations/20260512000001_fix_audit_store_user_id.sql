-- Fix: set_audit_columns() now stores auth.uid() in created_by/updated_by
-- instead of get_current_church_id() (which returns church_id, not user_id)

CREATE OR REPLACE FUNCTION set_audit_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=TG_TABLE_NAME AND column_name='created_by') THEN
      IF NEW.created_by IS NULL THEN NEW.created_by = auth.uid(); END IF;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=TG_TABLE_NAME AND column_name='updated_by') THEN
      IF NEW.updated_by IS NULL THEN NEW.updated_by = auth.uid(); END IF;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=TG_TABLE_NAME AND column_name='updated_by') THEN
      NEW.updated_by = auth.uid();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION set_audit_columns() IS 'Trigger function to auto-set created_by/updated_by from auth.uid() on INSERT/UPDATE';
