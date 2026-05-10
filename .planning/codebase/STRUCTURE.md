# Estrutura do Projeto

**Última atualização:** 2026-05-10

## Visão Geral da Estrutura

```
D:\PRD-SILTEC\
├── .agent/                    # Configurações Agent (duplicado)
├── .claude/                   # Configurações OpenClaude
│   ├── commands/gsd/          # Comandos GSD
│   ├── agents/                # Agentes GSD
│   ├── get-shit-done/         # Framework GSD v1.41.1
│   ├── hooks/                 # Hooks do projeto
│   ├── package.json
│   └── settings.json
├── .opencode/                 # Configurações OpenCode (duplicado)
├── .planning/                 # Planejamento GSD
│   ├── codebase/              # Mapeamento do código (este doc)
│   ├── milestones/            # Milestones arquivados
│   ├── phases/                # Fases do projeto
│   ├── ref/                   # Referências
│   ├── tmp/                   # Temporários
│   ├── config.json            # Configuração do workflow
│   ├── PROJECT.md             # Visão do projeto
│   ├── REQUIREMENTS.md        # Requisitos
│   ├── ROADMAP.md             # Roadmap de fases
│   └── STATE.md               # Estado atual
├── .vscode/                   # Configurações VS Code
├── node_modules/              # Dependências npm
├── public/                    # Assets estáticos
├── src/                       # Código-fonte (detalhado abaixo)
├── supabase/                  # Configuração Supabase
│   ├── config.toml            # Config do Supabase CLI
│   └── migrations/            # 15 migrations SQL
├── .eslintrc.json             # Config ESLint
├── .gitignore                 # Arquivos ignorados
├── next-env.d.ts              # Types do Next.js
├── next.config.ts             # Configuração Next.js
├── package.json               # Dependências
├── package-lock.json          # Lock de dependências
├── postcss.config.mjs         # Config PostCSS
├── README.md                  # Documentação
├── tailwind.config.ts         # Config Tailwind
└── tsconfig.json              # Config TypeScript
```

## Estrutura do Diretório `src/`

```
src/
├── app/                       # Next.js App Router
│   ├── (auth)/                # Route group: Autenticação
│   │   ├── forgot-password/
│   │   │   └── page.tsx       # Recuperação de senha
│   │   ├── login/
│   │   │   └── page.tsx       # Login
│   │   ├── register/
│   │   │   └── page.tsx       # Registro
│   │   └── layout.tsx         # Layout de auth
│   ├── (dashboard)/           # Route group: Dashboard protegido
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Dashboard principal
│   │   ├── membros/           # Módulo de membros
│   │   │   ├── novo/
│   │   │   │   └── page.tsx   # Criar membro
│   │   │   ├── [id]/
│   │   │   │   ├── editar/
│   │   │   │   │   └── page.tsx # Editar membro
│   │   │   │   └── page.tsx   # Detalhes do membro
│   │   │   └── page.tsx       # Lista de membros
│   │   └── layout.tsx         # Layout do dashboard
│   ├── debug-members/
│   │   └── page.tsx           # Debug (desenvolvimento)
│   ├── setup-test-user/
│   │   └── page.tsx           # Setup teste (desenvolvimento)
│   ├── test-auth/             # Teste auth (desenvolvimento)
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/                # Componentes React
│   ├── layout/
│   │   ├── Sidebar.tsx        # Sidebar do dashboard
│   │   └── TopBar.tsx         # Barra superior
│   ├── ui/                    # Componentes UI base
│   │   ├── Badge.tsx
│   │   └── Card.tsx
│   └── DashboardProvider.tsx  # Context provider
├── hooks/                     # React hooks customizados
│   └── api/                   # Hooks para API
├── lib/                       # Bibliotecas e utilitários
│   └── supabase.ts            # Cliente Supabase
├── types/                     # Definições TypeScript
│   ├── member.ts              # Tipos de membros
│   └── memberSchema.ts        # Schemas Zod
└── middleware.ts              # Middleware de autenticação
```

## Arquivos-Chave

### Configuração

| Arquivo | Propósito |
|---------|-----------|
| `next.config.ts` | Configuração do Next.js (imagens Supabase) |
| `tailwind.config.ts` | Configuração do Tailwind CSS |
| `tsconfig.json` | Configuração do TypeScript |
| `.eslintrc.json` | Regras de linting |
| `postcss.config.mjs` | Processamento CSS |

### Supabase

| Arquivo | Propósito |
|---------|-----------|
| `supabase/config.toml` | Config do Supabase CLI |
| `supabase/migrations/*.sql` | 15 migrations do banco |

### Código-Fonte

| Arquivo | Propósito | Linhas |
|---------|-----------|--------|
| `src/middleware.ts` | Proteção de rotas e auth | 60 |
| `src/lib/supabase.ts` | Cliente Supabase browser | 15 |
| `src/types/member.ts` | Tipos de membros | 74 |
| `src/app/layout.tsx` | Root layout | ~50 |
| `src/components/DashboardProvider.tsx` | Context provider | ~100 |

## Convenções de Nomenclatura

### Arquivos

- **Componentes React:** PascalCase (`Sidebar.tsx`, `TopBar.tsx`)
- **Páginas Next.js:** lowercase (`page.tsx`, `layout.tsx`)
- **Utilitários:** camelCase (`supabase.ts`)
- **Tipos:** camelCase com sufixo (`member.ts`, `memberSchema.ts`)

### Diretórios

- **Route groups:** `(nome)` - não afetam URL
- **Rotas dinâmicas:** `[id]` - parâmetro na URL
- **Componentes:** lowercase (`ui/`, `layout/`)

### Código

- **Componentes:** PascalCase (`DashboardProvider`)
- **Funções:** camelCase (`createBrowserClient`)
- **Constantes:** camelCase (`supabaseUrl`)
- **Tipos/Interfaces:** PascalCase (`Member`, `GenderType`)

## Organização por Módulo

### Módulo de Membros

```
src/app/(dashboard)/membros/
├── page.tsx              # Lista com tabela
├── novo/page.tsx         # Formulário de criação
└── [id]/
    ├── page.tsx          # Visualização detalhada
    └── editar/page.tsx   # Formulário de edição
```

**Funcionalidades:**
- Listagem com filtros
- CRUD completo
- Visualização de timeline
- Gestão de família
- Controle de roles

## Padrões de Importação

### Aliases TypeScript

```typescript
// Configurado em tsconfig.json
"@/*" → "src/*"
```

### Ordem de Imports

1. Bibliotecas externas (React, Next.js)
2. Bibliotecas internas (@supabase)
3. Componentes locais
4. Tipos
5. Estilos

## Estrutura de Componentes UI

**Shadcn/UI Pattern:**
- Componentes em `src/components/ui/`
- Cada componente em arquivo separado
- Uso de `class-variance-authority` para variantes
- Totalmente customizáveis

## Migrations do Supabase

**15 arquivos em ordem cronológica:**

```
supabase/migrations/
├── 002_profiles_trigger_setup.sql
├── 20260508000001_create_members.sql
├── 20260508000002_create_family_groups.sql
├── 20260508000003_create_family_members.sql
├── 20260508000004_create_role_enums.sql
├── 20260508000005_create_member_timeline.sql
├── 20260508000006_create_member_roles.sql
├── 20260508000007_create_member_attendances.sql
├── 20260508000008_create_events.sql
├── 20260508000009_enable_rls_helper_function.sql
├── 20260508000010_rls_members_policies.sql
├── 20260508000011_rls_related_tables.sql
├── 20260508000012_audit_triggers.sql
├── 20260508000013_fix_audit_triggers.sql
└── 20260508000014_fix_get_current_church_id.sql
```

## Páginas de Desenvolvimento

**Temporárias (remover em produção):**
- `/debug-members` - Debug de membros
- `/setup-test-user` - Setup de usuário teste
- `/test-auth` - Teste de autenticação

## Estatísticas

- **Total de arquivos TypeScript:** 28
- **Componentes React:** ~15
- **Páginas:** 10+
- **Migrations SQL:** 15
- **Linhas de código (estimado):** ~2000

## Próximas Adições Planejadas

### Módulo Financeiro (v0.3)
```
src/app/(dashboard)/financeiro/
├── page.tsx              # Dashboard financeiro
├── entradas/             # Dízimos e ofertas
├── saidas/               # Despesas
└── relatorios/           # Relatórios
```

### API REST (v0.3)
```
src/app/api/
├── members/
├── financial/
└── events/
```

## Observações

- Estrutura segue padrões do Next.js 15 App Router
- Route groups mantêm URLs limpas
- Separação clara entre auth e dashboard
- Componentes reutilizáveis em `components/`
- Tipos centralizados em `types/`
- Migrations versionadas e ordenadas
