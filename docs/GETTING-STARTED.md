# Getting Started

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

## Instalação

1. **Clone o projeto**
```bash
git clone <repo-url>
cd PRD-SILTEC
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o `.env.local` com as credenciais do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://dgfstgnkpbqsogdaitzp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse**
Abra http://localhost:3000

## Primeiro Acesso

1. Acesse a página de login (/login)
2. Use "Criar conta" para se registrar
3. O perfil será criado automaticamente via trigger
4. Faça login com as credenciais

## Configuração do Supabase

### Banco de Dados

Execute as migrations no SQL Editor do Supabase:

1. **Migration 001:** `supabase/migrations/001_create_tables.sql`
   - Cria tabela `public.users`
   - Cria tabela `public.membros`
   - Configura RLS e políticas

2. **Migration 002:** `supabase/migrations/002_profiles_trigger_setup.sql`
   - Cria tabela `public.profiles`
   - Cria trigger para auto-criação de perfis

### Estrutura de Dados

Execute as migrations na ordem no SQL Editor do Supabase Dashboard: `https://dgfstgnkpbqsogdaitzp.supabase.co`

#### Tabela: members

Tabela principal de membros da igreja com informações pessoais e ministeriais.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| church_id | uuid | FK - identificação da igreja (multi-tenant) |
| name | varchar(255) | Nome completo |
| birth_date | date | Data de nascimento |
| gender | gender_type | male, female, other, prefer_not_to_say |
| marital_status | marital_status_type | single, married, divorced, widowed, separated |
| phone | varchar(20) | Telefone |
| email | varchar(255) | Email |
| address | text | Endereço |
| address_city | varchar(100) | Cidade |
| address_state | varchar(50) | Estado |
| baptism_date | date | Data do batismo |
| conversion_date | date | Data de conversão |
| department_id | uuid | Departamento/ministério principal |
| status | boolean | Ativo/inativo |
| avatar_url | text | URL do avatar |
| deleted_at | timestamptz | Soft delete |

#### Tabela: family_groups

Grupos familiares ou unidades domésticas dentro da igreja.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| church_id | uuid | FK - identificação da igreja |
| name | varchar(255) | Nome do grupo familiar |
| leader_id | uuid | FK para members - líder do grupo |
| description | text | Descrição |
| status | boolean | Ativo/inativo |

#### Tabela: family_members

Tabela de junção N:N entre family_groups e members com tipo de relacionamento.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| church_id | uuid | FK - identificação da igreja |
| family_group_id | uuid | FK para family_groups |
| member_id | uuid | FK para members |
| relationship | family_relationship_type | husband, wife, son, daughter, etc |
| is_primary_contact | boolean | Contato principal do grupo |
| notes | text | Observações |

#### Tabela: member_timeline

Linha do tempo de eventos ministeriais: mudanças de cargo, departamento e status.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| church_id | uuid | FK - identificação da igreja |
| member_id | uuid | FK para members |
| event_type | timeline_event_type | Tipo de evento |
| old_value | text | Valor anterior |
| new_value | text | Novo valor |
| description | text | Descrição do evento |
| effective_date | date | Data de vigência |

#### Tabela: member_attendances

Registros de frequência dos membros em eventos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| church_id | uuid | FK - identificação da igreja |
| member_id | uuid | FK para members |
| event_id | uuid | FK para events (opcional) |
| status | attendance_status_type | present, absent, justified |
| check_in_time | timestamptz | Hora de entrada |
| check_out_time | timestamptz | Hora de saída |
| justification | text | Justificativa de ausência |

#### Tabela: member_roles

Histórico de atribuições de papéis (RBAC) aos membros.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| church_id | uuid | FK - identificação da igreja |
| member_id | uuid | FK para members |
| role | member_role_type | Papel atribuído |
| department_id | uuid | Departamento |
| is_active | boolean | Ativo/inativo |
| start_date | date | Data de início |
| end_date | date | Data de término |
| granted_by | uuid | Quem concedeu o papel |
| granted_at | timestamptz | Data de concessão |

---

## Identidade Visual

### Dark Glassmorphism UI

O SGI utiliza uma interface dark com efeito glassmorphism (vidro fosco), criando profundidade e hierarquia visual.

### Design Tokens

#### Cores do Tema (CSS Variables)

| Token | Valor | Uso |
|-------|-------|-----|
| --background | hsl(222 47% 5%) | Fundo principal |
| --foreground | hsl(220 20% 92%) | Texto principal |
| --primary | hsl(262 83% 75%) | Cor primária (roxo) |
| --secondary | hsl(221 83% 82%) | Cor secundária |
| --tertiary | hsl(269 76% 80%) | Cor terciária |
| --surface-container-lowest | hsl(222 59% 4%) | Superfície mais escura |
| --surface-container | hsl(222 41% 12%) | Superfície do container |
| --surface-container-highest | hsl(222 32% 22%) | Superfície mais clara |

#### Classes de Estilo

- `.glass` - Card com backdrop blur de 12px e borda translúcida
- `.glass-card` - Mesmo efeito do glass para cards
- `.glass-sidebar` - Sidebar com maior blur (24px) e borda mais suave
- `.glass-topbar` - Topbar com blur moderado

#### Tipografia

| Classe | Tamanho | Line-height | Peso |
|--------|---------|-------------|------|
| .font-h1 | 32px | 1.2 | 700 |
| .font-h2 | 24px | 1.3 | 600 |
| .font-h3 | 20px | 1.4 | 600 |
| .font-body-lg | 16px | 1.6 | 400 |
| .font-body-md | 14px | 1.5 | 400 |
| .font-label-sm | 12px | 1 | 600 |

---

## Problemas Comuns de Configuração

1. **Erro de conexão com Supabase**
   - Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas no `.env.local`
   - Confirme que o projeto Supabase está ativo em: `https://dgfstgnkpbqsogdaitzp.supabase.co`

2. **Erro de autenticação após registro**
   - O trigger de criação de perfil pode não ter executado
   - Verifique se as migrations foram executadas corretamente no Supabase SQL Editor

3. **Porta já em uso**
   - Se a porta 3000 estiver em uso: `npm run dev -- -p 3001`

---

## Próximos Passos

- Consulte o [DEVELOPMENT.md](./DEVELOPMENT.md) para configuração de desenvolvimento
- Consulte o [TESTING.md](./TESTING.md) para executar testes
- Configure o ambiente de produção seguindo [DEPLOYMENT.md](./DEPLOYMENT.md)

---

*Getting Started: 2026-05-08*
*Projeto: Siltec-Solutions | SGI*