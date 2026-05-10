<!-- generated-by: gsd-doc-writer -->
# Guia de Desenvolvimento — SGI Master

## Stack de Desenvolvimento

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js | 15.1 |
| Runtime | React | 19.0 |
| Linguagem | TypeScript | 5.7 |
| Estilização | Tailwind CSS | 3.4 |
| Ícones | Material Symbols (Google Fonts) | — |
| Tipografia | Manrope (Google Fonts) | — |
| Formulários | React Hook Form + Zod | 7.54 / 3.24 |
| Tabelas | TanStack Table | 8.21 |
| Data Fetching | TanStack React Query | 5.100 |
| Gráficos | Recharts | 2.15 |
| Backend/Database | Supabase (PostgreSQL, Auth, Storage, RLS) | — |
| Testes unitários | Vitest | 4.1 |
| Testes E2E | Playwright | 1.59 |
| Deploy | Vercel | — |

## Comandos do package.json

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento Next.js em `http://localhost:3000` |
| `npm run build` | Compila a aplicação para produção |
| `npm run start` | Inicia o servidor de produção (após `build`) |
| `npm run lint` | Executa o linter Next.js (ESLint) em toda a base de código |
| `npm test` | Executa a suíte de testes unitários (Vitest) |
| `npm run test:ui` | Abre o dashboard interativo do Vitest UI |
| `npm run test:coverage` | Executa os testes com relatório de cobertura (V8) |
| `npm run test:e2e` | Executa os testes E2E com Playwright (headless) |
| `npm run test:e2e:ui` | Abre o Playwright UI Mode para testes interativos |

## Configuração do Projeto

### Pré-requisitos

- Node.js >= 18.x
- npm (ou yarn/pnpm)
- Conta no [Supabase](https://supabase.com) para backend

### Instalação

```bash
# Clonar o repositório
git clone <repo-url>
cd prd-siltec

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env   # ou editar .env diretamente
```

O arquivo `.env` requer as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://<projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave-anon-publica>
```

### Iniciar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`. A rota raiz (`/`) redireciona automaticamente para `/login`.

## Estrutura de Diretórios — `src/`

```
src/
├── app/                          # App Router do Next.js 15
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── forgot-password/      # Página de recuperação de senha
│   │   ├── login/                # Página de login
│   │   ├── register/             # Página de cadastro
│   │   └── layout.tsx            # Layout do grupo auth (minimalista)
│   ├── (dashboard)/              # Grupo de rotas protegidas (autenticadas)
│   │   ├── dashboard/            # Página principal com KPIs e gráficos
│   │   ├── membros/              # CRUD de membros
│   │   │   ├── [id]/             # Perfil/edição de membro individual
│   │   │   ├── novo/             # Cadastro de novo membro
│   │   │   └── page.tsx          # Listagem de membros
│   │   └── layout.tsx            # Layout do dashboard (Sidebar + TopBar)
│   ├── globals.css               # Estilos globais e variáveis CSS
│   ├── layout.tsx                # Root layout (fontes, providers)
│   └── page.tsx                  # Redireciona para /login
├── components/                   # Componentes React
│   ├── layout/
│   │   ├── Sidebar.tsx           # Navegação lateral fixa (72 itens de menu)
│   │   └── TopBar.tsx            # Barra superior com busca, notificações
│   ├── ui/
│   │   ├── Badge.tsx             # Componente de badge com variantes
│   │   └── Card.tsx              # Componente de cartão com header opcional
│   ├── DashboardProvider.tsx     # Provider de verificação de autenticação
│   └── ErrorBoundary.tsx         # Tratamento de erros em componentes filhos
├── hooks/                        # Hooks customizados
│   ├── useAuth.tsx               # Contexto de autenticação (AuthProvider + useAuth)
│   └── api/                      # Hooks de dados (data fetching)
│       ├── useMembers.ts         # Hook para listar membros com debounce
│       ├── useMember.ts          # Hook para buscar membro individual
│       ├── useFamilyGroups.ts    # Hook para listar/criar grupos familiares
│       └── useMembersQuery.ts    # Hooks com React Query (CRUD completo)
├── lib/                          # Utilitários e configurações
│   ├── supabase.ts               # Cliente Supabase (createBrowserClient)
│   └── errors.ts                 # Classes de erro e tratadores
├── providers/
│   └── QueryProvider.tsx          # Provider do TanStack React Query
├── types/                        # Tipos TypeScript e schemas Zod
│   ├── member.ts                 # Interfaces Member, FamilyGroup, Timeline, etc.
│   └── memberSchema.ts           # Schema Zod para validação de formulários
├── __tests__/                    # Testes unitários (Vitest)
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── security/
│   ├── setup.ts                  # Setup global dos testes
│   └── smoke.test.tsx            # Teste smoke de renderização
├── __e2e__/                      # Testes end-to-end (Playwright)
├── __integration__/              # Testes de integração
└── middleware.ts                 # Middleware Next.js para proteção de rotas
```

## Providers e Inicialização

### Fluxo de Providers (Root Layout)

O `src/app/layout.tsx` envolve toda a aplicação na seguinte hierarquia:

```tsx
<ErrorBoundary>
  <QueryProvider>
    <AuthProvider>{children}</AuthProvider>
  </QueryProvider>
</ErrorBoundary>
```

1. **ErrorBoundary** — Captura erros não tratados em componentes filhos e exibe UI de fallback.
2. **QueryProvider** — Configura o `QueryClient` do TanStack React Query com:
   - `staleTime`: 5 minutos
   - `gcTime`: 10 minutos
   - `retry`: 1 (queries) / 0 (mutations)
   - `refetchOnWindowFocus`: true
   - `refetchOnReconnect`: true
3. **AuthProvider** — Gerencia o estado de autenticação via Supabase Auth.

### Cliente Supabase (`src/lib/supabase.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr';
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
```

Utiliza `createBrowserClient` do `@supabase/ssr` para persistir a sessão em cookies, garantindo compatibilidade com o middleware de servidor (`createServerClient`).

## Middleware de Autenticação (`src/middleware.ts`)

O middleware do Next.js protege as rotas do dashboard e redireciona usuários já autenticados para longe das páginas de login/registro.

**Regras:**

- Rotas protegidas (`/dashboard/*`) sem sessão ativa → redireciona para `/login?redirect=<path>`
- Rotas de auth (`/login`, `/register`, `/forgot-password`, `/reset-password`) com sessão ativa → redireciona para `/dashboard`
- Assets estáticos (SVG, PNG, imagens) e `_next/*` são ignorados pelo matcher

**Matcher config:**

```typescript
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

## Fluxo de Autenticação e AuthProvider

O `AuthProvider` (`src/hooks/useAuth.tsx`) expõe as seguintes funções através do contexto:

| Função | Assinatura | Comportamento |
|---|---|---|
| `signIn` | `(email, password) => { error }` | Login com email/senha. Atualiza estado imediatamente sem esperar callback do Supabase |
| `signUp` | `(email, password, name) => { error }` | Cadastro com dados extras salvos em `user_metadata.name` |
| `signOut` | `() => void` | Limpa sessão e reseta estado local |
| `resetPassword` | `(email) => { error }` | Envia email de recuperação com redirect para `/reset-password` |
| `updatePassword` | `(newPassword) => { error }` | Atualiza a senha do usuário logado |

O hook `useAuth()` consome o contexto. Lança erro se usado fora de um `AuthProvider`.

## Hooks de Dados (Data Fetching)

### `useMembers` (`src/hooks/api/useMembers.ts`)

Hook stateful (sem React Query) para listar membros com suporte a:

- Busca textual com debounce de 400ms (`ilike 'name'`)
- Filtro por `status` (boolean | 'all')
- Filtro por `departmentId`
- Paginação (`page`, `pageSize` — padrão 50)

Retorna `{ members, loading, error, total, page, pageSize, refresh }`.

### `useMember` (`src/hooks/api/useMember.ts`)

Hook stateful para buscar um membro individual por ID, incluindo relações:
- `member_roles`
- `member_timeline`
- `family_members` com nested `family_groups(name)`

### `useFamilyGroups` (`src/hooks/api/useFamilyGroups.ts`)

Hook stateful para listar e criar grupos familiares. Retorna `{ groups, loading, error, refresh, createGroup }`.

### `useMembersQuery` (`src/hooks/api/useMembersQuery.ts`)

Conjunto de hooks com TanStack React Query:

| Hook | Descrição |
|---|---|
| `useMembers` | Listagem de membros com cache (chave `['members', filters]`) |
| `useCreateMember` | Criação de membro com invalidação da lista |
| `useUpdateMember` | Atualização com invalidação da lista e do item específico |
| `useDeleteMember` | Soft delete (`deleted_at`) com invalidação da lista |
| `useMember` | Busca individual com cache (chave `['member', id]`) |

## Sistema de Erros (`src/lib/errors.ts`)

Hierarquia de classes de erro customizadas:

| Classe | HTTP Status | Code | Uso |
|---|---|---|---|
| `AppError` | — | — | Classe base |
| `AuthenticationError` | 401 | `AUTH_ERROR` | Usuário não autenticado |
| `AuthorizationError` | 403 | `AUTHORIZATION_ERROR` | Sem permissão (RLS) |
| `ValidationError` | 400 | `VALIDATION_ERROR` | Dados inválidos |
| `NotFoundError` | 404 | `NOT_FOUND` | Recurso não encontrado |
| `DatabaseError` | 500 | `DATABASE_ERROR` | Erro genérico de banco |

Funções auxiliares:
- `handleSupabaseError(error)` — Mapeia erros do Supabase para as classes acima
- `getErrorMessage(error)` — Extrai mensagem legível de qualquer tipo de erro
- `logError(error, context?)` — Log em desenvolvimento com suporte futuro a Sentry/LogRocket

## Types e Schemas

### `src/types/member.ts`

Principais interfaces:

- **`Member`** — Membro da igreja com dados pessoais, endereço, datas de batismo/conversão, status. Relacionamentos opcionais: `member_roles`, `member_timeline`, `family_members`.
- **`FamilyGroup`** — Grupo familiar com líder.
- **`MemberTimeline`** — Evento da timeline ministerial (`role_change`, `department_change`, `status_change`, `observation`).
- **`MemberRole`** — Cargo/função do membro.
- **`FamilyMember`** — Associação membro ↔ grupo familiar.

### `src/types/memberSchema.ts`

Schema Zod para validação de formulários de membros:

- Validações: `name` (mín. 3 caracteres), `email` (formato válido), `gender` (enum), `marital_status` (enum)
- Tipos derivados: `MemberFormData`, `MemberDbData` (omite campos de UI como `family_group_id`, `role`, etc.)

## Componentes Compartilhados

### `components/ui/Badge.tsx`

Badge com variantes visuais: `primary`, `secondary`, `tertiary`, `error`, `outline`.

### `components/ui/Card.tsx`

Cartão com suporte a título, subtítulo e ação no cabeçalho. Usa classe `glass-card` para o efeito vidro fosco do tema.

### `components/ErrorBoundary.tsx`

Error boundary React com:
- Fallback padrão com mensagem amigável e botão de recarregar
- Suporte a fallback customizado via prop
- Exibição de detalhes em desenvolvimento
- Callback `onError` para logging externo

## Layout do Dashboard

O layout do dashboard (`src/app/(dashboard)/layout.tsx`) segue o seguinte fluxo:

1. **Verificação de autenticação** — Usa `useAuth()` e redireciona para `/login` se não houver sessão
2. **Loader** — Exibe um spinner enquanto `loading` é `true`
3. **Estrutura renderizada**:

```
┌─────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │              │  │      TopBar           │  │
│  │   Sidebar    │  │ (busca, notificações, │  │
│  │   (fixa)     │  │  ajuda, conta)        │  │
│  │              │  ├──────────────────────┤  │
│  │ - Dashboard  │  │                      │  │
│  │ - Membros    │  │    Children           │  │
│  │ - Financeiro │  │    (conteúdo da       │  │
│  │ - Eventos    │  │     página atual)     │  │
│  │ - Ministérios│  │                      │  │
│  │ - Relatórios │  │                      │  │
│  │ - Config.    │  │                      │  │
│  │              │  │                      │  │
│  │ [Novo Reg.]  │  │                      │  │
│  │ [Sair]       │  │                      │  │
│  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────┘
```

- **Sidebar**: 72px de largura, fixa à esquerda, contém navegação e ações (Novo Registro, Sair)
- **TopBar**: 80px de altura, fixa no topo, com campo de busca e ícones de ação
- **Conteúdo**: Margin lateral de 40px, envolvido em `ErrorBoundary`

## Convenções de Código

- **Linting**: ESLint via `next lint` (configuração padrão Next.js + TypeScript)
- **TypeScript**: Strict mode ativado, path alias `@/` mapeado para `src/`
- **Estilização**: Tailwind CSS com variáveis CSS personalizadas para o tema Dark Glassmorphism
- **Componentes**: Todos os componentes que usam hooks do cliente devem ter a diretiva `'use client'`
- **Arquitetura de pastas**: Funcionalidades organizadas por domínio em `app/`, lógica reutilizável em `hooks/` e `lib/`

## Testes

### Testes Unitários (Vitest)

```bash
# Executar todos os testes
npm test

# Modo UI interativo
npm run test:ui

# Com cobertura
npm run test:coverage
```

**Configuração** (`vitest.config.ts`):

- Ambiente: `jsdom`
- Setup: `src/__tests__/setup.ts` (mock das variáveis de ambiente Supabase, cleanup automático após cada teste)
- Aliases: `@` → `src/` (compatível com `tsconfig.json`)
- Cobertura: provider V8, relatórios texto/JSON/HTML
- Arquivos excluídos da cobertura: `node_modules/`, `src/__tests__/`, `*.d.ts`, `*.config.*`, `mockData`, `src/types/`

**Estrutura dos testes existentes:**

```
src/__tests__/
├── components/ErrorBoundary.test.tsx
├── hooks/useMembersQuery.test.ts
├── lib/errors.test.ts
├── security/auth.test.ts
├── security/middleware.test.ts
├── security/rls.test.ts
├── setup.ts
└── smoke.test.tsx
```

### Testes E2E (Playwright)

```bash
# Executar todos os testes E2E
npm run test:e2e

# Playwright UI Mode
npm run test:e2e:ui
```

**Configuração** (`playwright.config.ts`):

- Testes em `src/__e2e__/`
- Navegador: Chromium (Desktop Chrome)
- Base URL: `http://localhost:3000`
- Servidor web automático: `npm run dev`
- Retry: 2 em CI, 0 local
- Trace: apenas no primeiro retry

## Próximos Passos

- [Guia de Primeiros Passos](GETTING-STARTED.md)
- [Arquitetura do Sistema](ARCHITECTURE.md)
- [Configuração e Variáveis de Ambiente](CONFIGURATION.md)
