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

*Última atualização: 2026-05-07*