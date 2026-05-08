# Requirements: Siltec-Solutions | SGI

**Defined:** 2026-05-08
**Core Value:** Plataforma de gestão ministerial completa que permite às igrejas brasileiras gerenciar sua administração de forma centralizada, segura e escalável

## v1 Requirements

Requirements for milestone v0.2: Membros & Supabase Schema.

### Members (MEMB)

- [ ] **MEMB-01**: Tabela `members` com campos completos (nome, birth_date, gender, marital_status, phone, email, endereço)
- [ ] **MEMB-02**: Campos de batismo e conversão (baptism_date, conversion_date)
- [ ] **MEMB-03**: Relacionamento com departments via `department_id`
- [ ] **MEMB-04**: Status ativo/inativo com controle
- [ ] **MEMB-05**: Timestamps padrão (created_at, updated_at, deleted_at soft delete)
- [ ] **MEMB-06**: Avatar/photo via Supabase Storage

### Family Groups (FMLY)

- [ ] **FMLY-01**: Tabela `family_groups` com nome do grupo/família
- [ ] **FMLY-02**: Tabela `family_members` (relacionamento N:N entre members)
- [ ] **FMLY-03**: Campo `relationship` (pai, mãe, filho, cônjuge, etc.)
- [ ] **FMLY-04**: Líder do grupo familiar

### Member Timeline (TIME)

- [ ] **TIME-01**: Tabela `member_timeline` com eventos ministeriais
- [ ] **TIME-02**: Tipos: cargo, departamento, status, observação
- [ ] **TIME-03**: Registros de alterações com user e timestamp

### Attendance (ATTD)

- [ ] **ATTD-01**: Tabela `member_attendances` para controle de presença
- [ ] **ATTD-02**: Vinculação a eventos
- [ ] **ATTD-03**: Status: presente, ausente, justificar

### Roles (ROLE)

- [ ] **ROLE-01**: Enum de cargos alinhado ao RBAC
- [ ] **ROLE-02**: Tabela `member_roles` para histórico de cargos
- [ ] **ROLE-03**: Cargos: Member, Leader, Treasurer, Admin, Super Admin

### Multi-Tenant & Security (SECU)

- [ ] **SECU-01**: `church_id` em todas as tabelas
- [ ] **SECU-02**: RLS policies por church_id
- [ ] **SECU-03**: Índices para performance
- [ ] **SECU-04**: Audit columns (created_by, updated_by)

## v2 Requirements

### Departments

- **DEPT-01**: Tabela de departamentos/ministérios
- **DEPT-02**: Hierarquia de departamentos
- **DEPT-03**: Membros por departamento

## Out of Scope

| Feature | Reason |
|---------|--------|
| Migrations de financeiro | v0.3 -Financeiro |
| Migrations de eventos | v0.4 -Eventos |
| Migrations de escalas | v1 -Escalas |
| Mobile app | V2 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MEMB-01 | Phase 1 | Pending |
| MEMB-02 | Phase 1 | Pending |
| MEMB-03 | Phase 1 | Pending |
| MEMB-04 | Phase 1 | Pending |
| MEMB-05 | Phase 1 | Pending |
| MEMB-06 | Phase 1 | Pending |
| FMLY-01 | Phase 1 | Pending |
| FMLY-02 | Phase 1 | Pending |
| FMLY-03 | Phase 1 | Pending |
| FMLY-04 | Phase 1 | Pending |
| TIME-01 | Phase 2 | Pending |
| TIME-02 | Phase 2 | Pending |
| TIME-03 | Phase 2 | Pending |
| ATTD-01 | Phase 2 | Pending |
| ATTD-02 | Phase 2 | Pending |
| ATTD-03 | Phase 2 | Pending |
| ROLE-01 | Phase 2 | Pending |
| ROLE-02 | Phase 2 | Pending |
| ROLE-03 | Phase 2 | Pending |
| SECU-01 | Phase 3 | Pending |
| SECU-02 | Phase 3 | Pending |
| SECU-03 | Phase 3 | Pending |
| SECU-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-08*
*Last updated: 2026-05-08 after approval of v0.2 requirements*