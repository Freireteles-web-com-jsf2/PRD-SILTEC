# Plano da Fase 2: Timeline, Attendance & Roles

**Phase:** 2
**Created:** 2026-05-08
**Status:** Pronto para execução

---

## Visão Geral

| Métrica | Valor |
|---------|-------|
| **Tarefas** | 6 |
| **Requirements** | TIME-01, TIME-02, TIME-03, ATTD-01, ATTD-02, ATTD-03, ROLE-01, ROLE-02, ROLE-03 (9) |
| **Stack** | Supabase + PostgreSQL + SQL Migrations |
| **Depends on:** | Fase 1 (Schema Base - Members & Families) |

---

## Tarefas

### Tarefa 1: Enum - Cargos RBAC

**Tipo:** database

**Descrição:** Criar enum para cargos do sistema alinhado ao RBAC do PRD

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000004_create_role_enum.sql`:

```sql
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
```

**Dependências:** 1 (Fase 1 - Members table must exist)

**Critérios de sucesso:**

- [ ] Enum `member_role_type` criado com: member, leader, treasurer, admin, super_admin
- [ ] Enum `timeline_event_type` criado com: role_change, department_change, status_change, observation
- [ ] Enum `attendance_status_type` criado com: present, absent, justified
- [ ] Comments de documentação adicionados

---

### Tarefa 2: Migration - Tabela Member Timeline

**Tipo:** database

**Descrição:** Criar migration da tabela `member_timeline` para eventos ministeriais

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000005_create_member_timeline.sql`:

```sql
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
```

**Dependências:** 1

**Critérios de sucesso:**

- [ ] Arquivo migration criado
- [ ] Tabela `member_timeline` criada com campos completos
- [ ] Foreign key para `members(id)`
- [ ] Campos old_value e new_value para histórico
- [ ] Campo effective_date para controle temporal
- [ ] Índices em church_id, member_id, event_type, effective_date

---

### Tarefa 3: Migration - Tabela Member Roles (Histórico de Cargos)

**Tipo:** database

**Descrição:** Criar migration da tabela `member_roles` para histórico de cargos RBAC

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000006_create_member_roles.sql`:

```sql
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
```

**Dependências:** 1

**Critérios de sucesso:**

- [ ] Arquivo migration criado
- [ ] Tabela `member_roles` criada
- [ ] Foreign key para members e departments
- [ ] Campo is_active para controle de ativos
- [ ] Campos start_date e end_date para validade temporal
- [ ] Campos granted_by, granted_at para auditoria
- [ ] UNIQUE constraint para evitar duplicatas
- [ ] Índices apropriados

---

### Tarefa 4: Migration - Tabela Member Attendances

**Tipo:** database

**Descrição:** Criar migration da tabela `member_attendances` para controle de presença

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000007_create_member_attendances.sql`:

```sql
-- Create member_attendances table
-- Note: Events table is created in a later phase (v0.4)
-- This references events.id as nullable for flexibility

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
```

**Dependências:** 1

**Critérios de sucesso:**

- [ ] Arquivo migration criado
- [ ] Tabela `member_attendances` criada
- [ ] Foreign key para members (obrigatório)
- [ ] Foreign key para events (opcional, pode ser null)
- [ ] Campo status com valores: present, absent, justified
- [ ] Campos check_in_time e check_out_time
- [ ] Campo justification para ausências justificadas
- [ ] UNIQUE constraint em (member_id, event_id)
- [ ] Índices apropriados

---

### Tarefa 5: Migration - Tabela Events (Base)

**Tipo:** database

**Descrição:** Criar tabela básica de eventos para permitir referências em attendances

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000008_create_events.sql`:

```sql
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
```

**Dependências:** 1

**Critérios de sucesso:**

- [ ] Arquivo migration criado
- [ ] Tabela `events` criada com campos básicos
- [ ] Campos de timing (start_date, end_date)
- [ ] Campos de localização (location, is_online)
- [ ] Campo capacity para limite de vagas
- [ ] Índices apropriados

---

### Tarefa 6: Seed Data - Timeline, Roles e Attendances

**Tipo:** database

**Descrição:** Criar seed data para testes das novas tabelas

**Detalhamento:**

Adicionar ao arquivo `supabase/seed.sql`:

```sql
-- Sample events
INSERT INTO events (church_id, title, description, event_type, start_date, end_date, location, status)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Culto Dominical', 'Culto de adoração semanal', 'culto', '2026-05-03 09:00:00', '2026-05-03 11:00:00', 'Templo Principal', 'completed'),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Culto de Oração', 'Culto de intercessão', 'culto', '2026-05-07 19:00:00', '2026-05-07 21:00:00', 'Templo Principal', 'completed'),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Reunião de Líderes', 'Encontro mensal de líderes', 'reunião', '2026-05-10 19:00:00', '2026-05-10 21:00:00', 'Sala de Reunião', 'completed')
ON CONFLICT DO NOTHING;

-- Sample member roles
INSERT INTO member_roles (church_id, member_id, role, is_active, start_date, granted_by)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  m.id,
  'member',
  true,
  '2026-01-01',
  '00000000-0000-0000-0000-000000000002'::uuid
FROM members m
WHERE m.church_id = '00000000-0000-0000-0000-000000000001'::uuid
ON CONFLICT DO NOTHING;

-- Sample timeline entries
INSERT INTO member_timeline (church_id, member_id, event_type, old_value, new_value, description, effective_date, created_by)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  m.id,
  'status_change',
  NULL,
  'active',
  'Membro registrado no sistema',
  '2026-01-01',
  '00000000-0000-0000-0000-000000000002'::uuid
FROM members m
WHERE m.church_id = '00000000-0000-0000-0000-000000000001'::uuid
ON CONFLICT DO NOTHING;

-- Sample attendances
INSERT INTO member_attendances (church_id, member_id, event_id, status, check_in_time, recorded_by)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  m.id,
  e.id,
  'present',
  e.start_date,
  '00000000-0000-0000-0000-000000000002'::uuid
FROM members m
CROSS JOIN events e
WHERE m.church_id = '00000000-0000-0000-0000-000000000001'::uuid
  AND e.church_id = '00000000-0000-0000-0000-000000000001'::uuid
  AND e.event_type = 'culto'
ON CONFLICT DO NOTHING;
```

**Dependências:** 1, 2, 3, 4, 5

**Critérios de sucesso:**

- [ ] Seed data para events
- [ ] Seed data para member_roles
- [ ] Seed data para member_timeline
- [ ] Seed data para member_attendances
- [ ] ON CONFLICT DO NOTHING para idempotência

---

## Onde Executar

### Wave 1: Enums (Tarefa 1)

```
Tarefas: 1
Dependências: após Fase 1
```

| # | Tarefa | Status |
|---|--------|--------|
| 1 | Enum - Cargos RBAC | Pending |

### Wave 2: Tables (Tarefas 2-5)

```
Tarefas: 2 → 3 → 4 → 5
Dependências: linear (Tarefa 1 primeiro)
```

| # | Tarefa | Status |
|---|--------|--------|
| 2 | Migration Member Timeline | Pending |
| 3 | Migration Member Roles | Pending |
| 4 | Migration Member Attendances | Pending |
| 5 | Migration Events (Base) | Pending |

### Wave 3: Seed (Tarefa 6)

```
Tarefas: 6
Dependências: após 1, 2, 3, 4, 5
```

| # | Tarefa | Status |
|---|--------|--------|
| 6 | Seed Data | Pending |

---

## Dependências Externas

- Supabase CLI instalado (`supabase --version`)
- Projeto Supabase configurado localmente
- Link do projeto: `supabase link --project-ref <ref>`
- Fase 1 executada completamente

---

## Notas de Implementação

1. **Ordem das migrations**: Execute em ordem numérica (4 → 5 → 6 → 7 → 8)
2. **Events nullable**: event_id em member_attendances é nullable para permitir registro sem eventolinked
3. **Soft delete**: Todas as tabelas têm deleted_at
4. **church_id**: Sempre obrigatório em todas as tabelas
5. **Timeline events**: Use old_value/new_value para tracking de mudanças
6. **Roles ativos**: use is_active em member_roles, apenas um role ativo por tipo por membro
7. **Seed data**: Use para desenvolvimento local, NÃO em produção

---

## Traceabilidade de Requirements

| Requirement | Tarefa |
|-------------|--------|
| TIME-01 | 2 (member_timeline table) |
| TIME-02 | 2 (tipos: cargo, departamento, status, observação) |
| TIME-03 | 2 (created_by, created_at, updated_at) |
| ATTD-01 | 4 (member_attendances table) |
| ATTD-02 | 4 (event_id reference) |
| ATTD-03 | 1 (attendance_status_type enum) |
| ROLE-01 | 1 (member_role_type enum) |
| ROLE-02 | 3 (member_roles table) |
| ROLE-03 | 1 (enum values: member, leader, treasurer, admin, super_admin) |

---

*Plano criado: 2026-05-08*
*Última atualização: 2026-05-08*