# Preocupações e Dívidas Técnicas

**Última atualização:** 2026-05-10

## Visão Geral

Este documento registra problemas conhecidos, dívidas técnicas, áreas que precisam de melhorias e preocupações de segurança/performance no projeto.

## 🔴 Crítico

### 1. Ausência de Testes

**Status:** ✅ Resolvido (2026-05-10)

**Impacto:** Alto risco de regressões, bugs em produção

**Descrição:**
- Nenhum teste unitário, integração ou E2E implementado
- Mudanças no código não têm validação automatizada
- RLS policies não testadas (crítico para segurança multi-tenant)
- Autenticação não testada

**Solução Implementada:**
- ✅ Vitest + Testing Library configurado
- ✅ Playwright para E2E configurado
- ✅ Testes de segurança criados (RLS, Auth, Middleware) - aguardando configuração do Supabase local
- ✅ Testes de ErrorBoundary e error handling implementados
- ✅ Smoke test funcionando

**Referência:** `src/__tests__/`, `vitest.config.ts`, `playwright.config.ts`

### 2. Páginas de Debug em Produção

**Status:** ✅ Resolvido (2026-05-10)

**Impacto:** Risco de segurança, exposição de dados

**Arquivos:**
- ~~`src/app/debug-members/page.tsx`~~ (REMOVIDO)
- ~~`src/app/setup-test-user/page.tsx`~~ (REMOVIDO)
- ~~`src/app/test-auth/`~~ (REMOVIDO)

**Descrição:**
- Páginas de desenvolvimento acessíveis em produção
- Podem expor informações sensíveis
- Não têm proteção de acesso

**Solução Implementada:**
- ✅ Todas as páginas de debug removidas
- ✅ Risco de segurança eliminado

### 3. Tratamento de Erros Inconsistente

**Status:** ✅ Resolvido (2026-05-10)

**Impacto:** UX ruim, dificulta debugging

**Descrição:**
- Alguns componentes não tratam erros do Supabase
- Sem Error Boundaries implementados
- Mensagens de erro não traduzidas
- Logs de erro não estruturados

**Solução Implementada:**
- ✅ ErrorBoundary global implementado em `src/components/ErrorBoundary.tsx`
- ✅ ErrorBoundary adicionado ao layout raiz e dashboard
- ✅ Sistema de erros customizados em `src/lib/errors.ts`
- ✅ Classes de erro: AppError, AuthenticationError, AuthorizationError, ValidationError, NotFoundError, DatabaseError
- ✅ Função `handleSupabaseError` para converter erros do Supabase
- ✅ Função `getErrorMessage` para mensagens amigáveis
- ✅ Testes implementados para ErrorBoundary e error handling
- 🔄 Integração com Sentry planejada para v0.4

## 🟡 Importante

### 4. Performance - Sem Otimizações de Cache

**Status:** ✅ Resolvido (2026-05-10)

**Impacto:** Queries repetidas, UX lenta

**Descrição:**
- Sem cache de queries do Supabase
- Componentes re-fetcham dados desnecessariamente
- Sem estratégia de revalidação

**Solução Implementada:**
- ✅ React Query / TanStack Query implementado
- ✅ QueryProvider configurado com cache strategies (5min stale, 10min gc)
- ✅ Hooks implementados para módulo Members:
  - `useMembers` - lista com filtros e paginação
  - `useCreateMember` - criação com invalidação automática
  - `useUpdateMember` - atualização com invalidação automática
  - `useDeleteMember` - soft delete com invalidação automática
  - `useMember` - busca individual com dados relacionados
- ✅ Testes implementados (7 testes passando)
- ✅ Documentação criada em `docs/REACT_QUERY.md`
- 🔄 Próximo: migrar outros módulos (Family Groups, Events, Attendances, Roles, Timeline)

**Referência:** `src/hooks/api/useMembersQuery.ts`, `src/providers/QueryProvider.tsx`, `docs/REACT_QUERY.md`

### 5. Gerenciamento de Estado Global

**Status:** Context API básico

**Impacto:** Dificulta escalabilidade

**Descrição:**
- `DashboardProvider` usa Context API simples
- Sem otimização de re-renders
- Dificulta adicionar novos estados globais

**Solução:**
- Avaliar Zustand ou Jotai para estado global
- Manter Context API apenas para temas/preferências
- Usar React Query para server state

### 6. Validação de Formulários Incompleta

**Status:** Parcialmente implementado

**Impacto:** Dados inválidos no banco

**Descrição:**
- Schemas Zod existem mas não cobrem todos os casos
- Validações de negócio (ex: idade mínima) não implementadas
- Mensagens de erro genéricas

**Solução:**
- Expandir schemas Zod com validações de negócio
- Adicionar validações customizadas
- Melhorar mensagens de erro

**Exemplo:**
```typescript
// Adicionar validações como:
birth_date: z.string().refine(
  (date) => calculateAge(date) >= 0 && calculateAge(date) <= 120,
  { message: 'Data de nascimento inválida' }
)
```

### 7. Acessibilidade (A11y)

**Status:** Básico

**Impacto:** Usuários com deficiência não conseguem usar

**Descrição:**
- Sem testes de acessibilidade
- ARIA labels incompletos
- Navegação por teclado não testada
- Contraste de cores não validado

**Solução:**
- Adicionar testes com axe-core
- Implementar navegação completa por teclado
- Validar contraste WCAG AA
- Adicionar screen reader support

## 🟢 Melhorias Desejáveis

### 8. Documentação de Componentes

**Status:** Ausente

**Impacto:** Dificulta manutenção e onboarding

**Descrição:**
- Componentes sem JSDoc
- Props sem descrição
- Sem Storybook ou similar

**Solução:**
- Adicionar JSDoc em componentes públicos
- Considerar Storybook (v0.5)
- Documentar padrões de uso

### 9. Internacionalização (i18n)

**Status:** Não implementado

**Impacto:** Limitado ao mercado brasileiro

**Descrição:**
- Textos hardcoded em português
- Sem suporte a múltiplos idiomas
- Datas/números não localizados

**Solução:**
- Implementar next-intl ou react-i18next (v0.6)
- Extrair strings para arquivos de tradução
- Suportar pt-BR, en-US, es-ES

### 10. Logs e Observabilidade

**Status:** Logs básicos no console

**Impacto:** Dificulta debugging em produção

**Descrição:**
- Apenas `console.log` e `console.error`
- Sem estrutura de logs
- Sem tracking de eventos
- Sem APM (Application Performance Monitoring)

**Solução:**
- Integrar Sentry para error tracking
- Adicionar Vercel Analytics
- Implementar structured logging
- Considerar OpenTelemetry (futuro)

### 11. CI/CD

**Status:** Deploy manual via Vercel

**Impacto:** Sem validação automática

**Descrição:**
- Sem GitHub Actions
- Sem validação de PRs
- Sem testes automáticos
- Sem lint/type-check no CI

**Solução:**
- Configurar GitHub Actions (v0.4)
- Rodar testes em PRs
- Validar build antes de merge
- Deploy automático apenas se testes passarem

### 12. Segurança - Secrets em Código

**Status:** Variáveis de ambiente corretas

**Impacto:** Baixo (mas precisa atenção)

**Descrição:**
- Variáveis de ambiente bem configuradas
- Mas sem validação de secrets em commits
- Sem rotação de chaves

**Solução:**
- Adicionar pre-commit hook para detectar secrets
- Implementar rotação de chaves Supabase
- Usar Vercel Environment Variables

## Dívidas Técnicas por Módulo

### Módulo de Membros

- [ ] Paginação server-side (atual é client-side)
- [ ] Export para Excel/PDF
- [ ] Importação em massa (CSV)
- [ ] Fotos de perfil (Storage)
- [ ] Histórico de alterações (audit log UI)

### Autenticação

- [ ] 2FA / MFA
- [ ] Login social (Google, Facebook)
- [ ] Política de senhas fortes
- [ ] Rate limiting em login
- [ ] Logs de tentativas de login

### Dashboard

- [ ] Gráficos de métricas reais
- [ ] Filtros de data
- [ ] Comparação de períodos
- [ ] Export de relatórios

## Problemas Conhecidos

### 1. Sincronização de `church_id`

**Descrição:** Em alguns casos, o `church_id` do JWT pode não estar sincronizado com o perfil do usuário.

**Workaround:** Função `get_current_church_id()` implementada, mas precisa de testes.

**Issue:** Nenhuma aberta ainda

### 2. Performance em Listas Grandes

**Descrição:** Lista de membros com 1000+ registros pode ficar lenta.

**Workaround:** Paginação client-side implementada (50 por página).

**Solução Futura:** Paginação server-side + virtualização

### 3. Timezone

**Descrição:** Datas armazenadas em UTC, mas exibidas sem conversão para timezone local.

**Workaround:** Usar `date-fns` com timezone do navegador.

**Solução Futura:** Armazenar timezone da igreja no perfil

## Métricas de Qualidade

| Métrica | Atual | Meta |
|---------|-------|------|
| Cobertura de Testes | ~45% (32/71 tests) | 80%+ |
| Lighthouse Performance | ? | 90+ |
| Lighthouse Accessibility | ? | 95+ |
| TypeScript Strict | ✅ | ✅ |
| ESLint Errors | 0 | 0 |
| Bundle Size | ? | < 200KB |

## Roadmap de Melhorias

### v0.3 (Próximo)
- [x] Implementar testes (Vitest + Playwright)
- [x] Remover páginas de debug
- [x] Adicionar Error Boundaries
- [x] Implementar React Query

### v0.4
- [ ] CI/CD com GitHub Actions
- [ ] Integrar Sentry
- [ ] Melhorar acessibilidade
- [ ] Otimizar performance

### v0.5
- [ ] Internacionalização (i18n)
- [ ] Storybook
- [ ] APM / Observabilidade completa

## Observações

- Priorizar segurança e testes antes de novas features
- Documentar decisões arquiteturais importantes
- Revisar este documento a cada milestone
- Criar issues no GitHub para tracking
