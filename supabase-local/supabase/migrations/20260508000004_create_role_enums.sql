-- Create enum for system roles (RBAC)
CREATE TYPE member_role_type AS ENUM (
  'member',
  'leader',
  'treasurer',
  'admin',
  'super_admin'
);

-- Create enum for timeline event types
CREATE TYPE timeline_event_type AS ENUM (
  'role_change',
  'department_change',
  'status_change',
  'observation'
);

-- Create enum for attendance status
CREATE TYPE attendance_status_type AS ENUM (
  'present',
  'absent',
  'justified'
);

COMMENT ON TYPE member_role_type IS 'RBAC roles for system access control';
COMMENT ON TYPE timeline_event_type IS 'Types of events tracked in member timeline';
COMMENT ON TYPE attendance_status_type IS 'Attendance status for events';