<!-- generated-by: gsd-doc-writer -->
# CONFIGURATION.md — SGI (Sistema de Gestão Integrada)

## Visão Geral

Este documento detalha todas as configurações do **SGI — Sistema de Gestão Integrada para Igrejas e Ministérios**. O projeto é construído com **Next.js 15.1** + **Supabase** (PostgreSQL, Auth, Storage, RLS) e segue uma arquitetura **multi-tenant** onde cada igreja (church_id) possui seus dados isolados via políticas RLS.

---

## Variáveis de Ambiente

O projeto utiliza duas variáveis de ambiente obrigatórias para conectar ao Supabase. Sem elas, a aplicação **falha ao iniciar** com o erro:

> `Configuração do Supabase ausente. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.`

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | — | URL do projeto Supabase (ex: `https://xxxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | — | Chave anônima (pública) do Supabase para o cliente browser |
| `NODE_ENV` | Não | `development` | Controla exibição de detalhes de erros em desenvolvimento |
| `CI` | Não | — | Quando presente, ativa retries em testes Playwright e reduz workers |

**Onde são consumidas:**
- `src/lib/supabase.ts` — cliente browser (`createBrowserClient`)
- `src/middleware.ts` — cliente server-side (`createServerClient`)
- `src/__tests__/setup.ts` — mocks para testes unitários com valores `http://localhost:54321`
- `src/__tests__/security/auth.test.ts` e `rls.test.ts` — usam fallback para `http://localhost:54321`
- `src/lib/errors.ts` e `src/components/ErrorBoundary.tsx` — usam `NODE_ENV` para detalhamento de erros
- `playwright.config.ts` — usa `CI` para configurar retries e workers

<!-- VERIFY: Substitua os valores de NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY pelos do seu projeto Supabase em produção. -->

**Arquivo de ambiente:**
- `.env` — usado em desenvolvimento (contém valores reais, **não versionar**)
- Não existe `.env.example` — use o `.env` como referência para criar o arquivo em novos ambientes

---

## Configuração do Supabase

### Projeto Supabase

O SGI depende de um projeto Supabase ativo. As configurações abaixo devem ser aplicadas no Dashboard do Supabase ou via CLI.

<!-- VERIFY: O projeto Supabase vinculado está em https://dgfstgnkpbqsogdaitzp.supabase.co. Crie um novo projeto no painel do Supabase e substitua as credenciais no .env. -->

### Migrations (Banco de Dados)

Todas as migrations estão em `supabase/migrations/` e devem ser executadas na ordem abaixo via `supabase db push`:

| # | Arquivo | Descrição |
|---|---|---|
| 1 | `002_profiles_trigger_setup.sql` | Cria tabela `profiles`, trigger de auto-criação ao registrar usuário, e políticas RLS |
| 2 | `20260508000001_create_members.sql` | Cria tabela `members` com enums (gender, marital_status, member_status) |
| 3 | `20260508000002_create_family_groups.sql` | Cria tabela `family_groups` |
| 4 | `20260508000003_create_family_members.sql` | Cria enum `family_relationship` e tabela `family_members` (N:N) |
| 5 | `20260508000004_create_role_enums.sql` | Cria enums `app_role`, `timeline_event_type`, `attendance_status` |
| 6 | `20260508000005_create_member_timeline.sql` | Cria tabela `member_timeline` para linha do tempo ministerial |
| 7 | `20260508000006_create_member_roles.sql` | Cria tabela `member_roles` para histórico de cargos |
| 8 | `20260508000007_create_member_attendances.sql` | Cria tabela `member_attendances` para presença |
| 9 | `20260508000008_create_events.sql` | Cria tabela `events` para eventos e agenda |
| 10 | `20260508000009_enable_rls_helper_function.sql` | Habilita RLS, cria helper `get_current_church_id()` |
| 11 | `20260508000010_rls_members_policies.sql` | Políticas RLS para tabela `members` |
| 12 | `20260508000011_rls_related_tables.sql` | Políticas RLS para tabelas relacionadas (family_groups, events, etc.) |
| 13 | `20260508000012_audit_triggers.sql` | Triggers de auditoria (`updated_at`, `created_by`, `church_id`) |
| 14 | `20260508000013_fix_audit_triggers.sql` | Correção para colunas ausentes nos triggers de auditoria |
| 15 | `20260508000014_fix_get_current_church_id.sql` | Correção do helper `get_current_church_id` para ler de `user_metadata` |
| 16 | `seed.sql` | Dados de seed para desenvolvimento (`supabase db push --include-seed`) |
| 17 | `supabase-setup.sql` | Script completo de setup (alternativo ao 002_profiles_trigger_setup) |

### Multi-tenancy via RLS

O isolamento multi-tenant é implementado via **Row Level Security (RLS)** do PostgreSQL. O fluxo é:

1. Cada usuário autenticado possui um `church_id` armazenado em `raw_user_meta_data` no JWT
2. A função `get_current_church_id()` extrai o `church_id` do JWT ou das `app_settings`
3. Todas as políticas RLS usam `church_id = get_current_church_id()` para filtrar registros
4. Índices compostos com `church_id` como primeira coluna otimizam as consultas multi-tenant

### Autenticação

- **Provedor:** Supabase Auth (email/password)
- **Sessão:** Persistida via cookies (`@supabase/ssr`) — compatível com SSR do Next.js
- **Trigger:** `on_auth_user_created` cria automaticamente um registro na tabela `profiles` ao registrar novo usuário
- **RBAC:** 5 níveis de acesso disponíveis via `app_role` enum: `member`, `leader`, `treasurer`, `admin`, `super_admin`

---

## Configuração de Design (Tailwind CSS)

### Arquivo: `tailwind.config.ts`

O tema é **dark por padrão** com `darkMode: "class"` e utiliza **CSS custom properties** (variáveis HSL) definidas em `src/app/globals.css`.

### Cores (Sistema Material 3 adaptado)

Todas as cores usam o formato HSL (Hue, Saturation, Lightness) e são definidas como variáveis CSS no `:root`:

```css
--background: 222 47% 5%;        /* Azul escuro profundo (#0B1326) */
--foreground: 220 20% 92%;       /* Texto claro (#DAE2FD) */
--primary: 262 83% 75%;          /* Roxo claro (#D0BCFF) */
--secondary: 221 83% 82%;        /* Azul claro (#B9CBFC) */
--tertiary: 269 76% 80%;         /* Lilás (#DBC1FF) */
--destructive: 5 85% 64%;        /* Vermelho (#FFB4AB) */
--surface-container: 222 41% 12%; /* Container padrão */
```

### Tipografia

- **Fonte principal:** Manrope (Google Fonts) — importada via `@import url(...)` em `globals.css`
- **Variável CSS:** `--font-manrope: 'Manrope', system-ui, sans-serif`
- **Escalas tipográficas:**

| Classe | Tamanho | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `.font-h1` | 32px | 700 | 1.2 | -0.02em |
| `.font-h2` | 24px | 600 | 1.3 | -0.01em |
| `.font-h3` | 20px | 600 | 1.4 | 0 |
| `.font-body-lg` | 16px | 400 | 1.6 | 0 |
| `.font-body-md` | 14px | 400 | 1.5 | 0 |
| `.font-label-sm` | 12px | 600 (uppercase) | 1 | 0.05em |

### Glassmorphism

Utilitários CSS personalizados em `globals.css`:

```css
.glass, .glass-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-sidebar {
  background: rgba(23, 31, 51, 0.7);
  backdrop-filter: blur(24px);
}

.glass-topbar {
  background: rgba(11, 19, 38, 0.4);
  backdrop-filter: blur(12px);
}
```

### Ícones

O projeto utiliza **Material Symbols** (ícones por glyph name) com a classe utilitária `.material-symbols-outlined`, configurada com `font-variation-settings` para controle de peso e preenchimento.

### Espaçamento

| Token | Valor |
|---|---|
| `margin` | 40px |
| `gutter` | 24px |
| `unit` | 4px (base) |
| `xs / sm / md / lg / xl` | 4px / 8px / 16px / 24px / 32px |

### Bordas

| Token | Valor |
|---|---|
| `border-radius` padrão | 0.25rem (4px) |
| `lg` | 0.5rem (8px) |
| `xl` | 0.75rem (12px) |
| `full` | 9999px (círculo/pilula) |

---

## Configuração do Next.js

### Arquivo: `next.config.ts`

```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};
```

Permite carregar imagens armazenadas no Supabase Storage. Para adicionar outros domínios (CDN, S3), inclua novos objetos no array `remotePatterns`.

### Middleware: `src/middleware.ts`

Protege rotas autenticadas e redireciona usuários logados para o dashboard:

- **Matcher:** todas as rotas exceto `_next/static`, `_next/image`, `favicon.ico` e arquivos estáticos
- **Rotas públicas:** `/login`, `/register`, `/forgot-password`, `/reset-password`
- **Rotas protegidas:** `/dashboard` e subrotas
- **Redirect após login:** `?redirect={pathname}`

---

## TypeScript

### Arquivo: `tsconfig.json`

| Configuração | Valor | Descrição |
|---|---|---|
| `target` | `ES2017` | Compilação para ES2017 |
| `module` | `esnext` | Módulos ES nativos |
| `moduleResolution` | `bundler` | Resolução compatível com bundlers (Next.js) |
| `strict` | `true` | Modo estrito ativado |
| `jsx` | `preserve` | JSX preservado (Next.js processa) |
| `paths` | `@/*` → `./src/*` | Alias `@/` para imports absolutos |
| `noEmit` | `true` | Sem geração de arquivos (Next.js compila) |

---

## Scripts (package.json)

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento Next.js |
| `npm run build` | Compila projeto para produção |
| `npm start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint via Next.js |
| `npm test` | Executa testes unitários (Vitest) |
| `npm run test:ui` | Executa Vitest com interface gráfica |
| `npm run test:coverage` | Executa testes com relatório de cobertura (V8) |
| `npm run test:e2e` | Executa testes E2E (Playwright) |
| `npm run test:e2e:ui` | Executa Playwright com interface gráfica |

### Dependências principais

- **Runtime:** `next`, `react`, `react-dom`
- **Estado/Server:** `@supabase/supabase-js`, `@supabase/ssr`, `@tanstack/react-query`
- **UI/Tabelas:** `@tanstack/react-table`, `recharts`, `lucide-react`
- **Formulários:** `react-hook-form`, `@hookform/resolvers`, `zod`
- **Utilitários:** `clsx`, `tailwind-merge`, `class-variance-authority`, `date-fns`

---

## Configuração de Testes

### Vitest (`vitest.config.ts`)

- **Framework:** Vitest 4.1.5
- **Plugin:** `@vitejs/plugin-react`
- **Ambiente:** `jsdom` (simula DOM no Node.js)
- **Globals:** `true` (describe, it, expect disponíveis globalmente)
- **Setup:** `src/__tests__/setup.ts` (importa `@testing-library/jest-dom`, faz cleanup automático, mocka env vars do Supabase)
- **Cobertura:** Provider V8, relatórios em text/json/html
- **Alias:** `@` → `./src` (mesmo do TypeScript)

### Playwright (`playwright.config.ts`)

- **Framework:** Playwright 1.59.1
- **Diretório:** `src/__e2e__/`
- **Navegador:** Chromium (Desktop Chrome)
- **Base URL:** `http://localhost:3000`
- **CI:** retries=2, worker=1 quando `CI` está definido
- **WebServer:** executa `npm run dev` automaticamente

### PostCSS (`postcss.config.mjs`)

```js
plugins: {
  tailwindcss: {},
  autoprefixer: {},
}
```

---

## Configuração por Ambiente

| Ambiente | Arquivo .env | Comando | Banco |
|---|---|---|---|
| Desenvolvimento | `.env` local | `npm run dev` (porta 3000) | Supabase local ou remoto |
| Testes unitários | Mockado em `setup.ts` | `npm test` (vitest) | — |
| Testes E2E | `.env` local | `npm run test:e2e` | Supabase local ou remoto |
| Produção | Variáveis na plataforma | `npm run build && npm start` | Supabase remoto |

<!-- VERIFY: Em produção (Vercel), configure as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no painel do projeto em vercel.com. -->
