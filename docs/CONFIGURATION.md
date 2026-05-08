# Configuração

## Variáveis de Ambiente

### Variáveis Obrigatórias

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

### Exemplo

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

## Configuração do Supabase

### Autenticação

1. Acesse o painel do Supabase
2. Vá em Authentication → Providers
3. Habilite "Email/Password"

### Banco de Dados

Crie as tabelas:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'member',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de membros
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Política de isolamento por church_id
CREATE POLICY "Users can see own church" ON users
  FOR SELECT USING (auth.uid() = id);
```

## Configuração do Tailwind

Arquivo: `tailwind.config.ts`

Cores personalizadas disponíveis:
- `primary` — Azul principal
- `secondary` — secondary
- `accent` — Destaque

## Próximos Passos

<!-- VERIFY: Configurar variáveis no ambiente de produção -->
1. Configurar variáveis no ambiente de produção
2. Configurar domínio allowed no Supabase
3. Configurar e-mails transacionais

---

*Configuration: 2026-05-07*