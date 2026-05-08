-- Create member_attendances table
CREATE TABLE member_attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  event_id UUID, -- Nullable: events table may not exist yet
  
  -- Attendance details
  status attendance_status_type NOT NULL DEFAULT 'present',
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  notes TEXT,
  justification TEXT,
  
  -- Audit
  recorded_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  UNIQUE(member_id, event_id)
);

-- Indexes
CREATE INDEX idx_member_attendances_church_id ON member_attendances(church_id);
CREATE INDEX idx_member_attendances_member_id ON member_attendances(member_id);
CREATE INDEX idx_member_attendances_event_id ON member_attendances(event_id);
CREATE INDEX idx_member_attendances_status ON member_attendances(status);
CREATE INDEX idx_member_attendances_date ON member_attendances(created_at);

COMMENT ON TABLE member_attendances IS 'Attendance records for members at events';
COMMENT ON COLUMN member_attendances.status IS 'present, absent, or justified';
COMMENT ON COLUMN member_attendances.check_in_time IS 'Time when member checked in to event';
COMMENT ON COLUMN member_attendances.check_out_time IS 'Time when member checked out from event';
COMMENT ON COLUMN member_attendances.justification IS 'Reason for absence (required when status is justified)';