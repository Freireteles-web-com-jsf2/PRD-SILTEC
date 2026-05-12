---
phase: 6-related-crud
status: context-captured
created: 2026-05-12
milestone: v0.3
---

# Contexto: Fase 6 — CRUD Tabelas Relacionadas a Membros

## Domain

CRUDs independentes para as tabelas relacionadas a `members` no Supabase: `family_groups`, `departments`, `events`, `member_attendances`, `member_roles`, `member_timeline`.

## Decisions

### Ordem de Implementação

1. `family_groups` — CRUD de grupos familiares (já há integração parcial no form de membros)
2. `departments` — CRUD de departamentos/ministérios (migration já copiada para supabase/migrations/)
3. `events` — CRUD completo de eventos
4. `member_attendances` — Check-in/presença integrado ao evento
5. `member_roles` / `member_timeline` — Tela de gerenciamento de cargos e histórico global

### Layout dos CRUDs

**Páginas dedicadas com rotas próprias:**

```
/familias              → list, create, edit, delete
/departamentos         → list, create, edit, delete
/eventos               → list, create, edit, delete
/eventos/[id]/presenca → check-in (lista de membros com status)
/cargos                → list, assign, revoke
```

### Eventos + Presença

Bloco único: CRUD completo de eventos + check-in integrado na mesma fase. A tela de detalhe do evento exibe a lista de membros com opções: presente, ausente, justificado. Não criar CRUD separado de `member_attendances` — presença é gerenciada dentro do evento.

### Cargos e Timeline

Tela separada `/cargos` com:
- Lista de todos os cargos ativos da igreja
- Atribuir/revogar cargos por membro
- Histórico global de cargos (member_roles + member_timeline)

### Navegação no Sidebar

Sub-menu dentro de "Membros" (expansível):

```
☰ Membros
  ▼ Módulos
     ☰ Famílias       → /familias
     ☰ Departamentos  → /departamentos
     ☰ Eventos        → /eventos
     ☰ Cargos         → /cargos
```

## Codebase Context

### Reusable Assets
- `src/components/ui/Card.tsx` — Card component with header actions
- `src/components/ui/Badge.tsx` — Badge component for status/roles
- `src/hooks/api/useMembersQuery.ts` — React Query hooks (useMembers, useMember, etc.)
- `src/hooks/api/useFamilyGroups.ts` — Existing hook for family groups (uses useState — migrate to RQ)
- `src/lib/services/` — Services layer (members.ts, family.ts, departments.ts)
- `src/types/member.ts` — TypeScript types aligned to DB schema
- `src/types/memberSchema.ts` — Zod schemas for forms

### Established Patterns
- 'use client' pages with React Hook Form + Zod
- React Query for data fetching (useQuery + useMutation)
- Service layer between hooks and Supabase client
- Tailwind CSS with design tokens (primary, surface-variant, etc.)
- Lucide icons for UI

## Deferred Ideas

Nenhum.

## Canonical Refs

- `.planning/phases/5-rebuild-members/05-SPEC.md` — DB schema reference for all related tables
- `.planning/phases/5-rebuild-members/05-PLAN.md` — Prior wave structure
- `.planning/codebase/CONVENTIONS.md` — Code conventions (RHF + Zod, Tailwind tokens)
- `.planning/codebase/STRUCTURE.md` — Directory structure
