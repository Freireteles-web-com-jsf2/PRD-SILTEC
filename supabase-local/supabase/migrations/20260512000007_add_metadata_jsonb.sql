-- Add JSONB metadata columns for flexible custom data

DO $$
BEGIN
  -- members
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'members' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE members ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;

  -- events
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE events ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;

  -- family_groups
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'family_groups' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE family_groups ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- GIN index for JSONB queries (querying inside metadata)
CREATE INDEX IF NOT EXISTS idx_members_metadata ON members USING gin (metadata);
CREATE INDEX IF NOT EXISTS idx_events_metadata ON events USING gin (metadata);
CREATE INDEX IF NOT EXISTS idx_family_groups_metadata ON family_groups USING gin (metadata);

COMMENT ON COLUMN members.metadata IS 'Flexible JSONB for custom member data (gifts, skills, notes, custom fields)';
COMMENT ON COLUMN events.metadata IS 'Flexible JSONB for custom event data (program, speakers, resources)';
COMMENT ON COLUMN family_groups.metadata IS 'Flexible JSONB for custom group data (meeting schedule, location details)';
