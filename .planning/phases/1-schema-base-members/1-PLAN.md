# Plano da Fase 1: Schema Base - Members & Families

**Phase:** 1
**Created:** 2026-05-08
**Status:** Pronto para execução

---

## Visão Geral

| Métrica | Valor |
|---------|-------|
| **Tarefas** | 4 |
| **Requirements** | MEMB-01 a FMLY-04 (10) |
| **Stack** | Supabase + PostgreSQL + SQL Migrations |

---

## Tarefas

### Tarefa 1: Migration - Tabela Members

**Tipo:** database

**Descrição:** Criar migration inicial da tabela `members` com todos os campos do PRD

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000001_create_members.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums (run first for independence)
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

-- Partial index for soft delete performance
CREATE INDEX idx_members_active ON members(church_id) WHERE deleted_at IS NULL;
```

**Dependências:** Nenhuma

**Critérios de sucesso:**

- [ ] Arquivo migration criado em `supabase/migrations/`
- [ ] Enum `gender_type` criado com valores: male, female, other, prefer_not_to_say
- [ ] Enum `marital_status_type` criado com valores: single, married, divorced, widowed, separated
- [ ] Tabela `members` criada com todos os campos
- [ ] Índice em `church_id` criado
- [ ] Soft delete com `deleted_at` implementado
- [ ] Campos de auditoria (`created_by`, `updated_by`) incluídos

---

### Tarefa 2: Migration - Tabela Family Groups

**Tipo:** database

**Descrição:** Criar migration da tabela `family_groups`

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000002_create_family_groups.sql`:

```sql
-- Create family_groups table
CREATE TABLE family_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  leader_id UUID,
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

-- Comment for documentation
COMMENT ON TABLE family_groups IS 'Groups representing families or household units within a church';
```

**Dependências:** 1

**Critérios de sucesso:**

- [ ] Arquivo migration criado
- [ ] Tabela `family_groups` criada
- [ ] Campo `leader_id` para líder do grupo
- [ ] Índice em `church_id` criado

---

### Tarefa 3: Migration - Tabela Family Members (relacionamento N:N)

**Tipo:** database

**Descrição:** Criar migration da tabela junction `family_members`

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000003_create_family_members.sql`:

```sql
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

-- Create family_members junction table
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
  
  UNIQUE(family_group_id, member_id)
);

-- Indexes for junction table
CREATE INDEX idx_family_members_church_id ON family_members(church_id);
CREATE INDEX idx_family_members_family_group ON family_members(family_group_id);
CREATE INDEX idx_family_members_member ON family_members(member_id);

-- Ensure one primary contact per family
CREATE UNIQUE INDEX idx_family_members_primary_contact 
  ON family_members(family_group_id) 
  WHERE is_primary_contact = true;
```

**Dependências:** 1, 2

**Critérios de sucesso:**

- [ ] Enum `family_relationship_type` criado
- [ ] Tabela `family_members` criada com foreign keys
- [ ] UNIQUE constraint em (family_group_id, member_id)
- [ ] Índice para primary contact único
- [ ] Índices em church_id, family_group_id, member_id

---

### Tarefa 4: Seed Data - Dados de teste

**Tipo:** database

**Descrição:** Criar seed data para desenvolvimento e testes

**Detalhamento:**

Criar arquivo `supabase/seed.sql`:

```sql
-- Seed data for testing
-- church_id: Replace with actual UUID from Supabase project

-- Sample family groups
INSERT INTO family_groups (church_id, name, description, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Família Silva', 'Grupo familiar dos Silva', true),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Família Santos', 'Grupo familiar dos Santos', true)
ON CONFLICT DO NOTHING;

-- Sample members
INSERT INTO members (church_id, name, birth_date, gender, marital_status, phone, email, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'João Silva', '1980-05-15', 'male', 'married', '(11) 99999-0001', 'joao.silva@email.com', true),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Maria Silva', '1982-08-20', 'female', 'married', '(11) 99999-0002', 'maria.silva@email.com', true),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Pedro Silva', '2010-03-10', 'male', 'single', '(11) 99999-0003', 'pedro.silva@email.com', true)
ON CONFLICT DO NOTHING;

-- Sample family relationships
INSERT INTO family_members (church_id, family_group_id, member_id, relationship, is_primary_contact)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  fg.id,
  m.id,
  CASE m.name
    WHEN 'João Silva' THEN 'husband'
    WHEN 'Maria Silva' THEN 'wife'
    WHEN 'Pedro Silva' THEN 'son'
  END,
  CASE WHEN m.name = 'João Silva' THEN true ELSE false END
FROM family_groups fg
CROSS JOIN members m
WHERE m.name LIKE 'Silva%'
ON CONFLICT DO NOTHING;
```

**Dependências:** 1, 2, 3

**Critérios de sucesso:**

- [ ] Arquivo seed criado em `supabase/seed.sql`
- [ ] Dados de exemplo para family_groups
- [ ] Dados de exemplo para members
- [ ] Dados de exemplo para family_members
- [ ] ON CONFLICT DO NOTHING paraidempotência

---

## Onde Executar

### Wave 1: Migrations (Tarefas 1-3)

```
Tarefas: 1 → 2 → 3
Dependências: linear (cada uma depende da anterior)
```

| # | Tarefa | Status |
|---|--------|--------|
| 1 | Migration Members | Pending |
| 2 | Migration Family Groups | Pending |
| 3 | Migration Family Members | Pending |

### Wave 2: Seed (Tarefa 4)

```
Tarefas: 4
Dependências: após 1, 2, 3
```

| # | Tarefa | Status |
|---|--------|--------|
| 4 | Seed Data | Pending |

---

## Dependências Externas

- Supabase CLI instalado (`supabase --version`)
- Projeto Supabase configurado localmente
- Link do projeto: `supabase link --project-ref <ref>`

---

## Notas de Implementação

1. **Ordem das migrations**: Execute em ordem numérica (1 → 2 → 3)
2. **Soft delete**: Não delete registros, defina `deleted_at`
3. **UUID padrão**: Use `uuid_generate_v4()` para novos IDs
4. **church_id**: Sempre obrigatório em todas as tabelas
5. **Seed data**: Use para desenvolvimento local, NÃO em produção

---

*Plano criado: 2026-05-08*
*Última atualização: 2026-05-08*