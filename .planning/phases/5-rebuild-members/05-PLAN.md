---
phase: 5-rebuild-members
status: planned
milestone: v0.5-rebuild-members
context: SPEC.md
---

# Plano: Reconstrução do Módulo de Membros

## Objetivo

Reconstruir o módulo de membros para alinhamento completo com as tabelas reais do Supabase, migrando de hooks useState para React Query e adicionando campos faltantes (departamento, vínculo familiar completo, presença real).

## Waves

### Wave 1: Tipos e Services (alinhamento com banco)
- [ ] Atualizar `src/types/member.ts` com todos os campos do banco
- [ ] Atualizar `src/types/memberSchema.ts` com novos campos (department_id, family_relationship, role_end_date)
- [ ] Criar `src/lib/services/members.ts`
- [ ] Criar `src/lib/services/family.ts`
- [ ] Criar `src/lib/services/departments.ts`

### Wave 2: Hooks React Query (migração useState → RQ)
- [ ] Conectar páginas ao `useMembersQuery.ts` (useMembers, useMember, useCreateMember, useUpdateMember, useDeleteMember)
- [ ] Garantir cache invalidation correta após mutações
- [ ] Remover `useMembers.ts` (useState) e `useMember.ts` (useState) se tudo migrado

### Wave 3: Formulário Completo (criar + editar)
- [ ] Adicionar campo `department_id` com select populado de `departments`
- [ ] Adicionar `family_relationship` (enum de 24 valores) no vínculo familiar
- [ ] Adicionar `role_end_date` no card de cargos
- [ ] FIX: pré-preencher family_group_id e relationship na edição

### Wave 4: Perfil com Dados Reais
- [ ] Timeline ministerial: já funciona (dados reais)
- [ ] Presença: substituir 85% fake por dados reais de `member_attendances`
- [ ] Mostrar departamento do membro
- [ ] Mostrar cargos com data fim

### Wave 5: Limpeza e Verificação
- [ ] Remover dead code (useState hooks se migrados)
- [ ] Rodar typecheck e lint
- [ ] Verificar cobertura de tipos vs banco
