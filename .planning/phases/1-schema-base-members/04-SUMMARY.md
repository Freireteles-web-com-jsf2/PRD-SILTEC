# Summary: Plan 04 - Seed Data

**Plan:** 04
**Created:** 2026-05-08
**Status:** Complete

---

## Overview

| Metric | Value |
|--------|-------|
| **Tasks** | 1 |
| **Wave** | 2 |
| **Requirements** | N/A (development data) |

---

## What Was Built

Seed SQL file `supabase/seed.sql` com dados de teste:

**Família Silva (3 membros):**
- João Silva (head, married, primary contact)
- Maria Silva (wife)
- Pedro Silva (son)

**Família Santos (2 membros):**
- Paulo Santos (head, married, primary contact)
- Ana Santos (wife)

**Membro avulso:**
- Carlos Santos (single, sem família)

---

## Files Created

1. `supabase/seed.sql` — Dados de teste para desenvolvimento

---

## Key Decisions

- DO $$ ... $$ blocks para lógica procedural
- ON CONFLICT DO NOTHING paraidempotência (pode rodar múltiplas vezes)
- Church_id fixo para testes: 00000000-0000-0000-0000-000000000001
- Verifica se dados já existem antes de inserir (IF NOT EXISTS)

---

## Usage

```bash
# Via Supabase CLI (desenvolvimento local)
supabase db seed

# Via psql direto
psql $DATABASE_URL -f supabase/seed.sql

# Via Supabase Dashboard
# SQL Editor > Run query (copiar conteúdo do seed.sql)
```

---

## Notes

- NÃO usar em produção
- church_id deve ser substituído pelo UUID real do projeto
- Executar migrations primeiro (1 → 2 → 3)

---

*Summary created: 2026-05-08*