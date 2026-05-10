# Arquitetura

**Última atualização:** 2026-05-10

## Visão Geral

Sistema SaaS multi-tenant de gestão eclesiástica construído com arquitetura moderna baseada em Next.js 15 App Router e Supabase como backend.

## Padrão Arquitetural

**Arquitetura em Camadas com BaaS (Backend as a Service)**

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Next.js App Router + React)     │
├─────────────────────────────────────┤
│         Application Layer           │
│  (Server Components, Actions, API)  │
├─────────────────────────────────────┤
│          Service Layer              │
│    (Supabase Client, Hooks API)     │
├─────────────────────────────────────┤
│          Data Layer                 │
│  (Supabase PostgreSQL + RLS + Auth) │
└─────────────────────────────────────┘
```

## Camadas

### 1. Presentation Layer

**Localização:** `src/app/`, `src/components/`

- **App Router:** Roteamento baseado em sistema de arquivos
- **Route Groups:** 
  - `(auth)` - Páginas de autenticação (login, registro, recuperação)
  - `(dashboard)` - Páginas protegidas do dashboard
- **Server Components:** Renderização no servidor por padrão
- **Client Components:** Marcados com `'use client'` quando necessário
- **Layouts:** Layouts compartilhados por grupo de rotas

**Componentes:**
- `components/ui/` - Componentes base do Shadcn/UI (Badge, Card)
- `components/layout/` - Componentes de layout (Sidebar, TopBar)
- `components/DashboardProvider.tsx` - Provider de contexto do dashboard

### 2. Application Layer

**Localização:** `src/app/`, `src/middleware.ts`

- **Server Actions:** Ações executadas no servidor (ainda não implementadas)
- **API Routes:** Endpoints REST (ainda não implementados)
- **Middleware:** Proteção de rotas e gerenciamento de sessão

**Middleware de Autenticação:**
```typescript
// src/middleware.ts
- Verifica sessão do usuário via Supabase
- Protege rotas /dashboard/*
- Redireciona usuários não autenticados para /login
- Redireciona usuários autenticados de /login para /dashboard
```

### 3. Service Layer

**Localização:** `src/lib/`, `src/hooks/`

**Supabase Client:**
- `src/lib/supabase.ts` - Cliente browser do Supabase
- Gerenciamento de sessão via cookies
- Integração com SSR

**Hooks (em desenvolvimento):**
- `src/hooks/api/` - Hooks para chamadas API

### 4. Data Layer

**Supabase PostgreSQL**

**Multi-Tenancy:**
- Coluna `church_id` em todas as tabelas
- RLS (Row Level Security) policies por igreja
- Função helper: `get_current_church_id()`

**Segurança:**
- RLS habilitado em todas as tabelas
- Policies restritivas por `church_id`
- Triggers de auditoria (created_by, updated_by, timestamps)

**Schemas:**
```
members (tabela principal)
├── family_groups (grupos familiares)
├── family_members (relacionamento N:N)
├── member_timeline (histórico de eventos)
├── member_roles (cargos RBAC)
├── member_attendances (presença)
└── events (eventos da igreja)
```

## Fluxo de Dados

### Autenticação

```
1. Usuário acessa /login
2. Submete credenciais
3. Supabase Auth valida e cria sessão JWT
4. Sessão armazenada em cookies (httpOnly)
5. Middleware valida sessão em cada request
6. Usuário redirecionado para /dashboard
```

### Operações CRUD

```
1. Componente React (Client/Server)
2. Hook customizado ou Server Action
3. Supabase Client
4. PostgreSQL + RLS validation
5. Retorno de dados filtrados por church_id
```

## Padrões de Segurança

### Row Level Security (RLS)

**Todas as tabelas implementam:**
- SELECT: `church_id = get_current_church_id()`
- INSERT: `church_id = get_current_church_id()`
- UPDATE: `church_id = get_current_church_id()`
- DELETE: `church_id = get_current_church_id()`

### Auditoria

**17 triggers implementados em 7 tabelas:**
- `created_at` - timestamp de criação
- `updated_at` - timestamp de atualização
- `created_by` - usuário que criou
- `updated_by` - usuário que atualizou
- `deleted_at` - soft delete

## Padrões de Renderização

### Server Components (padrão)

- Páginas de listagem
- Dashboards
- Layouts
- Componentes que fazem fetch de dados

### Client Components

- Formulários interativos
- Componentes com estado local
- Componentes com event handlers
- Componentes que usam hooks do React

## Gerenciamento de Estado

**Atual:**
- Estado local via `useState`
- Context API via `DashboardProvider`
- Server state via Server Components

**Futuro (planejado):**
- React Query / TanStack Query para cache
- Zustand para estado global complexo

## Roteamento

### Estrutura de Rotas

```
/                          → Landing page
/login                     → Autenticação
/register                  → Registro
/forgot-password           → Recuperação de senha
/dashboard                 → Dashboard principal
/dashboard/membros         → Lista de membros
/dashboard/membros/novo    → Novo membro
/dashboard/membros/[id]    → Detalhes do membro
/dashboard/membros/[id]/editar → Editar membro
```

### Proteção de Rotas

- Middleware intercepta todas as rotas
- Rotas `/dashboard/*` requerem autenticação
- Rotas `/login`, `/register` redirecionam se autenticado

## Integração com Supabase

### Auth

- JWT tokens em cookies httpOnly
- Refresh automático de tokens
- SSR-compatible via `@supabase/ssr`

### Database

- Client-side queries via `supabase.from()`
- RLS automático aplicado
- Realtime subscriptions (não implementado ainda)

### Storage

- Upload de avatares (planejado)
- Imagens via CDN do Supabase

## Escalabilidade

### Multi-Tenant

- Isolamento por `church_id`
- RLS garante separação de dados
- Índices em `church_id` para performance

### Performance

- Server Components reduzem bundle JS
- Static Generation onde possível
- Image optimization via Next.js
- CDN via Vercel Edge Network

## Observabilidade

**Atual:**
- Logs do Vercel
- Logs do Supabase Dashboard

**Planejado:**
- Error tracking (Sentry)
- Analytics (Vercel Analytics)
- Performance monitoring

## Decisões Arquiteturais

| Decisão | Rationale | Trade-offs |
|---------|-----------|------------|
| Next.js App Router | SSR, RSC, melhor DX | Curva de aprendizado |
| Supabase | Multi-tenant nativo, RLS, Auth integrado | Vendor lock-in |
| RLS para multi-tenancy | Segurança no banco, impossível bypassar | Complexidade nas queries |
| Server Components | Menos JS no cliente, melhor performance | Limitações de interatividade |
| TypeScript strict | Type safety, menos bugs | Mais tempo de desenvolvimento |
