# Roadmap: Siltec-Solutions | SGI

**Created:** 2026-05-08
**Project:** Siltec-Solutions | SGI
**Core Value:** Plataforma de gestão ministerial completa que permite às igrejas brasileiras gerenciar sua administração de forma centralizada, segura e escalável

---

## Visão Geral: Milestone v0.1

| Metric | Value |
|--------|-------|
| **Phases** | 4 |
| **Requirements** | 19 |
| **Coverage** | 100% |

---

## Fase 1: Design Tokens & Fundação CSS

**Goal:** Configurar a paleta de cores, tipografia e estilos globais baseados no siltec-sgi.

**Mode:** development

**Success Criteria:**
1. Tailwind config atualizado com as cores do siltec-sgi.
2. Fonte Inter carregada e aplicada globalmente.
3. CSS global inclui resets, estilos de scrollbar e animações (fade-in, slide-in).
4. Variáveis de cores acessíveis via CSS e Tailwind.

**Requirements:** DTKN-01, DTKN-02, DTKN-03, DTKN-04

---

## Fase 2: Componentes Base de UI

**Goal:** Implementar os componentes de interface fundamentais como alicerce para as telas.

**Mode:** development

**Success Criteria:**
1. Componentes Card e StatCard funcionais e estilizados.
2. Componentes Button e Input com todas as variantes e estados.
3. Modal funcional com suporte a escape e overlay.
4. Componentes Table e Select prontos para uso com dados.
5. Avatar, Badge e Tabs implementados conforme a referência.

**Requirements:** COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06, COMP-07, COMP-08

---

## Fase 3: Layout e Navegação

**Goal:** Criar a estrutura de layout (Sidebar, Content Area) e navegação responsiva.

**Mode:** development

**Success Criteria:**
1. Sidebar fixa funcional com navegação por ícones Lucide.
2. Layout principal (Shell) com área de conteúdo responsiva.
3. Menu mobile (hamburger) funcional com overlay e transições.
4. Navegação entre rotas operando via Next.js App Router.

**Requirements:** LYOT-01, LYOT-02, LYOT-03, LYOT-04, SCRN-03

---

## Fase 4: Telas Fundacionais (Login & Shell)

**Goal:** Implementar as telas iniciais de Login e o Shell funcional do Dashboard.

**Mode:** development

**Success Criteria:**
1. Tela de Login implementada com a nova identidade visual.
2. Shell do Dashboard exibe KPI cards e área de atividades vazia.
3. Fluxo visual de navegação entre Login e Dashboard simulado/funcional.

**Requirements:** SCRN-01, SCRN-02

---

## Order of Operations

### Fase 1 → Design Tokens & Fundação CSS
**Dependencies:** Nenhuma

### Fase 2 → Componentes Base de UI
**Depends on:** Fase 1

### Fase 3 → Layout e Navegação
**Depends on:** Fase 1, Fase 2

### Fase 4 → Telas Fundacionais (Login & Shell)
**Depends on:** Fase 1, Fase 2, Fase 3

---
*Roadmap created: 2026-05-08*
*Milestone: v0.1 Design System & Identidade Visual*