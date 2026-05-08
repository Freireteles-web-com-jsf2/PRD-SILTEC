# Siltec-Solutions | SGI

Sistema de Gestão Integrada para Igrejas e Ministérios

---

## Sobre

O **Siltec-Solutions** (SGI) é uma plataforma SaaS moderna de gestão eclesiástica desenvolvida para igrejas, ministérios e comunidades religiosas brasileiras.

## Funcionalidades Principais

- **Gestão de Membros** — Cadastro completo com filtros, histórico e timeline ministerial
- **Gestão Financeira** — Controle de dízimos, ofertas, entradas, saídas e relatórios
- **Eventos e Agenda** — Cadastro, calendário interativo e check-in
- **Departamentos e Ministérios** — Gestão ministerial com líderes e participantes
- **Escalas de Voluntários** — Coordenação de escalalas para cultos e eventos
- **Dashboard Inteligente** — KPIs estratégicos e alertas automáticos

### Histórico de Versões

- **v0.3** — Nova Identidade Visual (Dark Glassmorphism UI, Material Symbols, Manrope)

## Stack Tecnológico

| Categoria | Tecnologia |
|-----------|-------------|
| Frontend | Next.js 15, React 19, TypeScript, Manrope |
| Ícones | Material Symbols Outlined |
| Estilização | Tailwind CSS, Dark Glassmorphism UI |
| Backend | Supabase (PostgreSQL, Auth, Storage, RLS Multi-tenant) |
| Deploy | Vercel |

## Estrutura de Navegação

O sistema utiliza navegação lateral com as seguintes áreas:

- **Dashboard** — Visão geral com KPIs e alertas
- **Membros** — Gestão de cadastro e histórico ministerial
- **Financeiro** — Controle de dízimos, ofertas e relatórios
- **Eventos** — Agenda, calendário e check-in
- **Ministérios** — Departamentos e coordenação de líderes
- **Relatórios** — Análises e exportação de dados
- **Configurações** — Preferências e administração

## Getting Started

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

## Demonstração

Acesse http://localhost:3000 após executar `npm run dev`.

## Licença

MIT License

---

**Siltec-Solutions** — Gestão ministerial simplificada