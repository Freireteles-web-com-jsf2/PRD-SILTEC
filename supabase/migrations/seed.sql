-- Seed data for testing (development only)
-- Run: supabase db push --include-seed

-- Church ID for testing
DO $$
DECLARE
  test_church_id UUID := '00000000-0000-0000-0000-000000000001'::UUID;
BEGIN
  -- Only insert if church_id doesn't exist yet
  IF NOT EXISTS (SELECT 1 FROM members WHERE church_id = test_church_id LIMIT 1) THEN
  
    -- Insert family groups
    INSERT INTO family_groups (church_id, name, description, status)
    VALUES 
      (test_church_id, 'Família Silva', 'Grupo familiar dos Silva', true),
      (test_church_id, 'Família Santos', 'Grupo familiar dos Santos', true)
    ON CONFLICT DO NOTHING;

    -- Insert members
    INSERT INTO members (church_id, name, birth_date, gender, marital_status, phone, email, status)
    VALUES 
      (test_church_id, 'João Silva', '1980-05-15', 'male', 'married', '(11) 99999-0001', 'joao.silva@email.com', true),
      (test_church_id, 'Maria Silva', '1982-08-20', 'female', 'married', '(11) 99999-0002', 'maria.silva@email.com', true),
      (test_church_id, 'Pedro Silva', '2010-03-10', 'male', 'single', '(11) 99999-0003', 'pedro.silva@email.com', true),
      (test_church_id, 'Carlos Santos', '1975-12-20', 'male', 'single', '(11) 99999-0010', 'carlos.santos@email.com', true),
      (test_church_id, 'Paulo Santos', '1970-03-25', 'male', 'married', '(11) 99999-0020', 'paulo.santos@email.com', true),
      (test_church_id, 'Ana Santos', '1973-07-14', 'female', 'married', '(11) 99999-0021', 'ana.santos@email.com', true)
    ON CONFLICT DO NOTHING;

    -- Update family group leaders
    UPDATE family_groups 
    SET leader_id = (SELECT id FROM members WHERE church_id = test_church_id AND name = 'João Silva' LIMIT 1)
    WHERE church_id = test_church_id AND name = 'Família Silva';

    UPDATE family_groups 
    SET leader_id = (SELECT id FROM members WHERE church_id = test_church_id AND name = 'Paulo Santos' LIMIT 1)
    WHERE church_id = test_church_id AND name = 'Família Santos';

    -- Insert family relationships
    INSERT INTO family_members (church_id, family_group_id, member_id, relationship, is_primary_contact)
    SELECT test_church_id, fg.id, m.id, 
      CASE m.name
        WHEN 'João Silva' THEN 'husband'::family_relationship_type
        WHEN 'Maria Silva' THEN 'wife'::family_relationship_type
        WHEN 'Pedro Silva' THEN 'son'::family_relationship_type
        WHEN 'Paulo Santos' THEN 'husband'::family_relationship_type
        WHEN 'Ana Santos' THEN 'wife'::family_relationship_type
      END::family_relationship_type,
      CASE WHEN m.name = 'João Silva' OR m.name = 'Paulo Santos' THEN true ELSE false END
    FROM family_groups fg
    CROSS JOIN members m
    WHERE fg.church_id = test_church_id 
      AND m.church_id = test_church_id
      AND (
        (fg.name = 'Família Silva' AND m.name IN ('João Silva', 'Maria Silva', 'Pedro Silva'))
        OR (fg.name = 'Família Santos' AND m.name IN ('Paulo Santos', 'Ana Santos'))
      )
    ON CONFLICT DO NOTHING;

    -- Insert events
    INSERT INTO events (church_id, title, description, event_type, start_date, end_date, location, status)
    VALUES 
      (test_church_id, 'Culto Dominical', 'Culto de adoração semanal', 'culto', '2026-05-03 09:00:00', '2026-05-03 11:00:00', 'Templo Principal', 'completed'),
      (test_church_id, 'Culto de Oração', 'Culto de intercessão', 'culto', '2026-05-07 19:00:00', '2026-05-07 21:00:00', 'Templo Principal', 'completed'),
      (test_church_id, 'Reunião de Líderes', 'Encontro mensal de líderes', 'reunião', '2026-05-10 19:00:00', '2026-05-10 21:00:00', 'Sala de Reunião', 'scheduled')
    ON CONFLICT DO NOTHING;

    -- Insert member roles
    INSERT INTO member_roles (church_id, member_id, role, is_active, start_date, granted_by)
    SELECT test_church_id, m.id,
      CASE 
        WHEN m.name IN ('João Silva', 'Paulo Santos') THEN 'leader'::member_role_type
        ELSE 'member'::member_role_type
      END::member_role_type,
      true,
      '2026-01-01',
      test_church_id
    FROM members m
    WHERE m.church_id = test_church_id
    ON CONFLICT DO NOTHING;

    -- Insert timeline entries
    INSERT INTO member_timeline (church_id, member_id, event_type, old_value, new_value, description, effective_date, created_by)
    SELECT test_church_id, m.id, 'status_change'::timeline_event_type, NULL, 'active', 'Membro registrado no sistema', '2026-01-01', test_church_id
    FROM members m
    WHERE m.church_id = test_church_id
    ON CONFLICT DO NOTHING;

    -- Insert attendances
    INSERT INTO member_attendances (church_id, member_id, event_id, status, check_in_time, recorded_by)
    SELECT test_church_id, m.id, e.id, 'present'::attendance_status_type, e.start_date, test_church_id
    FROM members m
    CROSS JOIN events e
    WHERE m.church_id = test_church_id 
      AND e.church_id = test_church_id 
      AND e.event_type = 'culto' 
      AND e.status = 'completed'
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Seed data inserted successfully';
  ELSE
    RAISE NOTICE 'Seed data already exists, skipping';
  END IF;
END $$;