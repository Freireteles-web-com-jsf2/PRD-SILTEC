-- Create proper ENUMs for events table (replacing VARCHAR)

-- 1) Create enum types
CREATE TYPE event_type AS ENUM (
  'culto',
  'reuniao',
  'evento',
  'celebracao',
  'estudo_biblico',
  'escola_dominical',
  'jovens',
  'casamento',
  'funeral',
  'campanha',
  'retiro',
  'visita',
  'general'
);

CREATE TYPE event_status AS ENUM (
  'scheduled',
  'ongoing',
  'completed',
  'cancelled'
);

-- 2) Migrate events columns from VARCHAR to ENUM
-- Uses DO block to handle invalid values gracefully
DO $$
DECLARE
  invalid_event_types text[];
  invalid_statuses text[];
BEGIN
  -- Check for invalid event_type values
  SELECT array_agg(DISTINCT event_type) INTO invalid_event_types
  FROM events
  WHERE event_type IS NOT NULL
    AND event_type NOT IN (
      'culto', 'reuniao', 'evento', 'celebracao',
      'estudo_biblico', 'escola_dominical', 'jovens',
      'casamento', 'funeral', 'campanha', 'retiro',
      'visita', 'general'
    );

  IF invalid_event_types IS NOT NULL THEN
    RAISE WARNING 'Invalid event_type values found (will be set to "general"): %', invalid_event_types;
  END IF;

  -- Check for invalid status values
  SELECT array_agg(DISTINCT status) INTO invalid_statuses
  FROM events
  WHERE status IS NOT NULL
    AND status NOT IN ('scheduled', 'ongoing', 'completed', 'cancelled');

  IF invalid_statuses IS NOT NULL THEN
    RAISE WARNING 'Invalid status values found (will be set to "scheduled"): %', invalid_statuses;
  END IF;
END $$;

-- Normalize invalid values before casting
UPDATE events SET event_type = 'general' WHERE event_type IS NOT NULL AND event_type NOT IN (
  'culto', 'reuniao', 'evento', 'celebracao',
  'estudo_biblico', 'escola_dominical', 'jovens',
  'casamento', 'funeral', 'campanha', 'retiro',
  'visita', 'general'
);

UPDATE events SET status = 'scheduled' WHERE status IS NOT NULL AND status NOT IN (
  'scheduled', 'ongoing', 'completed', 'cancelled'
);

-- Drop existing defaults before altering type (prevents "cannot be cast automatically" error)
ALTER TABLE events ALTER COLUMN event_type DROP DEFAULT;
ALTER TABLE events ALTER COLUMN status DROP DEFAULT;

-- Alter columns to enum types
ALTER TABLE events ALTER COLUMN event_type TYPE event_type USING event_type::event_type;
ALTER TABLE events ALTER COLUMN status TYPE event_status USING status::event_status;

-- Set defaults for new rows
ALTER TABLE events ALTER COLUMN event_type SET DEFAULT 'general';
ALTER TABLE events ALTER COLUMN status SET DEFAULT 'scheduled';

COMMENT ON TYPE event_type IS 'Types of church events: culto, reuniao, evento, celebracao, etc';
COMMENT ON TYPE event_status IS 'Event lifecycle: scheduled, ongoing, completed, cancelled';
COMMENT ON COLUMN events.event_type IS 'Type of church event';
COMMENT ON COLUMN events.status IS 'Current status in event lifecycle';
