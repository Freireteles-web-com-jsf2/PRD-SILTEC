# Testes de Segurança - Guia de Configuração

Este diretório contém testes críticos de segurança para o sistema SILTEC SGI.

## Estrutura dos Testes

### 1. RLS (Row Level Security) - `rls.test.ts`
Testes que verificam o isolamento de dados entre igrejas (multi-tenancy):
- **SELECT**: Usuários só veem dados da própria igreja
- **INSERT**: Usuários só podem inserir dados na própria igreja
- **UPDATE**: Usuários só podem atualizar dados da própria igreja
- **DELETE**: Usuários só podem deletar dados da própria igreja
- **WITH CHECK**: Impede mudança de church_id

### 2. Autenticação - `auth.test.ts`
Testes do fluxo de autenticação:
- Login/Logout
- Registro de usuários
- Recuperação de senha
- Sincronização de church_id no perfil
- Persistência de sessão
- JWT claims

### 3. Middleware - `middleware.test.ts`
Testes de proteção de rotas:
- Redirecionamento para login em rotas protegidas
- Redirecionamento para dashboard quando já autenticado
- Preservação de parâmetro redirect
- Atualização de sessão
- Handling de cookies

## Configuração Necessária

### Pré-requisitos

1. **Supabase Local**
   ```bash
   # Instalar Supabase CLI
   npm install -g supabase
   
   # Iniciar Supabase local
   supabase start
   ```

2. **Usuários de Teste**
   
   Criar usuários de teste com church_id diferentes:
   
   ```sql
   -- Usuário da Igreja 1
   INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
   VALUES (
     '10000000-0000-0000-0000-000000000001',
     'church1@test.com',
     crypt('testpassword123', gen_salt('bf')),
     now(),
     '{"church_id": "00000000-0000-0000-0000-000000000001", "full_name": "Test User Church 1"}'::jsonb
   );
   
   -- Usuário da Igreja 2
   INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
   VALUES (
     '20000000-0000-0000-0000-000000000001',
     'church2@test.com',
     crypt('testpassword123', gen_salt('bf')),
     now(),
     '{"church_id": "00000000-0000-0000-0000-000000000002", "full_name": "Test User Church 2"}'::jsonb
   );
   ```

3. **Variáveis de Ambiente**
   
   Criar `.env.test`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase-start
   ```

## Executando os Testes

### Todos os testes de segurança
```bash
npm test -- src/__tests__/security
```

### Apenas RLS
```bash
npm test -- src/__tests__/security/rls.test.ts
```

### Apenas Auth
```bash
npm test -- src/__tests__/security/auth.test.ts
```

### Apenas Middleware
```bash
npm test -- src/__tests__/security/middleware.test.ts
```

### Com cobertura
```bash
npm run test:coverage -- src/__tests__/security
```

## Status Atual

⚠️ **IMPORTANTE**: Os testes estão criados mas com placeholders (TODO).

### Próximos Passos

1. **Configurar ambiente de teste**
   - [ ] Iniciar Supabase local
   - [ ] Criar usuários de teste
   - [ ] Configurar .env.test

2. **Implementar testes RLS**
   - [ ] Descomentar e ajustar testes de SELECT
   - [ ] Descomentar e ajustar testes de INSERT
   - [ ] Descomentar e ajustar testes de UPDATE
   - [ ] Descomentar e ajustar testes de DELETE
   - [ ] Implementar testes para tabelas relacionadas

3. **Implementar testes de Auth**
   - [ ] Descomentar e ajustar testes de login
   - [ ] Descomentar e ajustar testes de registro
   - [ ] Implementar testes de recuperação de senha
   - [ ] Verificar sincronização de church_id

4. **Implementar testes de Middleware**
   - [ ] Criar mocks adequados para Next.js
   - [ ] Testar proteção de rotas
   - [ ] Testar handling de cookies

## Critérios de Sucesso

- ✅ Todos os testes de RLS passando
- ✅ Todos os testes de Auth passando
- ✅ Todos os testes de Middleware passando
- ✅ Cobertura de testes > 95% para código de segurança
- ✅ Zero vulnerabilidades de isolamento entre igrejas

## Referências

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
