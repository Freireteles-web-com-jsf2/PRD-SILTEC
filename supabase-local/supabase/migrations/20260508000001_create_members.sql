-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for members
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE marital_status_type AS ENUM ('single', 'married', 'divorced', 'widowed', 'separated');

-- Create members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  birth_date DATE,
  gender gender_type,
  marital_status marital_status_type,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  address_city VARCHAR(100),
  address_state VARCHAR(50),
  baptism_date DATE,
  conversion_date DATE,
  department_id UUID,
  status BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by UUID,
  updated_by UUID
);

-- Index for multi-tenant queries (church_id first for RLS)
CREATE INDEX idx_members_church_id ON members(church_id);
CREATE INDEX idx_members_church_id_status ON members(church_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_members_department ON members(department_id);
CREATE INDEX idx_members_active ON members(church_id) WHERE deleted_at IS NULL;

-- Add comments for documentation
COMMENT ON TABLE members IS 'Church members with personal and ministry information';
COMMENT ON COLUMN members.church_id IS 'Multi-tenant identifier - each church sees only their members';
COMMENT ON COLUMN members.gender IS 'Gender identity of the member';
COMMENT ON COLUMN members.marital_status IS 'Current marital status';
COMMENT ON COLUMN members.baptism_date IS 'Date of water baptism';
COMMENT ON COLUMN members.conversion_date IS 'Date of spiritual conversion';
COMMENT ON COLUMN members.department_id IS 'Primary department/ministry membership';
COMMENT ON COLUMN members.status IS 'Active or inactive member status';
COMMENT ON COLUMN members.deleted_at IS 'Soft delete - null means active, timestamp means deleted';