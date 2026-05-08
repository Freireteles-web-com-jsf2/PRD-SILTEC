-- Fix get_current_church_id to also check user_metadata.church_id from JWT
CREATE OR REPLACE FUNCTION get_current_church_id()
RETURNS UUID AS $$
BEGIN
  RETURN COALESCE(
    current_setting('app.church_id', true)::uuid,
    (current_setting('request.jwt.claims', true)::json->>'church_id')::uuid,
    (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'church_id')::uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
