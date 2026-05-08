# Phase 4 Plan: Interface do Módulo de Membros

**Status:** ✅ Completed
**Milestone:** v0.3.1-membros-ui
**Context:** [CONTEXT.md](CONTEXT.md)

## Goals
1. Criar sistema de listagem de membros com busca, filtros (incluindo status de cargo) e ações em massa. ✅
2. Desenvolver formulário de cadastro/edição com suporte à criação de grupos familiares "on the fly". ✅
3. Implementar página de perfil com timeline ministerial e histórico básico. ✅
4. Integrar com Supabase (Fetch, Insert, Update, Soft Delete). ✅

## Waves

### Wave 1: Foundation & Shared Components ✅
- [x] Criar estrutura de pastas: `src/app/(dashboard)/membros`
- [x] Implementar componentes base: `Card`, `Badge`.
- [x] Criar hooks de dados: `useMembers`, `useMember(id)`, `useFamilyGroups`.

### Wave 2: Listing & Filtering ✅
- [x] Implementar `src/app/(dashboard)/membros/page.tsx` (Página de listagem).
- [x] Adicionar tabela com busca por nome e filtros de Status.
- [x] Implementar visual de listagem premium.

### Wave 3: Create Flow ✅
- [x] Implementar `src/app/(dashboard)/membros/novo/page.tsx` (Cadastro).
- [x] Criar formulário dividido em seções (Pessoal, Endereço, Ministerial).
- [x] Implementar criação de novo grupo familiar "on the fly".

### Wave 4: Member Profile ✅
- [x] Implementar `src/app/(dashboard)/membros/[id]/page.tsx` (Visualização de perfil).
- [x] Exibir Timeline Ministerial dinâmica.
- [x] Mostrar resumo de presença e vínculos familiares.

## Verification Details
- [ ] Listagem carrega dados reais do Supabase.
- [ ] Filtros refinam a busca corretamente.
- [ ] Cadastro cria membro e (se selecionado) novo grupo familiar.
- [ ] Ações em massa atualizam múltiplos registros no banco.
- [ ] Timeline exibe eventos em ordem cronológica.

## Technical Notes
- Usar `lucide-react` para ícones.
- Usar `zod` para validação de formulário.
- Seguir o padrão de cores e efeitos `glass-card` do dashboard.
