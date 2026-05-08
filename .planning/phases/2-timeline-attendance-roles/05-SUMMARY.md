# Summary: Plan 05 - Events Table

**Plan:** 05
**Created:** 2026-05-08
**Status:** Complete

---

## Overview

| Metric | Value |
|--------|-------|
| **Tasks** | 1 |
| **Wave** | 2 |
| **Requirements** | ATTD-02 (event reference) |

---

## What Was Built

Tabela `events` em `supabase/migrations/20260508000008_create_events.sql`:

Estrutura básica para referenciar em member_attendances:
- id (UUID, PK)
- church_id (multi-tenant)
- title, description, event_type
- start_date / end_date (timing)
- location, is_online, online_link (localização)
- capacity, registered_count
- department_id (organização)
- status (scheduled, ongoing, completed, cancelled)
- Audit: created_by, created_at, updated_at, deleted_at

Índices:
- church_id, start_date, status, department_id

**Nota:** Expandida em v0.4 - Events

---

*Summary created: 2026-05-08*