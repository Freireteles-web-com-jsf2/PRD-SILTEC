# Configuração

## Variáveis de Ambiente

### Variáveis Obrigatórias

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

### Exemplo

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dgfstgnkpbqsogdaitzp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

## Configuração do Supabase

### Autenticação

1. Acesse o painel do Supabase
2. Vá em Authentication → Providers
3. Habilite "Email/Password"

### Banco de Dados

As migrations estão em `supabase/migrations/`. Execute-as na ordem:

| Migration | Descrição |
|-----------|-----------|
| `20260508000001_create_members.sql` | Tabela `members` + índices |
| `20260508000002_create_family_groups.sql` | Tabela `family_groups` |
| `20260508000003_create_family_members.sql` | Tabela `family_members` (N:N) |
| `20260508000004_create_role_enums.sql` | Enums: member_role, timeline_event, attendance_status, family_relationship |
| `20260508000005_create_member_timeline.sql` | Tabela `member_timeline` |
| `20260508000006_create_member_roles.sql` | Tabela `member_roles` |
| `20260508000007_create_member_attendances.sql` | Tabela `member_attendances` |
| `20260508000008_create_events.sql` | Tabela `events` |
| `20260508000009_enable_rls_helper_function.sql` | Função `get_current_church_id()` |
| `20260508000010_rls_members_policies.sql` | Policies RLS para members e relacionadas |
| `20260508000011_rls_related_tables.sql` | Policies RLS para tabelas restantes |
| `20260508000012_audit_triggers.sql` | Triggers de auditoria |
| `20260508000013_fix_audit_triggers.sql` | Correção dos triggers |

#### Enum: `member_role_type`

```sql
CREATE TYPE member_role_type AS ENUM (
  'member', 'leader', 'treasurer', 'admin', 'super_admin'
);
```

#### Enum: `timeline_event_type`

```sql
CREATE TYPE timeline_event_type AS ENUM (
  'role_change', 'department_change', 'status_change', 'observation'
);
```

#### Enum: `attendance_status_type`

```sql
CREATE TYPE attendance_status_type AS ENUM (
  'present', 'absent', 'justified'
);
```

#### Enum: `family_relationship_type`

```sql
CREATE TYPE family_relationship_type AS ENUM (
  'husband', 'wife', 'son', 'daughter', 'father', 'mother',
  'brother', 'sister', 'grandfather', 'grandmother', ...
);
```

### Row Level Security

Todas as tabelas possuem RLS habilitado via `supabase/migrations/20260508000009_*` a `20260508000011_*`.

## Configuração do Tailwind

Arquivo: `tailwind.config.ts`

### Sistema de Cores (Dark Theme)

| Cor | Hex | Uso |
|-----|-----|-----|
| `primary` | `#d0bcff` | Acento principal (roxo claro) |
| `secondary` | `#adc6ff` | Acento secundário (azul claro) |
| `tertiary` | `#dbb8ff` | Acento terciário (violeta) |
| `background` | `#0b1326` | Fundo principal |
| `surface` | `#0b1326` | Superfície (mesmo que background) |
| `surface-container-low` | `#131b2e` | Container de superfície baixa |
| `surface-container` | `#171f33` | Container de superfície |
| `surface-container-high` | `#222a3d` | Container de superfície alta |
| `on-surface` | `#dae2fd` | Texto principal |
| `on-surface-variant` | `#cbc3d7` | Texto secundário |
| `error` | `#ffb4ab` | Cor de erro |
| `border` | HSL(220, 13%, 28%) | Bordas |
| `outline` | HSL(220, 8%, 50%) | Contornos |

### Tipografia

- **Font:** Manrope (400, 600, 700, 900)
- **Fontes semânticas:** `font-h1`, `font-h2`, `font-h3`, `font-body-lg`, `font-body-md`, `font-label-sm`
- **Ícones:** Material Symbols Outlined (via CDN Google Fonts)

### Espaçamentos Customizados

| Token | Valor |
|-------|-------|
| `margin` | 40px |
| `gutter` | 24px |
| `xl` | 32px |
| `lg` | 24px |
| `md` | 16px |
| `sm` | 8px |
| `xs` | 4px |
| `unit` | 4px |

### Dark Mode

O tema escuro é forçado via `class="dark"` no elemento `<html>` do `layout.tsx`:

```tsx
<html lang="pt-BR" className="dark">
```

Tailwind usa `darkMode: "class"` — a classe `dark` ativa o tema escuro.

### Utilitários Glassmorphism

```css
.glass         /* background blur, border branca */
.glass-card    /* idêntico a .glass, para cards */
.glass-sidebar /* sidebar com blur extra forte */
.glass-topbar  /* topbar com blur leve */
```

## Identidade Visual

O sistema de design completo está documentado em `docs/ARCHITECTURE.md` — Sistema de Identidade Visual.

## Próximos Passos

<!-- VERIFY: Configurar variáveis no ambiente de produção -->
1. Configurar variáveis no ambiente de produção
2. Configurar domínio allowed no Supabase
3. Configurar e-mails transacionais

---

*Configuration: 2026-05-08*