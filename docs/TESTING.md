# Testing

## Visão Geral

Este documento descreve a estratégia de testes do projeto Siltec-SGI.

## Stack de Testes

| Categoria |工具 |
|-----------|------|
| Unit | Vitest / Jest |
| E2E | Playwright |
| Component | Storybook |

## Testes Unitários

Os testes unitários devem cobrirt:

- Hooks customizados (`useAuth`)
- Funções utilitárias
- Validação de formulários

## Testes de Componentes

Storybook para desenvolvimento visual de componentes:

```bash
npm run storybook
```

## Testes E2E

Playwright para testes end-to-end:

```bash
npx playwright test
```

## Cobertura Esperada

| Módulo | Cobertura Mínima |
|--------|------------------|
| Auth | 80% |
| Dashboard | 70% |
| Forms | 75% |

## Executando Testes

```bash
# Unit tests
npm run test

# E2E
npm run test:e2e

# Com coverage
npm run test:coverage
```

---

*Testing guide: 2026-05-07*