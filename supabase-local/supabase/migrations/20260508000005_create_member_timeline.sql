-- Create member_timeline table
CREATE TABLE member_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  event_type timeline_event_type NOT NULL,
  
  -- Event details
  old_value TEXT,
  new_value TEXT,
  description TEXT,
  
  -- Metadata
  effective_date DATE,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes for multi-tenant queries
CREATE INDEX idx_member_timeline_church_id ON member_timeline(church_id);
CREATE INDEX idx_member_timeline_member_id ON member_timeline(member_id);
CREATE INDEX idx_member_timeline_event_type ON member_timeline(event_type);
CREATE INDEX idx_member_timeline_effective_date ON member_timeline(effective_date);

-- Composite index for member history queries
CREATE INDEX idx_member_timeline_member_date 
  ON member_timeline(member_id, effective_date DESC);

COMMENT ON TABLE member_timeline IS 'Timeline of ministerial events for members: role changes, department changes, status changes, and observations';
COMMENT ON COLUMN member_timeline.old_value IS 'Previous value (e.g., previous role, previous department)';
COMMENT ON COLUMN member_timeline.new_value IS 'New value (e.g., new role, new department)';
COMMENT ON COLUMN member_timeline.effective_date IS 'Date when the change takes effect';