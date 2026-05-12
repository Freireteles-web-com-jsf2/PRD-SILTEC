-- Create member_roles table for role history
CREATE TABLE member_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  role member_role_type NOT NULL,
  
  -- Role details
  department_id UUID,
  is_active BOOLEAN DEFAULT true,
  
  -- Validity period
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Audit
  granted_by UUID,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  UNIQUE(member_id, role, is_active, start_date)
);

-- Indexes
CREATE INDEX idx_member_roles_church_id ON member_roles(church_id);
CREATE INDEX idx_member_roles_member_id ON member_roles(member_id);
CREATE INDEX idx_member_roles_role ON member_roles(role);
CREATE INDEX idx_member_roles_is_active ON member_roles(is_active) WHERE is_active = true;
CREATE INDEX idx_member_roles_dates ON member_roles(start_date, end_date);

COMMENT ON TABLE member_roles IS 'Historical record of RBAC role assignments to members';
COMMENT ON COLUMN member_roles.is_active IS 'Whether this role assignment is currently active';
COMMENT ON COLUMN member_roles.start_date IS 'Date when role assignment becomes effective';
COMMENT ON COLUMN member_roles.end_date IS 'Date when role assignment ends (null = current/indefinite)';
COMMENT ON COLUMN member_roles.granted_by IS 'User who granted this role';