<!-- generated-by: gsd-doc-writer -->
# Testes

## Visão Geral

Este documento descreve a estratégia, configuração e execução de testes do **SGI — Sistema de Gestão Integrada**. O projeto utiliza **Vitest** para testes unitários e de integração, e **Playwright** para testes end-to-end (E2E).

## Stack de Testes

| Categoria | Ferramenta | Versão | Status |
|-----------|-----------|--------|--------|
| Unitário / Integração | Vitest | ^4.1.5 | ✅ Ativo |
| Componentes React | Testing Library (React) | ^16.3.2 | ✅ Ativo |
| E2E | Playwright | ^1.59.1 | ⚠️ Estrutura criada, sem testes implementados |
| Cobertura | `@vitest/coverage-v8` | ^4.1.5 | ✅ Configurado |

### Dependências de Teste

As bibliotecas estão declaradas em `devDependencies` no `package.json`:

- `vitest` — Executor de testes
- `@vitest/coverage-v8` — Relatório de cobertura (provider V8)
- `@testing-library/react` — Renderização de componentes React em testes
- `@testing-library/jest-dom` — Matchers customizados para DOM (`toBeInTheDocument`, etc.)
- `@testing-library/user-event` — Simulação de eventos de usuário
- `@playwright/test` — Testes end-to-end
- `jsdom` — Ambiente DOM simulado para testes unitários

## Estrutura de Diretórios

```
src/
├── __tests__/           # Testes unitários e de integração
│   ├── setup.ts         # Configuração global (jest-dom, cleanup, env vars)
│   ├── smoke.test.tsx   # Teste de fumaça para validar o setup
│   ├── components/      # Testes de componentes React
│   │   └── ErrorBoundary.test.tsx
│   ├── hooks/           # Testes de hooks customizados
│   │   └── useMembersQuery.test.ts
│   ├── lib/             # Testes de utilitários e bibliotecas
│   │   └── errors.test.ts
│   └── security/        # Testes de segurança (RLS, Auth, Middleware)
│       ├── auth.test.ts
│       ├── middleware.test.ts
│       ├── rls.test.ts
│       └── README.md    # Guia de configuração dos testes de segurança
├── __e2e__/             # Testes end-to-end (Playwright)
│       (vazio — aguardando implementação)
└── __integration__/     # Testes de integração
        (vazio — aguardando implementação)
```

> **Nota sobre o estado atual:** Os diretórios `__e2e__/` e `__integration__/` existem mas estão vazios. Os testes de segurança em `__tests__/security/` estão criados, porém todos os `describe` estão com `.skip`, indicando que dependem de um ambiente Supabase local configurado (consulte o `README.md` dentro do diretório para instruções).

## Configuração do Vitest

Arquivo: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'src/types/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Detalhes da Configuração

| Item | Valor | Descrição |
|------|-------|-----------|
| `environment` | `jsdom` | Simula um navegador para testes de componentes |
| `globals` | `true` | Disponibiliza `describe`, `it`, `expect` globalmente |
| `setupFiles` | `./src/__tests__/setup.ts` | Arquivo executado antes de cada teste |
| `coverage.provider` | `v8` | Usa o V8 nativo para cobertura (mais rápido) |
| `coverage.reporter` | `text`, `json`, `html` | Saída no terminal, JSON e relatório HTML |
| Path alias `@/` | `./src` | Mesmo alias do `tsconfig.json` |

### Arquivo de Setup (`src/__tests__/setup.ts`)

```typescript
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

O setup realiza duas tarefas:
1. Importa os matchers do `@testing-library/jest-dom` (ex.: `toBeInTheDocument`, `toHaveClass`)
2. Executa `cleanup()` automaticamente após cada teste para desmontar componentes
3. Define variáveis de ambiente mockadas para o Supabase

## Configuração do Playwright

Arquivo: `playwright.config.ts`

```typescript
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

### Detalhes da Configuração

| Item | Valor | Descrição |
|------|-------|-----------|
| `testDir` | `./src/__e2e__` | Diretório onde os testes E2E são procurados |
| `fullyParallel` | `true` | Executa testes em paralelo |
| `retries` | `2` (CI) / `0` (local) | Repetições em caso de falha |
| `baseURL` | `http://localhost:3000` | URL base do servidor Next.js |
| `trace` | `on-first-retry` | Grava trace apenas na primeira repetição |
| `webServer.command` | `npm run dev` | Comando para iniciar o servidor antes dos testes |

## Como Executar os Testes

### Testes Unitários (Vitest)

```bash
# Executar todos os testes
npm test

# Modo watch (re-executa ao salvar)
npm test -- --watch
# ou
npx vitest --watch

# Modo UI (interface gráfica do Vitest)
npm run test:ui

# Testes com cobertura
npm run test:coverage

# Executar um arquivo específico
npm test -- src/__tests__/lib/errors.test.ts

# Executar testes de um diretório específico
npm test -- src/__tests__/components

# Executar por padrão de nome (apenas testes com "auth" no nome)
npm test -- -t "auth"

# Executar sem modo watch (útil para CI)
npm test -- --run
```

### Testes End-to-End (Playwright)

```bash
# Executar todos os testes E2E
npm run test:e2e

# Modo UI interativa do Playwright
npm run test:e2e:ui

# Executar um arquivo específico
npx playwright test src/__e2e__/login.spec.ts

# Executar em modo debug
npx playwright test --debug

# Visualizar relatório HTML (após execução)
npx playwright show-report
```

### Relatório de Cobertura

Após executar `npm run test:coverage`:

- **Terminal:** Resumo com porcentagens por arquivo (reporter `text`)
- **HTML:** Abra `coverage/index.html` no navegador para visualização detalhada
- **JSON:** `coverage/coverage-final.json` para integração com outras ferramentas

## Convenções para Escrever Testes

### Nomenclatura de Arquivos

- Arquivos de teste devem seguir o padrão: `*.test.ts` ou `*.test.tsx`
- Localização: `src/__tests__/<categoria>/<nome>.test.ts`
  - Componentes → `src/__tests__/components/`
  - Hooks → `src/__tests__/hooks/`
  - Utilitários → `src/__tests__/lib/`
  - Segurança → `src/__tests__/security/`

### Estrutura Recomendada

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MeuComponente } from '@/components/MeuComponente';

describe('MeuComponente', () => {
  it('deve renderizar o conteúdo esperado', () => {
    render(<MeuComponente prop="valor" />);
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
});
```

### Boas Práticas

1. **Mock do Supabase:** Use `vi.mock('@/lib/supabase')` para isolar testes de hooks que dependem do banco
2. **Provider de React Query:** Use `QueryClientProvider` com um `QueryClient` configurado com `retry: false` para evitar repetições em testes que esperam erro
3. **Cleanup:** O setup global já executa `cleanup()` após cada teste — não é necessário chamar manualmente
4. **Testes de erro:** Ao testar componentes que disparam erros (como `ErrorBoundary`), silencie o `console.error` para evitar poluição no output:

   ```typescript
   const consoleError = console.error;
   console.error = () => {};
   // ... teste ...
   console.error = consoleError;
   ```

5. **Testes de segurança:** Exigem Supabase local rodando. Consulte `src/__tests__/security/README.md` para setup detalhado.

### Exemplos de Testes Existentes

**Teste de hook com mock do Supabase** (`src/__tests__/hooks/useMembersQuery.test.ts`):

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getSession: vi.fn() },
    from: vi.fn(),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: any) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
}
```

**Teste de componente com ErrorBoundary** (`src/__tests__/components/ErrorBoundary.test.tsx`):

```typescript
it('deve renderizar fallback UI quando ocorre erro', () => {
  const consoleError = console.error;
  console.error = () => {};

  render(
    <ErrorBoundary>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  );

  expect(screen.getByText('Algo deu errado')).toBeInTheDocument();

  console.error = consoleError;
});
```

## Estado Atual dos Testes

| Diretório | Quantidade | Status |
|-----------|-----------|--------|
| `src/__tests__/smoke.test.tsx` | 2 testes | ✅ Ativos e passando |
| `src/__tests__/components/` | 1 arquivo, 5 testes | ✅ Ativos e passando |
| `src/__tests__/hooks/` | 1 arquivo, 7 testes | ✅ Ativos e passando |
| `src/__tests__/lib/` | 1 arquivo, 20 testes | ✅ Ativos e passando |
| `src/__tests__/security/` | 3 arquivos | ⚠️ Todos com `describe.skip` (placeholders) |
| `src/__e2e__/` | — | ⚠️ Vazio (estrutura criada) |
| `src/__integration__/` | — | ⚠️ Vazio (estrutura criada) |

### Observações sobre Testes de Segurança

Os testes em `src/__tests__/security/` estão escritos mas **skipped** (`describe.skip`). Eles exigem:

1. Supabase CLI instalado e rodando localmente (`supabase start`)
2. Usuários de teste com `church_id` diferentes nas tabelas `auth.users`
3. Variáveis de ambiente configuradas em um arquivo `.env.test`

Consulte o `README.md` dentro do diretório `src/__tests__/security/` para instruções detalhadas de configuração e execução.

## Cobertura

Atualmente **não há limite mínimo de cobertura configurado** no `vitest.config.ts`. O provider `@vitest/coverage-v8` está configurado e pronto para uso, mas nenhum threshold de aprovação/ reprovação foi definido.

Para adicionar thresholds, edite a seção `coverage` no `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  thresholds: {
    lines: 80,
    branches: 70,
    functions: 80,
    statements: 80,
  },
},
```

## CI/CD

Nenhuma integração contínua foi detectada no repositório (não há diretório `.github/workflows/`). Os testes são executados apenas localmente no momento.
