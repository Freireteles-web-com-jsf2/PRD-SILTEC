<!-- generated-by: gsd-doc-writer -->
---
title: Getting Started
sidebar_position: 3
description: Guia de início rápido para configurar e executar o SGI localmente
---

# Getting Started — SGI (Sistema de Gestão Integrada)

Guia passo a passo para configurar o ambiente de desenvolvimento e executar o SGI localmente.

---

## Pré-requisitos

Antes de começar, verifique se você tem instalado:

| Ferramenta | Versão Mínima | Como verificar |
|---|---|---|
| **Node.js** | `>= 18.0.0` | `node --version` |
| **npm** | `>= 9.0.0` | `npm --version` |
| **Git** | — | `git --version` |
| **Conta Supabase** | — | [Criar conta gratuita](https://supabase.com) |

O projeto não possui arquivo `.nvmrc`, mas é compatível com Node.js 18+. Recomenda-se usar o **Node.js 20 LTS** ou superior.

### Dependências de sistema

Nenhuma dependência de sistema adicional é necessária. Todo o stack (Next.js, Tailwind, Supabase client) é gerenciado via npm.

---

## Instalação passo a passo

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd siltec-sgi
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo (ou crie) o arquivo `.env.local` na raiz do projeto:

```bash
# Crie o arquivo .env.local com as seguintes variáveis:
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

**Onde obter esses valores:**

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione ou crie um projeto
3. Vá em **Project Settings → API**
4. Copie a **Project URL** (é o `NEXT_PUBLIC_SUPABASE_URL`)
5. Copie a **anon public key** (é o `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

> ⚠️ **Atenção:** O projeto valida essas variáveis em dois lugares:
> - `src/lib/supabase.ts` — no cliente do navegador (lança erro se ausentes)
> - `src/middleware.ts` — no middleware do Next.js para rotas protegidas
>
> Se as variáveis não forem definidas, o aplicativo lançará um erro na inicialização.

### 4. Configurar o banco de dados Supabase

O SGI utiliza Supabase como backend completo (PostgreSQL, Auth, Storage). Siga os passos abaixo para configurar o banco:

#### a. Criar o projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em **New Project**
3. Defina um nome (ex: `sgi-producao` ou `sgi-dev`)
4. Defina a **Database Password** (guarde com segurança)
5. Escolha a região mais próxima
6. Clique em **Create new project** (aguarde alguns minutos)

#### b. Aplicar as migrations

As migrations estão em `supabase/migrations/` e devem ser executadas na ordem correta. Você pode usar o [Supabase CLI](https://supabase.com/docs/guides/cli) ou o SQL Editor do dashboard:

```bash
# Opção 1: Usando Supabase CLI (recomendado)
supabase link --project-ref <seu-project-ref>
supabase db push
```

```
# Opção 2: Usando o SQL Editor do dashboard
# Acesse SQL Editor no Supabase Dashboard e cole os arquivos na ordem abaixo
```

#### c. Ordem das migrations

| # | Arquivo | Descrição |
|---|---|---|
| 1 | `supabase-setup.sql` | Cria tabela `profiles`, trigger `on_auth_user_created` e RLS para profiles |
| 2 | `002_profiles_trigger_setup.sql` | Reforça a configuração do trigger de profiles (idempotente) |
| 3 | `20260508000001_create_members.sql` | Cria tabela `members` com soft delete e índices multi-tenant |
| 4 | `20260508000002_create_family_groups.sql` | Cria tabela `family_groups` (núcleos familiares) |
| 5 | `20260508000003_create_family_members.sql` | Cria tabela `family_members` (relação N:N membros ↔ grupos) |
| 6 | `20260508000004_create_role_enums.sql` | Cria ENUMs: `member_role_type`, `timeline_event_type`, `attendance_status_type` |
| 7 | `20260508000005_create_member_timeline.sql` | Cria tabela `member_timeline` (histórico ministerial) |
| 8 | `20260508000006_create_member_roles.sql` | Cria tabela `member_roles` (atribuições RBAC) |
| 9 | `20260508000007_create_member_attendances.sql` | Cria tabela `member_attendances` (frequência em eventos) |
| 10 | `20260508000008_create_events.sql` | Cria tabela `events` (eventos da igreja) |
| 11 | `20260508000009_enable_rls_helper_function.sql` | Habilita RLS em todas as tabelas + funções helper `get_current_church_id()` e `check_church_access()` |
| 12 | `20260508000010_rls_members_policies.sql` | Políticas RLS para a tabela `members` |
| 13 | `20260508000011_rls_related_tables.sql` | Políticas RLS para tabelas relacionadas |
| 14 | `20260508000012_audit_triggers.sql` | Triggers de auditoria (`updated_at`, `created_by`, `updated_by`, `church_id`) |
| 15 | `20260508000013_fix_audit_triggers.sql` | Correção dos triggers de auditoria (uso de `EXISTS` em vez de `HAS_COLUMN`) |
| 16 | `20260508000014_fix_get_current_church_id.sql` | Correção da função `get_current_church_id()` — verifica também `user_metadata.church_id` no JWT |
| 17 | `seed.sql` | Dados de seed para desenvolvimento (opcional) |

#### d. Seed (opcional, apenas desenvolvimento)

```bash
# Aplicar dados de seed para testes
supabase db push --include-seed
```

---

## Primeira execução

Após configurar as variáveis de ambiente e o banco de dados, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor será iniciado em **http://localhost:3000**.

### Fluxo de uso inicial

1. Acesse `http://localhost:3000` — você será redirecionado automaticamente para `/login`
2. Clique em **Criar conta** para se registrar
3. Preencha nome, e-mail e senha
4. Verifique seu e-mail (o Supabase envia um link de confirmação)
5. Após confirmar, faça login
6. Você será redirecionado para o **Dashboard** em `/dashboard`

---

## Esquema do banco de dados

### Tabela `profiles`

Perfis de usuário vinculados ao `auth.users` do Supabase. Criada automaticamente via trigger no registro.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Referência a `auth.users(id)` |
| `email` | `text` | E-mail do usuário |
| `name` | `text` | Nome completo |
| `role` | `text` | Papel RBAC: `member`, `leader`, `treasurer`, `admin`, `super_admin` |
| `status` | `boolean` | Ativo/inativo |
| `created_at` | `timestamptz` | Data de criação |

### Tabela `members`

Membros da igreja com informações pessoais e ministeriais.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `church_id` | `uuid NOT NULL` | Identificador multi-tenant (cada igreja vê apenas seus membros) |
| `name` | `varchar(255) NOT NULL` | Nome completo |
| `birth_date` | `date` | Data de nascimento |
| `gender` | `gender_type` | `male`, `female`, `other`, `prefer_not_to_say` |
| `marital_status` | `marital_status_type` | `single`, `married`, `divorced`, `widowed`, `separated` |
| `phone` | `varchar(20)` | Telefone de contato |
| `email` | `varchar(255)` | E-mail |
| `address` | `text` | Endereço completo |
| `address_city` | `varchar(100)` | Cidade |
| `address_state` | `varchar(50)` | Estado |
| `baptism_date` | `date` | Data de batismo |
| `conversion_date` | `date` | Data de conversão |
| `department_id` | `uuid` | Departamento/ministério principal |
| `status` | `boolean` | Ativo (`true`) ou inativo (`false`) |
| `avatar_url` | `text` | URL do avatar |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |
| `deleted_at` | `timestamptz` | Soft delete (nulo = ativo) |
| `created_by` | `uuid` | Usuário que criou |
| `updated_by` | `uuid` | Usuário que atualizou |

### Tabela `family_groups`

Núcleos familiares ou grupos domésticos.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `church_id` | `uuid NOT NULL` | Identificador multi-tenant |
| `name` | `varchar(255) NOT NULL` | Nome do grupo familiar |
| `leader_id` | `uuid FK → members.id` | Líder do grupo |
| `description` | `text` | Descrição |
| `status` | `boolean` | Ativo/inativo |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |
| `deleted_at` | `timestamptz` | Soft delete |
| `created_by` | `uuid` | Usuário que criou |
| `updated_by` | `uuid` | Usuário que atualizou |

### Tabela `family_members`

Tabela de junção N:N entre membros e grupos familiares.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `church_id` | `uuid NOT NULL` | Identificador multi-tenant |
| `family_group_id` | `uuid FK → family_groups.id` | Grupo familiar (ON DELETE CASCADE) |
| `member_id` | `uuid FK → members.id` | Membro (ON DELETE CASCADE) |
| `relationship` | `family_relationship_type` | Relacionamento (cônjuge, filho, etc.) |
| `is_primary_contact` | `boolean` | Contato principal do grupo (apenas 1 por grupo) |
| `notes` | `text` | Observações |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |
| `created_by` | `uuid` | Usuário que criou |
| `updated_by` | `uuid` | Usuário que atualizou |

**Restrições:** `UNIQUE(family_group_id, member_id)` — sem duplicidade de membro no mesmo grupo. Apenas 1 `is_primary_contact = true` por grupo.

### Tabela `member_timeline`

Linha do tempo ministerial de cada membro (mudanças de cargo, departamento, status e observações).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `church_id` | `uuid NOT NULL` | Identificador multi-tenant |
| `member_id` | `uuid FK → members.id` | Membro (ON DELETE CASCADE) |
| `event_type` | `timeline_event_type` | `role_change`, `department_change`, `status_change`, `observation` |
| `old_value` | `text` | Valor anterior |
| `new_value` | `text` | Novo valor |
| `description` | `text` | Descrição do evento |
| `effective_date` | `date` | Data de efetivação |
| `created_by` | `uuid` | Usuário que criou |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |
| `deleted_at` | `timestamptz` | Soft delete |

### Tabela `member_roles`

Histórico de atribuições de papéis RBAC para membros.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `church_id` | `uuid NOT NULL` | Identificador multi-tenant |
| `member_id` | `uuid FK → members.id` | Membro (ON DELETE CASCADE) |
| `role` | `member_role_type` | `member`, `leader`, `treasurer`, `admin`, `super_admin` |
| `department_id` | `uuid` | Departamento associado |
| `is_active` | `boolean` | Se a atribuição está ativa |
| `start_date` | `date NOT NULL` | Data de início |
| `end_date` | `date` | Data de término |
| `granted_by` | `uuid` | Usuário que concedeu |
| `granted_at` | `timestamptz` | Momento da concessão |
| `revoked_at` | `timestamptz` | Momento da revogação |
| `revocation_reason` | `text` | Motivo da revogação |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |
| `deleted_at` | `timestamptz` | Soft delete |

**Restrições:** `UNIQUE(member_id, role, is_active, start_date)` — evita atribuições duplicadas.

### Tabela `member_attendances`

Registro de frequência de membros em eventos.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `church_id` | `uuid NOT NULL` | Identificador multi-tenant |
| `member_id` | `uuid FK → members.id` | Membro (ON DELETE CASCADE) |
| `event_id` | `uuid` | Evento (nullable) |
| `status` | `attendance_status_type` | `present`, `absent`, `justified` |
| `check_in_time` | `timestamptz` | Horário de check-in |
| `check_out_time` | `timestamptz` | Horário de check-out |
| `notes` | `text` | Observações |
| `justification` | `text` | Justificativa de ausência |
| `recorded_by` | `uuid` | Quem registrou |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |
| `deleted_at` | `timestamptz` | Soft delete |

**Restrições:** `UNIQUE(member_id, event_id)` — um registro de presença por membro por evento.

### Tabela `events`

Eventos da igreja (cultos, reuniões, celebrações).

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | `uuid PK` | Identificador único |
| `church_id` | `uuid NOT NULL` | Identificador multi-tenant |
| `title` | `varchar(255) NOT NULL` | Título do evento |
| `description` | `text` | Descrição |
| `event_type` | `varchar(50)` | Tipo: `culto`, `reunião`, `evento`, `celebração` |
| `start_date` | `timestamptz NOT NULL` | Data/hora de início |
| `end_date` | `timestamptz` | Data/hora de término |
| `location` | `varchar(255)` | Local |
| `is_online` | `boolean` | Se é online |
| `online_link` | `text` | Link para transmissão |
| `capacity` | `integer` | Capacidade máxima |
| `registered_count` | `integer` | Quantidade de inscritos |
| `department_id` | `uuid` | Departamento responsável |
| `status` | `varchar(20)` | `scheduled`, `ongoing`, `completed`, `cancelled` |
| `created_by` | `uuid` | Usuário que criou |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data da última atualização |
| `deleted_at` | `timestamptz` | Soft delete |

---

## Rotas da aplicação

| Rota | Descrição | Requer Autenticação |
|---|---|---|
| `/` | Redireciona para `/login` | Não |
| `/login` | Página de login | Não |
| `/register` | Página de cadastro | Não |
| `/forgot-password` | Recuperação de senha | Não |
| `/reset-password` | Redefinição de senha | Não |
| `/dashboard` | Dashboard com KPIs, gráficos e calendário | Sim |
| `/membros` | Listagem de membros com busca e filtros | Sim |
| `/membros/novo` | Cadastro de novo membro | Sim |
| `/membros/[id]` | Perfil e edição de membro | Sim |

---

## Testes

### Testes unitários (Vitest)

```bash
npm test              # Executa os testes uma vez
npm run test:ui       # Executa com interface gráfica
npm run test:coverage # Executa com relatório de cobertura
```

### Testes end-to-end (Playwright)

```bash
npm run test:e2e      # Executa testes E2E
npm run test:e2e:ui   # Executa com interface gráfica do Playwright
```

---

## Problemas comuns

### "Configuração do Supabase ausente"

**Erro:** `Configuração do Supabase ausente. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.`

**Solução:** Certifique-se de que o arquivo `.env.local` existe na raiz do projeto com ambas as variáveis definidas. O arquivo `.env` (sem `.local`) também funciona em desenvolvimento.

### "Invalid login credentials"

**Erro:** Ao tentar fazer login, aparece "E-mail ou senha inválidos".

**Solução:** 
1. Verifique se você criou a conta (use "Criar conta" na página de login)
2. Confirme o e-mail através do link enviado pelo Supabase
3. Se o problema persistir, use "Esqueceu a senha?" para redefinir

### Banco de dados vazio (seed)

Se o banco de dados foi criado mas não há dados para testar, execute o script `seed.sql` via SQL Editor do Supabase ou via CLI:

```bash
supabase db push --include-seed
```

Isso criará dados de exemplo: membros (João Silva, Maria Silva, etc.), grupos familiares, eventos e registros de frequência.

---

## Próximos passos

Após a primeira execução bem-sucedida, consulte:

- **[Arquitetura](ARCHITECTURE.md)** — Entenda a arquitetura do sistema, componentes e fluxo de dados
- **[Configuração](CONFIGURATION.md)** — Variáveis de ambiente e configurações detalhadas
- **[Desenvolvimento](DEVELOPMENT.md)** — Guia de desenvolvimento, scripts e boas práticas
- **[Testes](TESTING.md)** — Como escrever e executar testes
- **[Deploy](DEPLOYMENT.md)** — Implantação em produção
- **[API](API.md)** — Rotas, autenticação e endpoints
