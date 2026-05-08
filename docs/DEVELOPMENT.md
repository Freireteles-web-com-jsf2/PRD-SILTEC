# Desenvolvimento

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento (http://localhost:3000) |
| `npm run build` | Build para produção |
| `npm run start` | Executar produção |
| `npm run lint` | Verificar lint |

## Stack de Desenvolvimento

- **Framework:** Next.js 15.1
- **Linguagem:** TypeScript 5.7
- **Runtime:** React 19.0
- **Estilização:** Tailwind CSS 3.4
- **Font:** Manrope (Google Fonts)
- **Ícones:** Material Symbols Outlined (Google Fonts)
- **Formulários:** React Hook Form + Zod
- **Gráficos:** Recharts

## Estrutura de Componentes

Os componentes seguem a estrutura do Next.js App Router:

```
src/app/
├── (auth)/           # Grupo de rotasauth
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (dashboard)/     # Grupo de rotas protegidas
│   ├── layout.tsx   # Layout com Sidebar + TopBar
│   └── dashboard/
└── layout.tsx        # Layout raiz (dark mode)
```

### Componentes de Layout

**Sidebar** (`src/components/layout/Sidebar.tsx`)
- Navegação lateral fixa com glassmorphism
- Menu de navegação com ícones Material Symbols
- Gerenciamento de estado decollapse

**TopBar** (`src/components/layout/TopBar.tsx`)
- Cabeçalho superior com busca e ações do usuário
- Integração com useAuth para informações do usuário
- Design glassmorphism

## Hooks Customizados

### useAuth

Localização: `src/hooks/useAuth.tsx`

Funcionalidades:
- `signIn(email, password)` — Login
- `signUp(email, password, name)` — Registro
- `signOut()` — Logout
- `resetPassword(email)` — Recuperação de senha
- `updatePassword(newPassword)` — Atualização de senha
- `user` — Usuário atual
- `session` — Sessão ativa
- `loading` — Estado de carregamento

## Estilos

### Sistema de Design Dark Glassmorphism

O arquivo `src/app/globals.css` contém:

**Variáveis CSS Custom Properties**
- Cores semânticas baseadas em HSL
- Paleta de cores Material Design 3 adaptada para dark mode
- Sistema de cores: primary, secondary, tertiary, surface, muted, accent
- Cores de estado: destructive, error

**Utilitários Customizados**
- `.glass` — Fundo com opacidade e blur para cards
- `.glass-sidebar` — Glassmorphism específico para sidebar
- `.glass-topbar` — Glassmorphism específico para topbar
- `.material-symbols-outlined` — Configuração de ícones Material

**Fontes Customizadas**
- `.font-h1`, `.font-h2`, `.font-h3` — Títulos
- `.font-body-lg`, `.font-body-md` — Corpo de texto
- `.font-label-sm` — Rótulos pequeños

### Configuração Dark Mode

O dark mode é habilitado via classe `dark` no elemento `html`:

```tsx
// src/app/layout.tsx
<html lang="pt-BR" className="dark">
```

O Tailwind está configurado com `darkMode: "class"` em `tailwind.config.ts`.

## Tailwind Design System

O arquivo `tailwind.config.ts` define:

**Cores Semânticas**
- `primary` — Cor principal (roxo lavanda)
- `secondary` — Cor secundária (azul claro)
- `tertiary` — Cor terciária (rosa)
- `surface` — Superfícies com variações (lowest, low, default, high, highest)
- `muted` — Cores suavizadas
- `accent` — Cor de destaque
- `destructive` — Estados de erro/perigo
- `error` — Cores de erro

**Fontes**
- `font-manrope` — Fonte principal configurada via CSS custom property

**Espaçamento**
- Sistema de spacing customizado (xs, sm, md, lg, xl, unit)

**Border Radius**
- Padrão, lg, xl, full

## Dashboard Layout Flow

O layout do dashboard em `src/app/(dashboard)/layout.tsx`:
1. Verifica autenticação via useAuth
2. Se não autenticado, redireciona para /login
3. Renderiza Sidebarfixa à esquerda
4. Renderiza TopBarno topo
5. Renderiza children como conteúdo principal

```
(min-h-screen)
├── Sidebar (fixed, ml-72)
└── Main (ml-72)
    ├── TopBar
    └── children (p-margin)
```

## Build

Para produção:

```bash
npm run build
npm run start
```

## Supabase

### Cliente

O cliente Supabase está em `src/lib/supabase.ts`:
- Usa `createBrowserClient` para o frontend
- Usa `createServerClient` no middleware para SSR

### AuthProvider

O `AuthProvider` em `src/hooks/useAuth.tsx` gerencia:
- Sessão do usuário
- Login/Logout
- Registro com metadados
- Atualização de senha

### Middleware

O `src/middleware.ts` faz:
- Verificação de autenticação em rotas protegidas
- Redirecionamento para /login
- Configuração de cookies

## Código

### Code Review

Correções aplicadas na Fase 1:
- Validação de variáveis de ambiente
- Tratamento de erros em insert
- Uso de Link do Next.js
- Router.replace ao invés de window.location