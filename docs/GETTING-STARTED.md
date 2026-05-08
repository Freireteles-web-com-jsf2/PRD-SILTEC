# Getting Started

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

## Instalação

1. **Clone o projeto**
```bash
git clone <repo-url>
cd siltec-sgi
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.local.example .env.local
```

Edite o `.env.local` com suas credenciais do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

4. **Execute o projeto**
```bash
npm run dev
```

5. **Acesse**
Abra http://localhost:3000

## Primeiro Acesso

1. Acesse a página de login
2. O admin inicial deve ser criado pelo painel
3. Faça login com as credenciais

## Configuração do Supabase

### 1. Criar Projeto

Acesse https://supabase.com e crie um novo projeto.

### 2. Configurar Auth

Em Authentication → Providers, habilite "Email/Password".

### 3. Configurar Banco

Crie as tabelas necessárias:
- `users` — usuários do sistema
- `members` — membros da igreja
- `events` — eventos
- `departments` — departamentos/ministérios
- `financial_entries` — entradas/saídas financeiras

### 4. Configurar RLS

Ative Row Level Security para garantir isolamento entre igrejas.

## Estrutura de Dados

### Tabela: members

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador |
| church_id | UUID | Igreja associada |
| name | VARCHAR | Nome completo |
| email | VARCHAR | E-mail |
| phone | VARCHAR | Telefone |
| birth_date | DATE | Data de nascimento |
| status | BOOLEAN | Ativo/Inativo |

---

*Getting Started: 2026-05-07*