-- Fix: Remove user_metadata fallback from get_current_church_id()
-- raw_user_meta_data is user-editable and cannot be trusted for authorization
-- church_id must be stored in app_metadata instead

-- 1) Fix get_current_church_id: remove user_metadata fallback
CREATE OR REPLACE FUNCTION get_current_church_id()
RETURNS UUID AS $$
BEGIN
  RETURN COALESCE(
    current_setting('app.church_id', true)::uuid,
    (current_setting('request.jwt.claims', true)::json->>'church_id')::uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION get_current_church_id() IS 'Returns church_id from session (app.church_id) or JWT claims (app_metadata.church_id). NEVER reads user_metadata — it is user-editable.';

-- 2) Update handle_new_user to read church_id from app_metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, status, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_app_meta_data->>'role', 'member'),
    true,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    status = EXCLUDED.status;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user() IS 'Creates profile on signup. role is read from app_metadata (admin-controlled), name from user_metadata (user-editable).';
