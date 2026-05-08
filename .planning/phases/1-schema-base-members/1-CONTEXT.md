# Contexto da Fase 1: Schema Base - Members & Families

**Phase:** 1
**Created:** 2026-05-08
**Status:** Pronto para planejamento

---

## Domínio

Migrations SQL do Supabase para criar o schema inicial do módulo de membros.

**Requirements:** MEMB-01 a MEMB-06, FMLY-01 a FMLY-04

---

## Decisões

### Estrutura de Migrations

| Decisão | Detalhes |
|---------|----------|
| **Formato** | SQL files em `supabase/migrations/` |
| **Nomenclatura** | `YYYYMMDDHHmmss_description.sql` |
| **Ordem** | 1-membros, 2-familias, 3-family_members |
| **Soft delete** | `deleted_at TIMESTAMPTZ NULL` |

### Tabela Members

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | UUID | Primary key, uuid_generate_v4() |
| `church_id` | UUID | Multi-tenant, obrigatório |
| `name` | VARCHAR(255) | Nome completo |
| `birth_date` | DATE | |
| `gender` | ENUM | male, female, other, prefer_not_to_say |
| `marital_status` | ENUM | single, married, divorced, widowed, separated |
| `phone` | VARCHAR(20) | Formato brasileiro |
| `email` | VARCHAR(255) | |
| `address` | TEXT | Endereço completo |
| `address_city` | VARCHAR(100) | |
| `address_state` | VARCHAR(50) | |
| `baptism_date` | DATE | |
| `conversion_date` | DATE | |
| `department_id` | UUID | FK para departments |
| `status` | BOOLEAN | true = ativo |
| `avatar_url` | TEXT | URL do avatar no Supabase Storage |
| `created_at` | TIMESTAMPTZ | Default NOW() |
| `updated_at` | TIMESTAMPTZ | |
| `deleted_at` | TIMESTAMPTZ | Soft delete |
| `created_by` | UUID | Audit |
| `updated_by` | UUID | Audit |

### Tabela Family Groups

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | UUID | Primary key |
| `church_id` | UUID | Multi-tenant |
| `name` | VARCHAR(255) | Nome do grupo/família |
| `leader_id` | UUID | FK para members |
| `description` | TEXT | |
| `status` | BOOLEAN | |

### Tabela Family Members

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | UUID | Primary key |
| `church_id` | UUID | Multi-tenant |
| `family_group_id` | UUID | FK para family_groups |
| `member_id` | UUID | FK para members |
| `relationship` | ENUM | husband, wife, son, etc. |
| `is_primary_contact` | BOOLEAN | Apenas um por família |
| `notes` | TEXT | |

---

## Referências Canônicas

**Downstream agents MUST read these before planning or implementing.**

- `docs/prd.md` — Modelo de dados na seção 10 (Users, Members, Departments)
- `.planning/PROJECT.md` — Stack: Supabase + PostgreSQL + Multi-tenant
- `.planning/REQUIREMENTS.md` — REQ-IDs: MEMB-01 a MEMB-06, FMLY-01 a FMLY-04

---

## Ideias Adiadas

- RLS policies (v0.2 Fase 3)
- Validations e triggers (v0.2 Fase 3)
- Functions helper para church_id (v0.2 Fase 3)

---

*Created: 2026-05-08*
*Updated: 2026-05-08 after research*