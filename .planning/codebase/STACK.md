# Stack Tecnológico

**Última atualização:** 2026-05-10

## Linguagens

| Linguagem | Versão | Uso | % do Código |
|-----------|--------|-----|-------------|
| TypeScript | 5.7.0 | Frontend e tipos | 95% |
| SQL | PostgreSQL 15+ | Migrations e schemas | 5% |

## Framework Principal

**Next.js 15.1.0**
- App Router (não Pages Router)
- React Server Components
- Server Actions
- Middleware para autenticação
- TypeScript nativo

## Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | 19.0.0 | UI Library |
| Tailwind CSS | 3.4.17 | Estilização |
| Shadcn/UI | - | Componentes UI |
| Lucide React | 0.469.0 | Ícones |
| React Hook Form | 7.54.0 | Formulários |
| Zod | 3.24.0 | Validação de schemas |
| TanStack Table | 8.21.3 | Tabelas de dados |
| Recharts | 2.15.0 | Gráficos e dashboards |
| date-fns | 4.1.0 | Manipulação de datas |

## Backend / BaaS

**Supabase**
- PostgreSQL como banco de dados
- Auth (JWT, sessões via cookies)
- Row Level Security (RLS)
- Storage para arquivos
- Realtime (subscriptions)

| Pacote | Versão | Uso |
|--------|--------|-----|
| @supabase/supabase-js | 2.47.0 | Cliente JavaScript |
| @supabase/ssr | 0.5.2 | SSR com Next.js |

## Utilitários

| Pacote | Propósito |
|--------|-----------|
| clsx | Concatenação de classes CSS |
| tailwind-merge | Merge de classes Tailwind |
| class-variance-authority | Variantes de componentes |

## Ferramentas de Desenvolvimento

| Ferramenta | Versão | Propósito |
|------------|--------|-----------|
| ESLint | 9.17.0 | Linting |
| PostCSS | 8.4.49 | Processamento CSS |
| Autoprefixer | 10.4.20 | Prefixos CSS |

## Deploy e Infraestrutura

| Serviço | Propósito |
|---------|-----------|
| Vercel | Hospedagem e deploy |
| Supabase Cloud | Backend as a Service |

## Banco de Dados

**PostgreSQL 15+ (via Supabase)**

### Migrations Aplicadas (15 arquivos)

1. `002_profiles_trigger_setup.sql` - Setup inicial de profiles
2. `20260508000001_create_members.sql` - Tabela de membros
3. `20260508000002_create_family_groups.sql` - Grupos familiares
4. `20260508000003_create_family_members.sql` - Relacionamento família-membros
5. `20260508000004_create_role_enums.sql` - Enums de roles
6. `20260508000005_create_member_timeline.sql` - Timeline de eventos
7. `20260508000006_create_member_roles.sql` - Roles dos membros
8. `20260508000007_create_member_attendances.sql` - Controle de presença
9. `20260508000008_create_events.sql` - Eventos
10. `20260508000009_enable_rls_helper_function.sql` - Função helper RLS
11. `20260508000010_rls_members_policies.sql` - Políticas RLS membros
12. `20260508000011_rls_related_tables.sql` - Políticas RLS tabelas relacionadas
13. `20260508000012_audit_triggers.sql` - Triggers de auditoria
14. `20260508000013_fix_audit_triggers.sql` - Correção triggers
15. `20260508000014_fix_get_current_church_id.sql` - Correção church_id

### Schemas Principais

- `members` - Cadastro de membros
- `family_groups` - Grupos familiares
- `family_members` - Relacionamento N:N
- `member_timeline` - Histórico de eventos
- `member_roles` - Cargos e permissões
- `member_attendances` - Presença em eventos
- `events` - Eventos da igreja

## Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Dependências Notáveis

- **@hookform/resolvers**: Integração Zod + React Hook Form
- **class-variance-authority**: Sistema de variantes para componentes
- **@tanstack/react-table**: Tabelas avançadas com sorting, filtering, pagination

## Versões Node.js

- Recomendado: Node.js 18+ ou 20+
- Package manager: npm (lock file presente)
