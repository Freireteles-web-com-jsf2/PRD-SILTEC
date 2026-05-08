# Research: Phase 1 - Schema Base (Members & Families)

## Overview

This document captures research findings for implementing the database schema for Supabase/PostgreSQL with multi-tenant support for the Siltec-Solutions church management system.

---

## 1. Supabase Migration File Naming Conventions

### Pattern
Migration files follow the format: `YYYYMMDDHHmmss_description.sql`

Example: `20260508000000_create_members_table.sql`

### Location
- Local migrations: `supabase/migrations/`
- Tracked in: `supabase_migrations.schema_migrations` (remote)

### Best Practices
- Use UTC timestamp
- Include descriptive name after timestamp
- Use lowercase with underscores
- One migration per logical change

---

## 2. Migration Structure & Versioning

### Header Template
```sql
-- Migration: create_members_table
-- Description: Creates the members table with full profile fields
-- Tables affected: members
-- Dependencies: None
-- Created: 2026-05-08

-- Up migration
```

### Migration Types Supported
1. **Create table** - `CREATE TABLE`
2. **Alter table** - `ALTER TABLE ADD/DROP/RENAME`
3. **Create index** - `CREATE INDEX`
4. **RLS policies** - `CREATE POLICY`
5. **Enums** - `CREATE TYPE`

### Commands Reference
```bash
# Create new migration
supabase migration new create_members_table

# Apply migrations
supabase migration up

# Reset local database
supabase db reset

# Push to remote
supabase db push
```

---

## 3. Multi-Tenant Pattern (church_id)

### Column Standard
```sql
church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE
```

### Index Strategy
```sql
-- Composite index for most queries (filter by church_id first)
CREATE INDEX idx_members_church_active ON members(church_id, created_at DESC) 
  WHERE deleted_at IS NULL;

CREATE INDEX idx_family_groups_church ON family_groups(church_id);
CREATE INDEX idx_family_members_church ON family_members(church_id);
```

### RLS Policy Pattern
```sql
-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Read policy
CREATE POLICY members_select ON members FOR SELECT
  USING (church_id = current_setting('app.church_id')::uuid);

-- Insert policy (WITH CHECK)
CREATE POLICY members_insert ON members FOR INSERT
  WITH CHECK (church_id = current_setting('app.church_id')::uuid);

-- Update policy
CREATE POLICY members_update ON members FOR UPDATE
  USING (church_id = current_setting('app.church_id')::uuid)
  WITH CHECK (church_id = current_setting('app.church_id')::uuid);

-- Delete policy (soft delete)
CREATE POLICY members_delete ON members FOR DELETE
  USING (church_id = current_setting('app.church_id')::uuid);
```

### Session Setting (in Supabase client)
```sql
SET LOCAL app.church_id = 'uuid-here';
```

---

## 4. Enum Types for Brazilian Context

### Gender Enum
```sql
CREATE TYPE gender AS ENUM (
  'masculino',
  'feminino',
  'outro',
  'prefiro_nao_informar'
);
```

### Marital Status Enum
```sql
CREATE TYPE marital_status AS ENUM (
  'solteiro',
  'casado',
  'divorciado',
  'viuvo',
  'separado',
  'uniao_estavel'
);
```

### Enum Best Practices
- Use `ALTER TYPE ... ADD VALUE` for additions (PostgreSQL 9.3+)
- Avoid removing values (complex, can break indexes)
- Keep values lowercase with underscores
- Consider using text columns with CHECK constraints as alternative for frequently changing values

---

## 5. Soft Delete Pattern (deleted_at)

### Column Definition
```sql
deleted_at TIMESTAMPTZ NULL DEFAULT NULL
```

### Partial Index for Performance
```sql
CREATE INDEX idx_members_church_active ON members(church_id, created_at DESC) 
  WHERE deleted_at IS NULL;
```

### Query Pattern (always filter)
```sql
SELECT * FROM members 
WHERE church_id = 'uuid' 
  AND deleted_at IS NULL;
```

### Soft Delete Implementation
```sql
-- Instead of DELETE, update deleted_at
UPDATE members SET deleted_at = NOW() WHERE id = 'uuid';
```

### RLS with Soft Delete
```sql
-- Read policy: exclude deleted rows automatically
CREATE POLICY members_select ON members FOR SELECT
  USING (
    church_id = current_setting('app.church_id')::uuid 
    AND deleted_at IS NULL
  );
```

---

## 6. Table SQL Patterns

### Members Table
```sql
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  
  -- Personal info
  name VARCHAR(255) NOT NULL,
  birth_date DATE,
  gender gender,
  marital_status marital_status,
  
  -- Contact
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  
  -- Religious
  baptism_date DATE,
  conversion_date DATE,
  department_id UUID REFERENCES departments(id),
  
  -- RBAC role
  role VARCHAR(50) DEFAULT 'member',
  
  -- Status
  status BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_members_church ON members(church_id);
CREATE INDEX idx_members_church_active ON members(church_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_members_email ON members(email) WHERE email IS NOT NULL;
```

### Family Groups Table
```sql
CREATE TABLE public.family_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Relationship type
  family_type VARCHAR(50) DEFAULT 'nuclear', -- nuclear, extended
  
  status BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_family_groups_church ON family_groups(church_id);
CREATE INDEX idx_family_groups_church_active ON family_groups(church_id, name) WHERE deleted_at IS NULL;
```

### Family Members Junction Table
```sql
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  
  -- Relationship to head of family
  relationship VARCHAR(50) NOT NULL, -- spouse, child, parent, sibling, other
  
  is_head BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(family_id, member_id)
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_family_members_family ON family_members(family_id);
CREATE INDEX idx_family_members_member ON family_members(member_id);
```

---

## 7. Seed Data Approach

### Location
`supabase/seed.sql` - runs on `supabase db reset`

### Seed Pattern
```sql
-- Insert test church
INSERT INTO churches (id, name, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Igreja Teste', NOW()),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Segunda Igreja', NOW())
ON CONFLICT DO NOTHING;

-- Insert test members
INSERT INTO members (church_id, name, birth_date, gender, marital_status, phone, email, created_at)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'João Silva',
    '1990-05-15',
    'masculino',
    'casado',
    '+5511999999999',
    'joao@teste.com',
    NOW()
  ),
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Maria Silva',
    '1992-08-20',
    'feminino',
    'casado',
    '+5511988888888',
    'maria@teste.com',
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Insert test family
INSERT INTO family_groups (church_id, name, family_type, created_at)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Família Silva',
    'nuclear',
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Link family members (requires member IDs from above)
INSERT INTO family_members (family_id, member_id, relationship, is_head)
SELECT 
  fg.id,
  m.id,
  CASE m.name
    WHEN 'João Silva' THEN 'spouse'
    WHEN 'Maria Silva' THEN 'spouse'
    ELSE 'other'
  END,
  CASE WHEN m.name = 'João Silva' THEN true ELSE false END
FROM family_groups fg
JOIN members m ON m.church_id = fg.church_id
WHERE fg.church_id = '11111111-1111-1111-1111-111111111111'::uuid
  AND m.name IN ('João Silva', 'Maria Silva')
ON CONFLICT DO NOTHING;
```

---

## 8. Migration File Structure (Recommended)

### File Organization
```
supabase/migrations/
├── 20260508000000_create_enums.sql
├── 20260508000001_create_churches_table.sql
├── 20260508000002_create_members_table.sql
├── 20260508000003_create_family_groups_table.sql
├── 20260508000004_create_family_members_table.sql
├── 20260508000005_create_members_rls_policies.sql
├── 20260508000006_create_family_rls_policies.sql
└── (future migrations...)
```

### Separate Concerns
1. **Enums first** - before tables that use them
2. **Tables** - before indexes and policies
3. **RLS policies last** - after tables exist

---

## 9. Key Decisions from Research

| Decision | Recommendation | Rationale |
|----------|----------------|-----------|
| Enum vs Text | Use Enums for gender, marital_status | Fixed values, better performance |
| Soft Delete | Use deleted_at | LGPD allows retention; easier than archive tables |
| RLS Approach | Per-table policies | Granular control, easier to test |
| Index Strategy | Composite (church_id, field) | Matches RLS predicate |
| Seed Location | supabase/seed.sql | Runs on db reset |

---

## 10. Next Steps for Planning

1. Confirm enum values for Brazilian context
2. Decide on additional member fields (photo, notes, etc.)
3. Define foreign key constraints for departments
4. Plan RLS policy variations by role (Admin vs Member)
5. Consider audit trail (created_by, updated_by)

---

## References

- Supabase Migrations: https://supabase.com/docs/guides/database/postgres/migrations
- PostgreSQL Enums: https://supabase.com/docs/guides/database/postgres/enums
- RLS Best Practices: https://blog.puzzledge.org/2025/05/12/how-we-designed-fine-grained-row-level-security-in-postgresql/
- Multi-tenant Patterns: https://viprasol.com/blog/postgres-schema-design-saas/