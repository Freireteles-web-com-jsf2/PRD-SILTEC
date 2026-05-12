---
phase: 5-rebuild-members
status: draft
created: 2026-05-12
tables:
  - members
  - family_groups
  - family_members
  - member_roles
  - member_timeline
  - member_attendances
  - events
  - departments
enums:
  - gender_type
  - marital_status_type
  - family_relationship_type
  - member_role_type
  - timeline_event_type
  - attendance_status_type
---

# Spec: Reconstrução do Módulo de Membros (alinhado ao schema real)

## 1. Problema

O módulo de membros atual foi construído sem mapeamento completo das tabelas do Supabase. Há gaps entre o schema do banco e o código:

| Aspecto | Banco (real) | Código (atual) |
|---------|-------------|----------------|
| `department_id` em members | FK para departments | Campo existe no tipo mas sem UI |
| `family_relationship_type` | Enum com 24 valores | Hardcoded 'membro' |
| `leader_id` em family_groups | FK para members | Não exposto |
| `member_attendances` | Tabela completa | 85% fake no perfil |
| Auditoria (created_by, etc.) | Triggers automáticos | Ignorado |
| `church_id` | Trigger set_church_id_default | Tipo marcava como required |
| `member_roles.end_date` | Coluna existe | Não usada |
| `member_roles.granted_by` | Coluna existe | Não exposto |
| React Query | Pronto (`useMembersQuery.ts`) | Não usado (usa useState) |

## 2. Escopo

Reconstruir o módulo de membros para espelhar **todas as colunas e relações** do banco Supabase, usando React Query (já implementado em `useMembersQuery.ts`), com formulários completos e RLS respeitado.

## 3. Schema do Banco (Referência)

### 3.1 Tabela `members`
| Coluna | Tipo | Notas |
|--------|------|-------|
| id | UUID PK | auto |
| church_id | UUID NOT NULL | auto via trigger |
| name | VARCHAR(255) NOT NULL | |
| birth_date | DATE | |
| gender | gender_type | male/female/other/prefer_not_to_say |
| marital_status | marital_status_type | single/married/divorced/widowed/separated |
| phone | VARCHAR(20) | |
| email | VARCHAR(255) | |
| address | TEXT | |
| address_city | VARCHAR(100) | |
| address_state | VARCHAR(50) | |
| baptism_date | DATE | |
| conversion_date | DATE | |
| department_id | UUID FK → departments | |
| status | BOOLEAN | default true |
| avatar_url | TEXT | |
| created_at | TIMESTAMPTZ | auto |
| updated_at | TIMESTAMPTZ | auto via trigger |
| deleted_at | TIMESTAMPTZ | soft delete |
| created_by | UUID | auto via trigger |
| updated_by | UUID | auto via trigger |

### 3.2 Tabela `family_groups`
| Coluna | Tipo |
|--------|------|
| id, church_id, name, leader_id (→ members), description, status, created_at, updated_at, deleted_at, created_by, updated_by |

### 3.3 Tabela `family_members`
| Coluna | Tipo |
|--------|------|
| id, church_id, family_group_id (→ family_groups), member_id (→ members), relationship (family_relationship_type), is_primary_contact, notes, created_at, updated_at, created_by, updated_by |
| UNIQUE(family_group_id, member_id) |

### 3.4 Tabela `member_roles`
| Coluna | Tipo |
|--------|------|
| id, church_id, member_id (→ members), role (member_role_type), department_id (→ departments), is_active, start_date, end_date, granted_by, granted_at, revoked_at, revocation_reason, created_at, updated_at, deleted_at |
| UNIQUE(member_id, role, is_active, start_date) |

### 3.5 Tabela `member_timeline`
| Coluna | Tipo |
|--------|------|
| id, church_id, member_id, event_type (timeline_event_type), old_value, new_value, description, effective_date, created_by, created_at, updated_at, deleted_at |

### 3.6 Tabela `member_attendances`
| Coluna | Tipo |
|--------|------|
| id, church_id, member_id, event_id, status (attendance_status_type), check_in_time, check_out_time, notes, justification, recorded_by, created_at, updated_at, deleted_at |

### 3.7 Tabela `departments`
| Coluna | Tipo |
|--------|------|
| id, church_id, name, description, leader_id, status, created_at, updated_at, deleted_at, created_by, updated_by |

## 4. Arquitetura da Solução

### 4.1 Camadas

```
pages (app router)
  → hooks (React Query - usar useMembersQuery.ts existente)
    → services (chamadas Supabase tipadas)
      → types (alinhados 1:1 com o banco)
```

### 4.2 Hooks (React Query) — JÁ EXISTEM em `useMembersQuery.ts`

Migrar as páginas para usar os hooks já implementados:
- `useMembers({search, status, departmentId, role, page, pageSize})`
- `useMember(id)` 
- `useCreateMember()`
- `useUpdateMember()`
- `useDeleteMember()`

### 4.3 Services Layer (NOVO)

Criar `src/lib/services/members.ts` com funções tipadas que recebem dados limpos e fazem chamadas Supabase:

```
createMember(data: CreateMemberInput) → Member
updateMember(id, data: UpdateMemberInput) → Member
softDeleteMember(id) → void
getMemberWithRelations(id) → Member & { roles, timeline, family, attendances }
getFamilyGroups(churchId) → FamilyGroup[]
createFamilyGroup(name) → FamilyGroup
linkFamilyMember(groupId, memberId, relationship) → void
getDepartments(churchId) → Department[]
```

### 4.4 Formulários (React Hook Form + Zod)

Schema Zod alinhado ao banco:

```typescript
memberSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed', 'separated']).optional(),
  address: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().max(2).optional(),
  baptism_date: z.string().optional(),
  conversion_date: z.string().optional(),
  department_id: z.string().uuid().optional(),
  status: z.boolean().default(true),
  avatar_url: z.string().optional(),
  // Family
  family_group_id: z.string().uuid().optional(),
  new_family_group_name: z.string().optional(),
  family_relationship: z.enum([...family_relationship_enum_values]).optional(),
  // Role
  role: z.enum(memberRoleOptions).optional(),
  role_start_date: z.string().optional(),
  role_end_date: z.string().optional(),
})
```

### 4.5 Páginas

| Página | Rota | Funcionalidades |
|--------|------|-----------------|
| Listagem | /membros | Tabela com busca, filtros (status, departamento, cargo), paginação, seleção em massa, soft delete |
| Criar | /membros/novo | Formulário completo com dados pessoais, endereço, ministerial, vínculo familiar (com relação), cargo, departamento |
| Perfil | /membros/[id] | Banner, info de contato, timeline ministerial real, presença real, cargos ativos, família |
| Editar | /membros/[id]/editar | Mesmo formulário do create, pré-preenchido |

## 5. Alinhamento Banco vs. Código (Correções Necessárias)

### 5.1 Types (src/types/member.ts)
- [x] `church_id` agora é optional (trigger cuida)
- [ ] Adicionar `department_id` como optional string
- [ ] `FamilyMember.relationship` deve usar `family_relationship_type` (enum de 24 valores)
- [ ] `MemberRole` deve incluir `end_date`, `granted_by`, `department_id`
- [ ] Criar tipo `Department`
- [ ] Adicionar `member_attendances` ao Member

### 5.2 Services (NOVO - src/lib/services/)
- [ ] `members.ts` - funções CRUD com types corretos
- [ ] `family.ts` - family groups CRUD
- [ ] `departments.ts` - departments CRUD
- [ ] `attendances.ts` - attendance queries

### 5.3 Hooks
- [ ] Migrar páginas para usar React Query (`useMembersQuery.ts`)
- [ ] Os hooks useState podem ser removidos após migração

### 5.4 Páginas
- [ ] Listagem: adicionar filtro por departamento e cargo
- [ ] Form criar/editar: adicionar campo department_id com select de departamentos
- [ ] Form criar/editar: adicionar family_relationship no vínculo familiar
- [ ] Perfil: buscar presença real de `member_attendances`
- [ ] Perfil: mostrar dados ministeriais reais

## 6. Dados de teste (seed.sql)

O seed.sql já contém dados de teste para `members`, `family_groups`, `family_members`, `events`, `member_roles`, `member_timeline`, `member_attendances`.

## 7. Critérios de Aceitação

1. [ ] Todos os campos do banco `members` são expostos no formulário
2. [ ] Vínculo familiar usa o enum `family_relationship_type` completo
3. [ ] Departamento é selecionável no formulário (busca de `departments`)
4. [ ] Timeline no perfil mostra dados reais
5. [ ] Presença no perfil mostra dados reais de `member_attendances`
6. [ ] React Query é usado em todas as páginas (useState removido)
7. [ ] church_id NÃO é enviado no payload (trigger cuida)
8. [ ] Soft delete funciona (deleted_at setado, não DELETE)
9. [ ] RLS respeitado (nunca enviar church_id, trigger e RLS cuidam)
10. [ ] Tipos TypeScript alinhados 1:1 com colunas do banco
