# Arquitetura do Sistema

## Visão Geral

O Siltec-Solutions é uma aplicação web full-stack construída com Next.js 15 e Supabase.

## Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Páginas de autenticação
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/      # Páginas protegidas
│   │   └── dashboard/
│   ├── globals.css       # Estilos globais
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
├── hooks/                 # Hooks customizados
│   └── useAuth.tsx        # Autenticação
└── lib/                   # Bibliotecas
    └── supabase.ts        # Cliente Supabase
```

## Componentes de Layout

O sistema utiliza uma estrutura de layout com dois componentes principais em `src/components/layout/`:

### Sidebar (Sidebar.tsx)

Navegação lateral fixa com 280px de largura que fornece acesso a todas as áreas do sistema:
- Dashboard
- Membros
- Financeiro
- Eventos
- Ministérios
- Relatórios
- Configurações

Características:
- Logo da aplicação com branding
- Menu de navegação com highlight ativo
- Botão "Novo Registro" para ações rápidas
- Botão de logout
- Efeito glassmorphism com `glass-sidebar`

### TopBar (TopBar.tsx)

Barra superior fixa com 80px de altura que contém:
- Campo de busca global
- Botões de notificações, ajuda e perfil
- Efeito glassmorphism com `glass-topbar`

## Fluxo de Layout do Dashboard

O layout do dashboard é definido em `src/app/(dashboard)/layout.tsx` e segue esta estrutura:

```
┌─────────────────────────────────────────────────────────┐
│ Sidebar (w-72)  │  TopBar (h-20)                        │
│                 │─────────────────────────────────────────│
│  - Logo         │  [Search] [Notificações] [Ajuda] [Conta]│
│  - Nav Items    │─────────────────────────────────────────│
│  - Novo Registro│  children (conteúdo da página)        │
│  - Sair         │                                        │
└─────────────────────────────────────────────────────────┘
```

O layout envolve Sidebar + TopBar + children, com a Sidebar fixa à esquerda (w-72 = 288px) e o conteúdo principal com `ml-72` para respeitar a sidebar.

## Sistema de Identidade Visual

### CSS Custom Properties

O sistema define mais de 50 variáveis CSS em `src/app/globals.css` baseadas no Material Design 3 para o tema escuro:

| Categoria | Variáveis Principais |
|-----------|---------------------|
| Cores base | `--background`, `--foreground`, `--primary`, `--secondary`, `--tertiary` |
| Superfícies | `--surface-container-lowest` até `--surface-container-highest` |
| Texto | `--on-surface`, `--on-surface-variant`, `--on-primary` |
| Estados | `--error`, `--destructive`, `--outline`, `--outline-variant` |
| Containers | `--primary-container`, `--secondary-container`, `--tertiary-container` |

### Glassmorphism

Utilitários de glassmorphism para efeitos de profundidade:

```css
.glass       /* Fundo translúcido com blur 12px */
.glass-card  /* Cards com efeito glass */
.glass-sidebar /* Sidebar com blur 24px */
.glass-topbar /* TopBar com blur 12px */
```

Todos usam:
- Background: `rgba(30, 41, 59, 0.4)` (cinza azulado translúcido)
- Backdrop: `blur(12px)` ou `blur(24px)`
- Border: `1px solid rgba(255, 255, 255, 0.1)`

### Material Symbols Icons

O sistema utiliza **Material Symbols** do Google Fonts como biblioteca de ícones:
- Configuração: `font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`
- Tamanho padrão: 20px
- Uso: `<span className="material-symbols-outlined">icon_name</span>`

Ícones utilizados: `dashboard`, `group`, `payments`, `event`, `church`, `assessment`, `settings`, `search`, `notifications`, `help`, `account_circle`, `logout`

## Sistema de Cores Tailwind

O `tailwind.config.ts` define um sistema extensivo de cores para o tema escuro (35+ cores):

### Cores Principais
- `primary` (roxo): `#d0bcff` - Cor de destaque principal
- `secondary` (azul): `#c8d4fc` - Cor secundária
- `tertiary` (rosa): `#e8def8` - Cor terciária
- `error`: `#f2b8b5` - Estados de erro

### Cores de Superfície
- `surface`: Escalas de `--surface-container-lowest` até `--surface-container-highest`
- `surface-variant`: Superfícies alternativas
- `on-surface`, `on-surface-variant`: Texto sobre superfícies

### Outras Cores
- `border`, `input`, `ring`: Cores de borda e inputs
- `muted`, `accent`: Cores de estados muted
- `inverse-*`: Cores invertidas para contraste
- `outline`, `outline-variant`: Cores de outline

### Espaçamentos Customizados
- `margin`: 40px (margem principal)
- `gutter`: 24px (espaçamento entre colunas)
- `unit`: 4px (unidade base)
- `xs`, `sm`, `md`, `lg`, `xl`: Escalas de espaçamento

### Tipografia
- Fonte: Manrope (Google Fonts)
- Classes customizadas: `font-h1`, `font-h2`, `font-h3`, `font-body-lg`, `font-body-md`, `font-label-sm`

## Layout do Dashboard (Bento Grid)

O dashboard utiliza um sistema de **bento grid** com 12 colunas definido em `src/app/(dashboard)/dashboard/page.tsx`:

```tsx
<div className="grid grid-cols-12 gap-gutter">
  {/* Cards de KPI ocupan 3-4 colunas cada */}
  {/* Gráficos ocupam 6-8 colunas */}
  {/* Listas e alertas ocupam 4-6 colunas */}
</div>
```

O `gap-gutter` é de 24px, proporcionando espaçamento consistente entre os componentes do grid.

## Schema do Banco de Dados (Supabase)

O banco de dados PostgreSQL do Supabase foi definido nas migrações v0.2 com as seguintes tabelas principais:

### members

Tabela central de membros da igreja:
- `id` (UUID): Chave primária
- `church_id` (UUID): Identificador multi-tenant
- `name`, `birth_date`, `gender`, `marital_status`: Dados pessoais
- `phone`, `email`, `address`: Contato
- `baptism_date`, `conversion_date`: Datas religiosas
- `department_id`: Departamento/ministério principal
- `status`: Ativo/inativo
- `avatar_url`: Foto do membro

Indexes em `church_id` e `status` para queries multi-tenant.

### family_groups

Grupos familiares/unidades domésticas:
- `id` (UUID): Chave primária
- `church_id` (UUID): Multi-tenant
- `name`: Nome do grupo familiar
- `leader_id`: Referência ao membro líder
- `description`: Descrição
- Soft delete com `deleted_at`

### family_members

Tabela de junção N:N entre membros e grupos familiares:
- `church_id`: Multi-tenant
- `family_group_id`: Referência ao grupo familiar
- `member_id`: Referência ao membro
- `relationship`: Tipo de relacionamento (husband, wife, son, daughter, etc.)
- `is_primary_contact`: Apenas um membro pode ser contato primário por grupo
- Restrição UNIQUE em `(family_group_id, member_id)`

### member_timeline

Linha do tempo de eventos ministeriais:
- `church_id`: Multi-tenant
- `member_id`: Referência ao membro
- `event_type`: Tipo de evento (role_change, department_change, status_change, observation)
- `old_value`, `new_value`: Valores anterior e novo
- `effective_date`: Data de vigência
- Composite index em `(member_id, effective_date DESC)`

### member_attendances

Registro de presença em eventos:
- `church_id`: Multi-tenant
- `member_id`: Referência ao membro
- `event_id`: Referência ao evento (nullable)
- `status`: Presença (present, absent, justified)
- `check_in_time`, `check_out_time`: Horários de entrada/saída
- `justification`: Motivo da ausência (obrigatório se status=justified)
- UNIQUE em `(member_id, event_id)`

### member_roles

Histórico de atribuições de papéis RBAC:
- `church_id`: Multi-tenant
- `member_id`: Referência ao membro
- `role`: Papel atribuído (member, leader, treasurer, admin, super_admin)
- `department_id`: Departamento relacionado
- `is_active`: Se a atribuição está ativa
- `start_date`, `end_date`: Período de vigência
- `granted_by`: Quem concedeu o papel

## Sistema RBAC (Roles)

O sistema define 5 níveis de acesso em `supabase/migrations/20260508000004_create_role_enums.sql`:

| Role | Descrição |
|------|-----------|
| `member` | Membro comum - acesso básico apenas |
| `leader` | Líder de ministry/grupo - visualização e gerenciamento de membros |
| `treasurer` | Tesoureiro - acesso ao módulo financeiro |
| `admin` | Administrador - gerenciamento completo da igreja |
| `super_admin` | Super Administrador - acesso a todas as igrejas (multi-tenant) |

Os papéis são armazenados na tabela `member_roles` com histórico temporal (start_date, end_date), permitindo auditoria completa de atribuições de roles.

## Autenticação

O sistema usa **Supabase Auth** com:
- Login por e-mail e senha
- Recuperação de senha via código
- Middleware para proteção de rotas

## Banco de Dados

**Supabase** fornece:
- PostgreSQL como banco de dados principal
- Row Level Security (RLS) para multi-tenancy
- Autenticação integrada

## Dashboard

O dashboard exibe:
- Cards de KPIs (membros, convertidos, financeira, eventos)
- Gráficos de tendência
- Lista de próximos eventos
- Alertas e notifications
- Feed de atividade recente

## Fluxo de Autenticação

1. Usuário acessa `/login`
2. Insere e-mail e senha
3. Supabase Auth valida credenciais
4. Middleware verifica sessão
5. Redireciona para `/dashboard`

## Decisões de Design

| Decisão | Rationale |
|---------|-----------|
| Next.js 15 | App Router, Server Components, melhor performance |
| Supabase | Multi-tenant nativo, RLS, Realtime |
| Tailwind CSS | Desenvolvimento rápido, consistência visual |
| Shadcn/UI | Componentes acessíveis, customizáveis |

---

*Última atualização: 2026-05-08*