# Siltec-Solutions | SGI

## O Que É

Plataforma SaaS moderna de gestão eclesiástica desenvolvida para igrejas, ministérios e comunidades religiosas brasileiras. O sistema centraliza e moderniza toda a administração ministerial, oferecendo gestão de membros, financeira, eventos, departamentos, escalas de voluntários e relatórios gerenciais em um ambiente multi-tenant seguro e escalável.

## Valor Principal

Plataforma de gestão ministerial completa que permite às igrejas brasileiras gerenciar sua administração de forma centralizada, segura e escalável, desde pequenas congregações até grandes ministérios multi-campus.

## Current Milestone: v0.3 — Financeiro & API

**Goal:** Implementar módulo financeiro com entradas/saídas, e API REST para integração.

**Status:** Em planejamento

---

<details>
<summary>Histórico: v0.2 Membros & Supabase Schema (COMPLETO)</summary>

**Concluído em:** 2026-05-08

**Entregas:**
- Tabela `members` com campos completos
- Relacionamento família/grupo (`family_groups`, `family_members`)
- Timeline ministerial (`member_timeline`)
- Controle de presença (`member_attendances`)
- Cargos RBAC (Member, Leader, Treasurer, Admin, Super Admin)
- Multi-tenant via `church_id` em todas as tabelas
- RLS policies para segurança por igreja
- Triggers de auditoria (17 triggers em 7 tabelas)

**Migrations aplicadas:** 12 arquivos SQL no Supabase

</details>

---

## Requisitos

### Validados

(Nenhum ainda — shipped para validar)

### Ativos

- [ ] Autenticação e controle de acesso (login, recuperação de senha, MFA, RBAC)
- [ ] Dashboard com KPIs estratégicos
- [ ] Gestão completa de membros (cadastro, filtros, histórico,Timeline)
- [ ] Gestão financeira (dízimos, ofertas, entradas, saídas, relatórios)
- [ ] Eventos e agenda (cadastro, calendário, check-in)
- [ ] Departamentos e ministérios
- [ ] Escalas de voluntários
- [ ] Central de notificações
- [ ] Relatórios e analytics

### Fora do Escopo

- Aplicativo Mobile — será desenvolvido na V2
- WhatsApp API — integrations futuras
- Inteligencia Artificial — V3
- Multi-filiais — V2

---

## Contexto

### Ambiente Tecnológico

| Categoria | Tecnologia |
|-----------|-------------|
| Frontend | Next.js 15+ (TypeScript, Tailwind CSS, Shadcn/UI) |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Deploy | Vercel |

### Decisões de Stack

| Decisão | Rationale | Resultado |
|---------|-----------|----------|
| Next.js 15+ | SSR + Server Components, performance Enterprise | — Pendente |
| Supabase | Multi-tenant nativo, RLS, Realtime, Edge Functions | — Pendente |
| Tailwind + Shadcn/UI | Design system consistente, desenvolvimento rápido | — Pendente |
| RBAC 5 níveis | Permissões granulares por módulo | — Pendente |

---

## Restrições

- **LGPD:** Consentimento explícito, exclusão de dados, exportação — cumplimiento obrigatório
- **Performance:** Tempo de carregamento < 2s, Lighthouse > 90
- **Disponibilidade:** Uptime 99.5%
- **Segurança:** RLS, JWT, MFA, criptografia, auditoria

---

## Evolução

Este documento evolui nas transições de fase e limites de milestone.

**Após cada transição de fase:**
1. Requisitos invalidados? → Mover para Fora do Escopo com justificativa
2. Requisitos validados? → Mover para Validados com referência
3. Novos requisitos surgiram? → Adicionar para Ativos
4. Decisões para registrar? → Adicionar para Decisões-Chave
5. "O Que É" ainda preciso? → Atualizar se drifted

**Após cada milestone:**
1. Revisão completa de todas as seções
2. Verificação do Valor Principal — ainda a prioridade certa?
3. Auditoria de Fora do Escopo — razões ainda válidas?
4. Atualização do Contexto com estado atual

---

*Última atualização: 2026-05-08 após início do milestone v0.1*