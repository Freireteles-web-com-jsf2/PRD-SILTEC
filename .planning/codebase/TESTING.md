# Testing

**Última atualização:** 2026-05-10

## Status Atual

⚠️ **Testes não implementados ainda**

O projeto está em fase inicial (v0.2 completo, v0.3 em planejamento) e ainda não possui suite de testes configurada.

## Estratégia de Testes Planejada

### Pirâmide de Testes

```
        /\
       /  \
      / E2E \
     /--------\
    /          \
   / Integration \
  /----------------\
 /                  \
/   Unit Tests       \
----------------------
```

**Distribuição planejada:**
- 70% Unit Tests
- 20% Integration Tests
- 10% E2E Tests

## Ferramentas Planejadas

### Unit & Integration Tests

**Vitest** (recomendado para Next.js 15+)
- Mais rápido que Jest
- Compatível com ESM
- Melhor integração com Vite/Next.js

```json
// package.json (a adicionar)
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
```

### E2E Tests

**Playwright** (recomendado)
- Suporte multi-browser
- Melhor para Next.js App Router
- Testes de autenticação robustos

```json
// package.json (a adicionar)
{
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

## Estrutura de Testes Planejada

```
src/
├── __tests__/              # Testes unitários
│   ├── components/
│   │   ├── Sidebar.test.tsx
│   │   └── Card.test.tsx
│   ├── hooks/
│   │   └── useMembers.test.ts
│   └── lib/
│       └── supabase.test.ts
├── __integration__/        # Testes de integração
│   ├── auth.test.ts
│   └── members-crud.test.ts
└── __e2e__/               # Testes E2E
    ├── login.spec.ts
    ├── members-flow.spec.ts
    └── dashboard.spec.ts
```

## Casos de Teste Prioritários

### 1. Autenticação (Alta Prioridade)

**Unit Tests:**
- [ ] Middleware redireciona usuário não autenticado
- [ ] Middleware redireciona usuário autenticado de /login
- [ ] Cliente Supabase inicializa corretamente

**Integration Tests:**
- [ ] Login com credenciais válidas
- [ ] Login com credenciais inválidas
- [ ] Logout limpa sessão
- [ ] Recuperação de senha envia email
- [ ] Registro cria novo usuário

**E2E Tests:**
- [ ] Fluxo completo de login → dashboard → logout
- [ ] Fluxo de registro de novo usuário
- [ ] Fluxo de recuperação de senha

### 2. Módulo de Membros (Alta Prioridade)

**Unit Tests:**
- [ ] Hook useMembers retorna dados corretos
- [ ] Filtro de busca funciona
- [ ] Filtro de status funciona
- [ ] Paginação calcula páginas corretamente
- [ ] Componente Card renderiza dados do membro

**Integration Tests:**
- [ ] Criar membro salva no banco
- [ ] Editar membro atualiza dados
- [ ] Deletar membro (soft delete)
- [ ] Listar membros respeita church_id (RLS)
- [ ] Busca retorna resultados corretos

**E2E Tests:**
- [ ] Fluxo completo: criar → visualizar → editar → deletar
- [ ] Busca e filtros funcionam na UI
- [ ] Paginação navega entre páginas
- [ ] Formulário valida campos obrigatórios

### 3. Multi-Tenancy / RLS (Crítico)

**Integration Tests:**
- [ ] Usuário só vê membros da própria igreja
- [ ] Usuário não pode acessar dados de outra igreja
- [ ] INSERT respeita church_id automático
- [ ] UPDATE só afeta registros da própria igreja
- [ ] DELETE só afeta registros da própria igreja

### 4. Componentes UI (Média Prioridade)

**Unit Tests:**
- [ ] Sidebar renderiza itens de navegação
- [ ] Sidebar marca item ativo corretamente
- [ ] Card renderiza props corretamente
- [ ] Badge renderiza variantes corretas
- [ ] TopBar exibe informações do usuário

### 5. Formulários (Média Prioridade)

**Unit Tests:**
- [ ] Schema Zod valida campos obrigatórios
- [ ] Schema Zod valida formato de email
- [ ] Schema Zod valida formato de telefone
- [ ] React Hook Form registra campos

**Integration Tests:**
- [ ] Formulário de membro submete dados corretos
- [ ] Formulário exibe erros de validação
- [ ] Formulário preenche dados ao editar

## Configuração de Testes

### Vitest Config (a criar)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup (a criar)

```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup após cada teste
afterEach(() => {
  cleanup();
});

// Mock de variáveis de ambiente
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
```

### Playwright Config (a criar)

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/__e2e__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Exemplos de Testes

### Unit Test - Componente

```typescript
// src/__tests__/components/Card.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from '@/components/ui/Card';

describe('Card', () => {
  it('renderiza título e conteúdo', () => {
    render(
      <Card title="Teste">
        <p>Conteúdo do card</p>
      </Card>
    );

    expect(screen.getByText('Teste')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument();
  });
});
```

### Integration Test - API

```typescript
// src/__integration__/members-crud.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Members CRUD', () => {
  let supabase: any;
  let testChurchId: string;

  beforeAll(async () => {
    supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    // Setup test church
  });

  it('cria um novo membro', async () => {
    const { data, error } = await supabase
      .from('members')
      .insert({
        church_id: testChurchId,
        name: 'João Teste',
        email: 'joao@teste.com',
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.name).toBe('João Teste');
  });

  it('respeita RLS - não acessa membros de outra igreja', async () => {
    // Implementar teste de isolamento
  });
});
```

### E2E Test - Fluxo

```typescript
// src/__e2e__/members-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Membros', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@teste.com');
    await page.fill('input[name="password"]', 'senha123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('cria novo membro', async ({ page }) => {
    await page.goto('/membros');
    await page.click('text=Novo Membro');
    
    await page.fill('input[name="name"]', 'Maria Silva');
    await page.fill('input[name="email"]', 'maria@teste.com');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Maria Silva')).toBeVisible();
  });
});
```

## Mocking

### Supabase Mock

```typescript
// src/__tests__/mocks/supabase.ts
import { vi } from 'vitest';

export const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        data: [],
        error: null,
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => ({
          data: {},
          error: null,
        })),
      })),
    })),
  })),
  auth: {
    getUser: vi.fn(() => ({
      data: { user: { id: '123' } },
      error: null,
    })),
  },
};
```

## Coverage Goals

**Metas de cobertura:**
- Overall: 80%+
- Componentes críticos (Auth, RLS): 95%+
- Componentes UI: 70%+
- Utilitários: 90%+

```json
// vitest.config.ts
{
  "test": {
    "coverage": {
      "provider": "v8",
      "reporter": ["text", "json", "html"],
      "lines": 80,
      "functions": 80,
      "branches": 80,
      "statements": 80
    }
  }
}
```

## CI/CD Integration

### GitHub Actions (planejado)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
```

## Scripts NPM (a adicionar)

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Próximos Passos

1. **Fase 1 - Setup (v0.3)**
   - [ ] Instalar Vitest e dependências
   - [ ] Configurar vitest.config.ts
   - [ ] Criar setup de testes
   - [ ] Primeiro teste simples

2. **Fase 2 - Testes Críticos (v0.3)**
   - [ ] Testes de autenticação
   - [ ] Testes de RLS/multi-tenancy
   - [ ] Testes de CRUD de membros

3. **Fase 3 - Cobertura Completa (v0.4)**
   - [ ] Testes de componentes UI
   - [ ] Testes de hooks
   - [ ] Testes E2E principais

4. **Fase 4 - CI/CD (v0.4)**
   - [ ] Configurar GitHub Actions
   - [ ] Testes automáticos em PRs
   - [ ] Coverage reports

## Observações

- Priorizar testes de segurança (RLS, auth) antes de UI
- Usar Supabase local para testes de integração
- Manter testes rápidos (< 10s para unit, < 1min para integration)
- E2E apenas para fluxos críticos (evitar testes lentos)
