-- Create enum for family relationship types
CREATE TYPE family_relationship_type AS ENUM (
  'husband', 'wife', 'son', 'daughter', 
  'father', 'mother', 'brother', 'sister',
  'grandfather', 'grandmother', 'grandson', 'granddaughter',
  'uncle', 'aunt', 'nephew', 'niece',
  'cousin', 'father_in_law', 'mother_in_law',
  'brother_in_law', 'sister_in_law', 'son_in_law', 'daughter_in_law',
  'stepfather', 'stepmother', 'stepson', 'stepdaughter',
  'other'
);

-- Create family_members junction table (N:N relationship)
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL,
  family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  relationship family_relationship_type NOT NULL,
  is_primary_contact BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  
  -- Prevent duplicate memberships
  UNIQUE(family_group_id, member_id)
);

-- Indexes for junction table performance
CREATE INDEX idx_family_members_church_id ON family_members(church_id);
CREATE INDEX idx_family_members_family_group ON family_members(family_group_id);
CREATE INDEX idx_family_members_member ON family_members(member_id);

-- Ensure one primary contact per family group
CREATE UNIQUE INDEX idx_family_members_primary_contact 
  ON family_members(family_group_id) 
  WHERE is_primary_contact = true;

-- Add comments for documentation
COMMENT ON TABLE family_members IS 'Junction table linking members to family groups with relationship type';
COMMENT ON COLUMN family_members.is_primary_contact IS 'Only one member per family group can be primary contact';
COMMENT ON COLUMN family_members.relationship IS 'Relationship of the member to the family group (not to other members)';