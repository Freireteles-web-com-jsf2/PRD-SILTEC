# Deploy

## Visão Geral

O SGI é composto por duas partes que precisam ser implantadas:

1. **Frontend**: Next.js 15 (Vercel)
2. **Backend**: Supabase (PostgreSQL, Auth, Storage)

## Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Projeto no [Supabase](https://supabase.com)
- Domínio configurado (opcional)

## Variáveis de Ambiente

Defina no Vercel:

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

<!-- VERIFY: Configurar variáveis no Vercel Dashboard -->

## Deploy do Frontend (Vercel)

1. Conecte o repositório Git à Vercel
2. A Vercel detecta automaticamente Next.js
3. Configure as variáveis de ambiente
4. Deploy é automático em cada push para a branch principal

Comandos de build (detectados automaticamente):

```bash
npm run build
```

## Configuração do Supabase

### Projeto

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Obtenha a URL e chave anônima em Settings → API
3. Configure as variáveis no Vercel

### Migrations

Execute as migrations do diretório `supabase/migrations/` na ordem numérica:

| Migration | Descrição |
|-----------|-----------|
| `20260508000001_create_members.sql` | Tabela `members` + índices |
| `20260508000002_create_family_groups.sql` | Tabela `family_groups` |
| `20260508000003_create_family_members.sql` | Tabela `family_members` (N:N) |
| `20260508000004_create_role_enums.sql` | Enums do sistema |
| `20260508000005_create_member_timeline.sql` | Tabela `member_timeline` |
| `20260508000006_create_member_roles.sql` | Tabela `member_roles` |
| `20260508000007_create_member_attendances.sql` | Tabela `member_attendances` |
| `20260508000008_create_events.sql` | Tabela `events` |
| `20260508000009_enable_rls_helper_function.sql` | Função `get_current_church_id()` |
| `20260508000010_rls_members_policies.sql` | Policies RLS |
| `20260508000011_rls_related_tables.sql` | Policies RLS restantes |
| `20260508000012_audit_triggers.sql` | Triggers de auditoria |
| `20260508000013_fix_audit_triggers.sql` | Correção dos triggers |

### Autenticação

1. No painel do Supabase: Authentication → Providers → Email
2. Habilite o provider de email/senha
3. <!-- VERIFY: Configurar site_url para o domínio de produção -->

### Row Level Security

As policies RLS são aplicadas automaticamente via migrations (`20260508000010_*` e `20260508000011_*`). <!-- VERIFY: Verificar se todas as policies estão aplicadas no projeto Supabase -->

## Pós-Deploy

1. Configure o domínio em Authentication → Settings → Site URL
2. <!-- VERIFY: Configurar SMTP transacional no Supabase para emails de recuperação -->
3. Teste o fluxo completo: registro → login → dashboard
4. Monitore os logs em Supabase → Logs

## Rollback

- **Frontend**: Vercel permite reverter para qualquer deploy anterior no Dashboard
- **Banco de dados**: Utilize `supabase migration repair` ou restore manual via Supabase Dashboard

---

*Deploy: 2026-05-10*
