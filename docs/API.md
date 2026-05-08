# API Reference

## Overview

SGI Master é uma aplicação frontend Next.js com Supabase como backend. Toda a lógica de servidor, autenticação e banco de dados é gerenciada pelo Supabase (PostgreSQL + Auth + RLS).

## Supabase Client

**Location:** `src/lib/supabase.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
```

O cliente valida as variáveis de ambiente na inicialização. Lança `Error` se `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` estiverem ausentes.

## Autenticação (useAuth Hook)

**Location:** `src/hooks/useAuth.tsx`

O hook `useAuth` expõe um contexto React com os seguintes métodos:

| Método | Assinatura | Descrição |
|--------|-----------|-----------|
| `signIn` | `(email: string, password: string) => Promise<{ error: AuthError \| null }>` | Login com e-mail e senha via Supabase Auth |
| `signUp` | `(email: string, password: string, name: string) => Promise<{ error: AuthError \| null }>` | Registro com metadados (`data.name`) |
| `signOut` | `() => Promise<void>` | Logout e limpeza de estado |
| `resetPassword` | `(email: string) => Promise<{ error: AuthError \| null }>` | Envia e-mail de recuperação |
| `updatePassword` | `(newPassword: string) => Promise<{ error: AuthError \| null }>` | Atualiza senha do usuário |

**Contexto:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `user` | `User \| null` | Usuário autenticado (Supabase User) |
| `session` | `Session \| null` | Sessão ativa |
| `loading` | `boolean` | Estado de carregamento inicial |

**Uso:**

```typescript
const { user, signIn, signOut, loading } = useAuth();
```

## Middleware (Rotas Protegidas)

**Location:** `src/middleware.ts`

O middleware Next.js protege rotas e gerencia redirecionamentos:

| Rota | Comportamento |
|------|--------------|
| `/dashboard/*` | Redireciona para `/login` se não autenticado |
| `/login`, `/register`, `/forgot-password` | Redireciona para `/dashboard` se já autenticado |

O middleware usa `createServerClient` do `@supabase/ssr` para validar a sessão em todas as requisições.

## Rotas Frontend

### Grupo de Autenticação — `(auth)`

| Rota | Descrição |
|------|-----------|
| `/login` | Página de login com validação Zod |
| `/register` | Registro de nova conta |
| `/forgot-password` | Recuperação de senha |

### Grupo Protegido — `(dashboard)`

| Rota | Descrição |
|------|-----------|
| `/dashboard` | Dashboard principal com KPIs, gráficos, calendário |
| `/dashboard/*` | Futuros módulos (membros, financeiro, eventos) |

O layout `(dashboard)/layout.tsx` envolve todas as rotas protegidas com Sidebar + TopBar.

## Banco de Dados

**Supabase Project:** `https://dgfstgnkpbqsogdaitzp.supabase.co`

Todas as tabelas possuem `church_id` para multi-tenancy e RLS habilitado.

### Tabela: `members`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `uuid` | PK, gerado por `uuid_generate_v4()` |
| `church_id` | `uuid` | Identificador multi-tenant da igreja |
| `name` | `varchar(255)` | Nome completo |
| `birth_date` | `date` | Data de nascimento |
| `gender` | `gender_type` | Enum: male, female, other, prefer_not_to_say |
| `marital_status` | `marital_status_type` | Enum: single, married, divorced, widowed, separated |
| `phone` | `varchar(20)` | Telefone |
| `email` | `varchar(255)` | E-mail |
| `address` | `text` | Endereço completo |
| `address_city` | `varchar(100)` | Cidade |
| `address_state` | `varchar(50)` | Estado |
| `baptism_date` | `date` | Data do batismo |
| `conversion_date` | `date` | Data de conversão |
| `department_id` | `uuid` | Departamento/ministério principal |
| `status` | `boolean` | true = ativo, false = inativo |
| `avatar_url` | `text` | URL do avatar |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data de atualização |
| `deleted_at` | `timestamptz` | Soft delete (null = ativo) |
| `created_by` | `uuid` | Usuário que criou |
| `updated_by` | `uuid` | Usuário que atualizou |

**Índices:** `idx_members_church_id`, `idx_members_church_id_status`, `idx_members_department`, `idx_members_active`

### Tabela: `family_groups`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `uuid` | PK |
| `church_id` | `uuid` | Multi-tenant |
| `name` | `varchar(255)` | Nome do grupo familiar |
| `leader_id` | `uuid` | FK para members (líder do grupo) |
| `created_at` | `timestamptz` | Data de criação |

### Tabela: `family_members`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `uuid` | PK |
| `family_group_id` | `uuid` | FK para family_groups |
| `member_id` | `uuid` | FK para members |
| `relationship` | `varchar(50)` | Relacionamento (esposa, filho, etc.) |

### Tabela: `member_timeline`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `uuid` | PK |
| `member_id` | `uuid` | FK para members |
| `church_id` | `uuid` | Multi-tenant |
| `event_type` | `text` | Tipo de evento (status_change, role_update, etc.) |
| `description` | `text` | Descrição do evento |
| `metadata` | `jsonb` | Dados adicionais |
| `created_by` | `uuid` | Usuário que registrou |
| `created_at` | `timestamptz` | Data do evento |

### Tabela: `member_attendances`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `uuid` | PK |
| `member_id` | `uuid` | FK para members |
| `event_id` | `uuid` | FK para events |
| `present` | `boolean` | Presente/não presente |
| `notes` | `text` | Observações |
| `created_at` | `timestamptz` | Data de registro |

### Tabela: `member_roles`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `uuid` | PK |
| `member_id` | `uuid` | FK para members |
| `church_id` | `uuid` | Multi-tenant |
| `role` | `member_role` | Enum: member, leader, treasurer, admin, super_admin |
| `started_at` | `date` | Data de início |
| `ended_at` | `date` | Data de fim (null = ativo) |
| `notes` | `text` | Observações |

## Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado. Políticas baseadas em `church_id`:

- **SELECT:** Usuário vê apenas registros da sua igreja (`church_id` = sessão do usuário)
- **INSERT:** Novo registro recebe `church_id` da sessão
- **UPDATE/DELETE:** Apenas registros da própria igreja

Migrations: `supabase/migrations/20260508000009_enable_rls_helper_function.sql`, `20260508000010_rls_members_policies.sql`, `20260508000011_rls_related_tables.sql`

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

---

*API Reference: 2026-05-08*