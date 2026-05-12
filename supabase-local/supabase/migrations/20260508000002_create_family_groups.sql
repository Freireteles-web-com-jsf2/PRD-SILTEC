-- Create family_groups table
CREATE TABLE family_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  leader_id UUID REFERENCES members(id) ON DELETE SET NULL,
  description TEXT,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID,
  updated_by UUID
);

-- Index for multi-tenant queries
CREATE INDEX idx_family_groups_church_id ON family_groups(church_id);
CREATE INDEX idx_family_groups_leader ON family_groups(leader_id);
CREATE INDEX idx_family_groups_church_id_status ON family_groups(church_id, status) WHERE deleted_at IS NULL;

-- Add comments for documentation
COMMENT ON TABLE family_groups IS 'Groups representing families or household units within a church';
COMMENT ON COLUMN family_groups.leader_id IS 'Primary leader of the family group (references members.id)';