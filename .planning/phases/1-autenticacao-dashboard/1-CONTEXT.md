# Contexto da Fase 1: Autenticação e Dashboard

**Phase:** 1
**Name:** Autenticação e Dashboard
**Created:** 2026-05-07

---

## Domínio

Sistema de autenticação seguro com dashboard estratégico.

**Requirements:** AUTH-01 até AUTH-08, DASH-01 até DASH-13 (21 requisitos)

---

## Decisões

### Layout do Dashboard

| Decisão | Detalhes |
|---------|----------|
| **Layout principal** | Grid responsivo — widgets organizados em grids que se adaptam a diferentes tamanhos de tela |
| **Widgets** | Cards de métricas no topo, Gráficos pequenos, Lista de activity, Mini calendário |
| **Ordenação** | Cards de KPIs no topo → Gráficos de tendência → Calendário → Activity feed |

### Fluxo de Registro

| Decisão | Detalhes |
|---------|----------|
| **Criação de usuários** | Somente Admin cria — máximo controle sobre quem acessa |
| **Recuperação de senha** | Código por e-mail — mais seguro que link |
| **Convites** | Admin gera usuários diretamente no painel admin |

### Autenticação Supabase

| Decisão | Detalhes |
|---------|----------|
| **Provedor** | Supabase Auth (já definido no stack) |
| **Método** | E-mail + senha |
| **MFA** | Opcional (futuro) — não implementar na v1 |

---

## Requisitos locked (da SPEC.md)

Nenhuma SPEC.md encontrada — requisitos vienen do ROADMAP.md.

---

## Canonical Refs

- `.planning/PROJECT.md` — Stack tecnológico definido
- `.planning/ROADMAP.md` — Fase 1, 21 requisitos
- `.planning/REQUIREMENTS.md` — AUTH-01 até AUTH-08, DASH-01 até DASH-13

---

## Pré-definidos

Nenhuma fase anterior — contexto limpo.

---

## Ideias Adiadas

- Auto-cadastro com aprovação — considerado mas rejeitado
- WhatsApp para recuperação — futuro V2
- Login social (Google) — futuro V2

---

*Created: 2026-05-07*
*Updated: 2026-05-07 after Fase 1 discussion*