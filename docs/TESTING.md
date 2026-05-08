# Testing

## Visão Geral

Este documento descreve a estratégia de testes do projeto Siltec-SGI.

## Stack de Testes

> **Status**: As ferramentas de teste abaixo estão planejadas mas ainda não foram instaladas.

| Categoria |工具 | Status |
|-----------|------|--------|
| Unit | Vitest / Jest | Planejado |
| E2E | Playwright | Planejado |
| Component | Storybook | Planejado |

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

### Componentes de Identidade Visual

Os seguintes componentes devem ser testados quanto à consistência visual:

| Componente | Descrição |
|------------|-----------|
| Sidebar | Menu lateral com glassmorphism e navegação |
| TopBar | Barra superior com controles de usuário |
| Glass Cards | Cards com efeito de vidro (glassmorphism) |
| Dark Theme | Testes de contraste e cores no modo escuro |
| Material Symbols | Ícones e sua renderização correta |
| Bento Grid | Layout de grid para dashboards |

### Categorias de Teste Visual

- **Dark Theme UI**: Verificar contraste, legibilidade e consistência de cores no tema escuro
- **Material Symbols Icons**: Validação de ícones, tamaños e alinhamento
- **Bento Grid Layout**: Testes de responsividade e alinhamento do grid

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
| Visual Identity (Sidebar/TopBar) | 70% |
| Glassmorphism Components | 75% |
| Dark Theme UI | 80% |

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