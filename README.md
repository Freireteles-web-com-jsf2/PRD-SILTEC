<!-- generated-by: gsd-doc-writer -->
# SGI Master — Siltec-Solutions

**Sistema de Gestão Integrada para Igrejas e Ministérios brasileiros.**

Plataforma SaaS multi-tenant moderna para administração eclesiástica, com
cadastro de membros, gestão financeira, agenda de eventos, ministérios,
escalas de voluntários e dashboard com KPIs estratégicos.

---

## Sobre

O **SGI Master** é uma aplicação web full-stack desenvolvida pela
Siltec-Solutions para atender igrejas e comunidades religiosas que precisam
centralizar sua administração em uma plataforma segura, escalável e de fácil
uso. A aplicação adota arquitetura multi-tenant com isolamento por `church_id`
via políticas RLS (Row-Level Security) do PostgreSQL, garantindo que cada
igreja visualize apenas seus próprios dados.

Atualmente na **v2.0.0**, o sistema conta com módulo completo de gestão de
membros (cadastro, perfil com timeline ministerial, grupos familiares, cargos)
e estrutura de dados preparada para os demais módulos.

## Funcionalidades Principais

| Módulo | Status | Descrição |
|--------|--------|-----------|
| **Dashboard** | ✅ Implementado | KPIs estratégicos (total de membros, crescimento, novos convertidos, saldo financeiro), calendário mensal, visão geral financeira (dízimos vs despesas), atividades recentes e próximos cultos |
| **Membros** | ✅ Completo | Cadastro completo (dados pessoais, endereço, foto, dados ministeriais), listagem com busca textual, filtro por status e paginação (50 itens/página), perfil individual com timeline ministerial, cargos ativos, presença em eventos e vínculo familiar. Soft delete com `deleted_at` |
| **Grupos Familiares** | ✅ Implementado | Criação e vínculo de membros a grupos familiares durante o cadastro |
| **Gestão Financeira** | 🚧 Estrutura pronta | Tabelas e rota de navegação preparadas (sidebar) |
| **Eventos e Agenda** | 🚧 Tabela criada | Estrutura de dados com suporte a agendamento, local, capacidade e status |
| **Ministérios** | 🚧 Rota na sidebar | Estrutura de navegação preparada |
| **Relatórios** | 🚧 Rota na sidebar | Estrutura de navegação preparada |
| **Autenticação** | ✅ Completo | Login, cadastro (email + senha + nome), recuperação de senha, proteção de rotas via middleware, sessão persistida em cookies |
| **Controle de Acesso (RBAC)** | ✅ Implementado | 5 níveis hierárquicos: `member`, `leader`, `treasurer`, `admin`, `super_admin`. Aplicado via `member_roles` com suporte a cargos ativos por período |
| **Multi-tenancy** | ✅ Ativo | Isolamento total por `church_id` com RLS policies em todas as tabelas. Triggers automáticos para preenchimento de `church_id` e colunas de auditoria |

## Stack Tecnológico

| Categoria | Tecnologia |
|-----------|------------|
| **Framework** | Next.js 15.1 (App Router) |
| **Linguagem** | TypeScript 5.7 |
| **UI / Componentes** | React 19 |
| **Estilização** | Tailwind CSS 3.4 — tema escuro Dark Glassmorphism com design system baseado em CSS custom properties (HSL) |
| **Tipografia** | Manrope (Google Fonts) |
| **Ícones** | Material Symbols Outlined + Lucide React |
| **Formulários** | React Hook Form + Zod (validação) |
| **Tabelas** | TanStack Table + TanStack React Query (cache e estado servidor) |
| **Gráficos** | Recharts |
| **Backend** | Supabase (PostgreSQL 17, Auth, Storage, RLS) |
| **ORM / Cliente DB** | Supabase JS Client + SSR |
| **Testes unitários** | Vitest + Testing Library |
| **Testes E2E** | Playwright |
| **Lint** | ESLint 9 (config Next.js) |
| **Deploy** | Vercel |

### Design System

O SGI Master adota um tema **Dark Glassmorphism** com:

- Paleta de 5 cores (primary, secondary, tertiary, error, surface) com variações
  container, fixed, dim, bright
- Efeitos glass (backdrop-filter: blur) em cards, sidebar e topbar
- Sistema de tipografia com 6 estilos: `h1`(32px), `h2`(24px), `h3`(20px),
  `body-lg`(16px), `body-md`(14px), `label-sm`(12px)
- Espaçamento por tokens (xs=4px, sm=8px, md=16px, lg=24px, xl=32px)

## Estrutura de Navegação

O sistema utiliza navegação lateral fixa (sidebar à esquerda, 288px) com as
seguintes áreas:

```
┌──────────────┬──────────────────────────────────────────────┐
│   SGI Master │  🔍 Pesquisar...              🔔 ❓ 👤       │
│              │                                              │
│  📊 Dashboard│                                              │
│  👥 Membros  │  ┌─── Área de Conteúdo ──────────────────┐  │
│  💰 Financeiro│  │                                          │  │
│  📅 Eventos  │  │  (Renderizada por cada rota)            │  │
│  ⛪ Ministérios│ │                                          │  │
│  📈 Relatórios│  └──────────────────────────────────────────┘  │
│  ⚙ Configurações│                                           │
│              │                                              │
│  [Novo Reg.] │                                              │
│  🚪 Sair     │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Rotas da Aplicação

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/login` | Pública | Login com email e senha |
| `/register` | Pública | Cadastro de nova conta |
| `/forgot-password` | Pública | Recuperação de senha |
| `/reset-password` | Pública | Definição de nova senha |
| `/dashboard` | Privada | KPIs, gráficos financeiros, calendário, atividades recentes |
| `/membros` | Privada | Listagem de membros com busca e filtros |
| `/membros/novo` | Privada | Formulário de cadastro de membro |
| `/membros/[id]` | Privada | Perfil completo do membro com timeline |
| `/membros/[id]/editar` | Privada | Edição de dados do membro |

### Middleware de Autenticação

O arquivo `src/middleware.ts` protege automaticamente as rotas `/dashboard*`
redirecionando usuários não autenticados para `/login`, e redireciona usuários
logados que acessam rotas de auth (`/login`, `/register`, `/forgot-password`,
`/reset-password`) para o dashboard.

## Getting Started

### Pré-requisitos

- Node.js >= 18.17 (recomendado 20.x LTS)
- npm (ou yarn/pnpm)
- Conta no [Supabase](https://supabase.com) (projeto próprio)

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd PRD-SILTEC

# Instalar dependências
npm install

# Configurar variáveis de ambiente (veja seção abaixo)
# Edite o arquivo .env.local com suas credenciais do Supabase

# Executar em modo desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) — você será
redirecionado para a página de login.

### Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (Next.js) |
| `npm run build` | Compila a aplicação para produção |
| `npm start` | Inicia o servidor de produção (após build) |
| `npm run lint` | Executa o linter (ESLint + Next.js config) |
| `npm test` | Executa testes unitários (Vitest) |
| `npm run test:ui` | Executa testes com interface gráfica Vitest |
| `npm run test:coverage` | Executa testes com relatório de cobertura |
| `npm run test:e2e` | Executa testes E2E (Playwright) headless |
| `npm run test:e2e:ui` | Executa testes E2E com interface Playwright |

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

Ambas as variáveis são **obrigatórias** — a aplicação lança um erro na
inicialização se estiverem ausentes (validação em `src/lib/supabase.ts`).

> ⚠️ A chave `anon key` é pública por definição (cliente-side). A segurança
> real do banco é garantida pelas políticas RLS do PostgreSQL, não pelo
> segredo da chave.

### Supabase Local (Opcional)

O projeto inclui configuração para desenvolvimento local com Supabase CLI
(`supabase/config.toml`). Para usar:

```bash
# Iniciar Supabase local
npx supabase start

# Aplicar migrations
npx supabase db push
```

O Supabase Studio local fica disponível em `http://127.0.0.1:54323`.

## Estrutura do Banco de Dados

O schema utiliza PostgreSQL 17 com as seguintes tabelas principais (14
migrations aplicadas):

```
members              → Cadastro de membros (soft delete, church_id, RLS)
family_groups        → Grupos familiares
family_members       → Vínculo membro ↔ grupo familiar
member_roles         → Cargos/RBAC (member, leader, treasurer, admin, super_admin)
member_timeline      → Timeline ministerial (role_change, department_change, status_change, observation)
member_attendances   → Presença em eventos (present, absent, justified)
events               → Eventos eclesiásticos (cultos, reuniões, celebrações)
```

### Multi-tenancy

Todas as tabelas possuem coluna `church_id` com índice dedicado. As políticas
RLS (Row-Level Security) garantem que usuários autenticados vejam apenas
registros de sua própria igreja, utilizando a função `get_current_church_id()`.

Triggers automáticos preenchem `church_id`, `created_by`, `updated_by` e
`updated_at` em todas as operações INSERT/UPDATE.

## Estrutura do Projeto

```
PRD-SILTEC/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Rotas públicas de autenticação
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/         # Rotas privadas do dashboard
│   │   │   ├── dashboard/
│   │   │   └── membros/         # CRUD completo de membros
│   │   ├── globals.css          # Design system (Dark Glassmorphism)
│   │   ├── layout.tsx           # Root layout (AuthProvider, QueryProvider)
│   │   └── page.tsx             # Root → redirect /login
│   ├── components/
│   │   ├── layout/              # Sidebar, TopBar
│   │   ├── ui/                  # Badge, Card
│   │   ├── DashboardProvider.tsx
│   │   └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── api/                 # useMembers, useMember, useFamilyGroups, useMembersQuery
│   │   └── useAuth.tsx          # Context de autenticação (signIn, signUp, signOut, resetPassword, updatePassword)
│   ├── lib/
│   │   ├── supabase.ts          # Cliente Supabase browser
│   │   └── errors.ts            # Classes de erro customizadas (AppError, AuthenticationError, etc.)
│   ├── providers/
│   │   └── QueryProvider.tsx     # TanStack React Query provider
│   ├── types/
│   │   ├── member.ts            # Interfaces TypeScript (Member, FamilyGroup, MemberTimeline, etc.)
│   │   └── memberSchema.ts      # Schema Zod para formulário de membro
│   └── middleware.ts            # Proteção de rotas (Supabase SSR)
├── supabase/
│   ├── migrations/              # 14 migrations SQL
│   ├── seed.sql                 # Dados de seed
│   ├── config.toml              # Configuração Supabase CLI
│   └── supabase-setup.sql
├── __tests__/                   # Testes unitários (Vitest)
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── security/
├── playwright.config.ts         # Configuração E2E
├── vitest.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Licença

Este é um projeto privado da Siltec-Solutions. Todos os direitos reservados.

---

**Siltec-Solutions** — Gestão ministerial simplificada.
