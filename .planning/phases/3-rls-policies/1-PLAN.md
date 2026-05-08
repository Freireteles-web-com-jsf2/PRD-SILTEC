# Plano da Fase 3: Multi-Tenant & RLS Policies

**Phase:** 3
**Created:** 2026-05-08
**Status:** Pronto para execução

---

## Visão Geral

| Métrica | Valor |
|---------|-------|
| **Tarefas** | 4 |
| **Requirements** | SECU-01, SECU-02, SECU-03, SECU-04 (4) |
| **Stack** | Supabase + PostgreSQL + RLS |
| **Depends on:** | Fase 1 + Fase 2 |

---

## Tarefas

### Tarefa 1: Helper Function - get_current_church_id()

**Tipo:** database

**Descrição:** Criar função helper para recuperar church_id do contexto da sessão

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000009_enable_rls_helper_function.sql`:

```sql
-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create helper function to get current church_id from JWT
CREATE OR REPLACE FUNCTION get_current_church_id()
RETURNS UUID AS $$
BEGIN
  RETURN COALESCE(
    current_setting('app.church_id', true),
    (current_user)::uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create policy helper function
CREATE OR REPLACE FUNCTION auth.check_church_access(table_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- For development: allow if church_id is set in settings
  -- In production: this would validate JWT claims
  RETURN current_setting('app.church_id', true) IS NOT NULL 
     OR current_setting('app.church_id', true) != '';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION get_current_church_id() IS 'Returns the current church_id from session context for RLS policies';
COMMENT ON FUNCTION auth.check_church_access(TEXT) IS 'Helper to check if user has access to a table';
```

**Dependências:** 1 (Fase 1), 2 (Fase 2)

**Critérios de sucesso:**

- [ ] RLS habilitado em todas as tabelas
- [ ] Função get_current_church_id() criada
- [ ] Função check_church_access() criada

---

### Tarefa 2: RLS Policies - Members Table

**Tipo:** database

**Descrição:** Criar RLS policies para tabela members

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000010_rls_members_policies.sql`:

```sql
-- RLS Policies for members table

-- Policy: Users can see only members from their church
CREATE POLICY members_select ON members
  FOR SELECT
  USING (church_id = get_current_church_id());

-- Policy: Users can insert members in their church
CREATE POLICY members_insert ON members
  FOR INSERT
  WITH CHECK (church_id = get_current_church_id());

-- Policy: Users can update only members from their church
CREATE POLICY members_update ON members
  FOR UPDATE
  USING (church_id = get_current_church_id())
  WITH CHECK (church_id = get_current_church_id());

-- Policy: Users can delete only members from their church (soft delete)
CREATE POLICY members_delete ON members
  FOR DELETE
  USING (church_id = get_current_church_id());

-- Allow authenticated users to access members table
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_church_id() TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON members TO authenticated;
```

**Dependências:** 1

**Critérios de sucesso:**

- [ ] Policy SELECT em members
- [ ] Policy INSERT em members
- [ ] Policy UPDATE em members
- [ ] Policy DELETE em members
- [ ] Grants concedidos

---

### Tarefa 3: RLS Policies - Tables Relacionadas

**Tipo:** database

**Descrição:** Criar RLS policies para family_groups, family_members, member_timeline, member_roles, member_attendances, events

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000011_rls_related_tables.sql`:

```sql
-- RLS Policies for family_groups
CREATE POLICY family_groups_select ON family_groups
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY family_groups_insert ON family_groups
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY family_groups_update ON family_groups
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY family_groups_delete ON family_groups
  FOR DELETE USING (church_id = get_current_church_id());

-- RLS Policies for family_members
CREATE POLICY family_members_select ON family_members
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY family_members_insert ON family_members
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY family_members_update ON family_members
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY family_members_delete ON family_members
  FOR DELETE USING (church_id = get_current_church_id());

-- RLS Policies for member_timeline
CREATE POLICY member_timeline_select ON member_timeline
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY member_timeline_insert ON member_timeline
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_timeline_update ON member_timeline
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_timeline_delete ON member_timeline
  FOR DELETE USING (church_id = get_current_church_id());

-- RLS Policies for member_roles
CREATE POLICY member_roles_select ON member_roles
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY member_roles_insert ON member_roles
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_roles_update ON member_roles
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_roles_delete ON member_roles
  FOR DELETE USING (church_id = get_current_church_id());

-- RLS Policies for member_attendances
CREATE POLICY member_attendances_select ON member_attendances
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY member_attendances_insert ON member_attendances
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_attendances_update ON member_attendances
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_attendances_delete ON member_attendances
  FOR DELETE USING (church_id = get_current_church_id());

-- RLS Policies for events
CREATE POLICY events_select ON events
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY events_insert ON events
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY events_update ON events
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY events_delete ON events
  FOR DELETE USING (church_id = get_current_church_id());

-- Grants for all tables
GRANT SELECT, INSERT, UPDATE, DELETE ON family_groups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON family_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON member_timeline TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON member_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON member_attendances TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON events TO authenticated;
```

**Dependências:** 1, 2

**Critérios de sucesso:**

- [ ] Policies em family_groups (4)
- [ ] Policies em family_members (4)
- [ ] Policies em member_timeline (4)
- [ ] Policies em member_roles (4)
- [ ] Policies em member_attendances (4)
- [ ] Policies em events (4)
- [ ] Grants concedidos para authenticated

---

### Tarefa 4: Trigger - Audit Columns

**Tipo:** database

**Descrição:** Criar trigger para auto-popular created_by e updated_at

**Detalhamento:**

Criar arquivo `supabase/migrations/20260508000012_audit_triggers.sql`:

```sql
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to set created_by/updated_by from current user
CREATE OR REPLACE FUNCTION set_audit_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = COALESCE(NEW.created_by, get_current_church_id());
    NEW.updated_by = COALESCE(NEW.updated_by, get_current_church_id());
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by = get_current_church_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_members_audit
  BEFORE INSERT OR UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER update_family_groups_updated_at
  BEFORE UPDATE ON family_groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_family_groups_audit
  BEFORE INSERT OR UPDATE ON family_groups
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_family_members_audit
  BEFORE INSERT OR UPDATE ON family_members
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

CREATE TRIGGER update_member_timeline_updated_at
  BEFORE UPDATE ON member_timeline
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_roles_updated_at
  BEFORE UPDATE ON member_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_attendances_updated_at
  BEFORE UPDATE ON member_attendances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_events_audit
  BEFORE INSERT OR UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_audit_columns();

COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger function to auto-update updated_at column';
COMMENT ON FUNCTION set_audit_columns() IS 'Trigger function to auto-set created_by and updated_by';
```

**Dependências:** 1, 2, 3

**Critérios de sucesso:**

- [ ] Função update_updated_at_column() criada
- [ ] Função set_audit_columns() criada
- [ ] Triggers em todas as tabelas
- [ ] created_by/updated_by auto-preenchidos

---

## Onde Executar

### Wave 1: RLS Setup (Tarefa 1)

```
Tarefas: 1
Dependências: após Fase 1 + Fase 2
```

| # | Tarefa | Status |
|---|--------|--------|
| 1 | RLS Helper Function | Pending |

### Wave 2: Policies (Tarefas 2-3)

```
Tarefas: 2 → 3
Dependências: após 1
```

| # | Tarefa | Status |
|---|--------|--------|
| 2 | RLS Policies - Members | Pending |
| 3 | RLS Policies - Related Tables | Pending |

### Wave 3: Audit (Tarefa 4)

```
Tarefas: 4
Dependências: após 2, 3
```

| # | Tarefa | Status |
|---|--------|--------|
| 4 | Audit Triggers | Pending |

---

## Dependências Externas

- Supabase CLI instalado
- Fase 1 executada (migrations 01-03)
- Fase 2 executada (migrations 04-08)

---

## Notas de Implementação

1. **Ordem das migrations**: Execute em ordem numérica (9 → 10 → 11 → 12)
2. **RLS bypass**: Políticas são restritivas — preciso do church_id correto
3. **Development mode**: Para testar localmente, definir:
   ```sql
   SET app.church_id = '00000000-0000-0000-0000-000000000001';
   ```
4. **Production**: church_id virá do JWT claims no Supabase Auth
5. **Testes**: Verificar se queries retornam apenas dados da igreja correta

---

## Traceabilidade de Requirements

| Requirement | Tarefa |
|-------------|--------|
| SECU-01 (church_id) | 1 (verificar) |
| SECU-02 (RLS policies) | 2, 3 |
| SECU-03 (índices) | Verificar nos migrations anteriores |
| SECU-04 (audit columns) | 4 (triggers) |

---

*Plano criado: 2026-05-08*
*Última atualização: 2026-05-08*