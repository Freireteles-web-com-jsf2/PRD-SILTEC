-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create helper function to get current church_id from JWT
CREATE OR REPLACE FUNCTION get_current_church_id()
RETURNS UUID AS $$
BEGIN
  RETURN COALESCE(
    current_setting('app.church_id', true)::uuid,
    (current_setting('request.jwt.claims', true)::json->>'church_id')::uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create policy helper function (in public schema)
CREATE OR REPLACE FUNCTION check_church_access(table_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if church_id is set in app settings or JWT claims
  RETURN current_setting('app.church_id', true) IS NOT NULL 
     AND current_setting('app.church_id', true) != ''
     OR current_setting('request.jwt.claims', true)::json->>'church_id' IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_church_id() TO authenticated;
GRANT EXECUTE ON FUNCTION check_church_access(TEXT) TO authenticated;

COMMENT ON FUNCTION get_current_church_id() IS 'Returns the current church_id from session context (settings or JWT) for RLS policies';
COMMENT ON FUNCTION check_church_access(TEXT) IS 'Helper to check if user has access to a table based on church_id';