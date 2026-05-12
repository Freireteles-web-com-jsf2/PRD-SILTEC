-- Create events table (basic structure for Phase 2)
-- Extended in v0.4 - Events

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) DEFAULT 'general',
  
  -- Timing
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  
  -- Location
  location VARCHAR(255),
  is_online BOOLEAN DEFAULT false,
  online_link TEXT,
  
  -- Capacity
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  
  -- Organization
  department_id UUID,
  
  -- Status
  status VARCHAR(20) DEFAULT 'scheduled',
  
  -- Audit
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_events_church_id ON events(church_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_department ON events(department_id);

COMMENT ON TABLE events IS 'Events managed by the church (cultos, reuniões, eventos)';
COMMENT ON COLUMN events.event_type IS 'Type: culto, reunião, evento, celebração, etc';
COMMENT ON COLUMN events.status IS 'scheduled, ongoing, completed, cancelled';