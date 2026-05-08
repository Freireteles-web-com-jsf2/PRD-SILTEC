---
status: issues_found
depth: standard
files_reviewed: 8
critical: 3
warning: 4
info: 3
total: 10
---

# Code Review: Módulo de Membros — Formulários e Funcionalidades

**Revisão:** 2026-05-08
**Arquivos revisados:** 8

---

## CR-1: RLS Bloqueia Todas as Operações (Crítico)

**Arquivo:** `supabase/migrations/20260508000009_enable_rls_helper_function.sql:11`
**Severidade:** Crítico

A função `get_current_church_id()` só verifica `church_id` no nível raiz do JWT, mas `supabase.auth.updateUser()` salva em `user_metadata.church_id`. Resultado: retorna `NULL`, RLS bloqueia tudo.

**Explicação:**
```sql
-- Só checa raiz do JWT e app.church_id
(current_setting('request.jwt.claims', true)::json->>'church_id')::uuid
-- Devia checar também user_metadata:
(current_setting('request.jwt.claims', true)::json->'user_metadata'->>'church_id')::uuid
```

**Fix:** Migration `20260508000014_fix_get_current_church_id.sql` criada. Aplicar SQL manual no Supabase Dashboard.

---

## CR-2: Nome de Coluna Errado — `type` vs `event_type` (Crítico)

**Arquivo:** `src/app/(dashboard)/membros/[id]/page.tsx:178`
**Severidade:** Crítico

```typescript
// ANTES (runtime error):
item.type.toUpperCase()  // type não existe no DB -> undefined -> crash

// DEPOIS (corrigido):
(item.event_type || item.type || 'evento').toUpperCase()
```

O banco tem coluna `event_type`, mas o código referencia `type` (nome do frontend). Já corrigido.

---

## CR-3: Interface TypeScript Não Corresponde ao Schema (Crítico)

**Arquivo:** `src/types/member.ts:44`
**Severidade:** Crítico

```typescript
// Interface atual (errada):
export interface MemberTimeline {
  type: 'cargo' | 'departamento' | 'status' | 'observacao'; // Não existe no DB
  // DB tem: event_type timeline_event_type (enums diferentes!)
}
```

A interface declara `type` mas o banco usa `event_type` com enum `timeline_event_type`. Isso causa:
- Erro em `item.type.toUpperCase()` (já corrigido no template)
- Perda de type safety — IDE não detecta o erro

**Fix:** Atualizar interface para espelhar o schema real.

---

## WR-1: Hook useMembers Não Reage a Mudanças de Autenticação

**Arquivo:** `src/hooks/api/useMembers.ts:56`
**Severidade:** Warning

```typescript
useEffect(() => {
  fetchMembers();
}, [search, status, departmentId, role]);
```

O hook executa a query imediatamente ao montar. Se o usuário não estiver autenticado ou o `church_id` não estiver no JWT, a query falha silenciosamente com erro RLS. Não há retry quando a sessão é atualizada.

---

## WR-2: Sem Paginação na Listagem de Membros

**Arquivo:** `src/app/(dashboard)/membros/page.tsx:105`
**Severidade:** Warning

```typescript
members.map((member) => ( ... ))
```

Carrega todos os membros de uma vez. Em igrejas com centenas/milhares de membros, isso causa:
- Lentidão no carregamento inicial
- Alto consumo de memória no frontend
- Queries grandes no Supabase (sem `.range()`)

**Fix:** Adicionar paginação com `.range(start, end)` no hook e controles na UI.

---

## WR-3: Link para Página de Edição Inexistente

**Arquivo:** `src/app/(dashboard)/membros/[id]/page.tsx:78`
**Severidade:** Warning

```tsx
<Link href={`/membros/${id}/editar`}>
  Editar
</Link>
```

A página `/membros/[id]/editar` não existe. Clica em "Editar" → 404.

---

## WR-4: Cast `any` Generalizado

**Arquivo:** `src/app/(dashboard)/membros/[id]/page.tsx:48,172`
**Severidade:** Warning

```tsx
const family = (member as any).family_members?.[0];
(member as any).member_timeline.map(...)
```

Os relacionamentos `family_members` e `member_timeline` não estão tipados no `Member`. Usar `as any` perde toda type safety e mascara erros como o CR-2.

---

## IN-1: Placeholder de CPF no Search sem Implementação

**Arquivo:** `src/app/(dashboard)/membros/page.tsx:48`
**Severidade:** Info

```tsx
placeholder="Buscar por nome, e-mail ou CPF..."
```

O placeholder menciona CPF mas a busca só filtra por `name` com `ilike`. CPF não está na query.

---

## IN-2: Sem Debounce na Busca

**Arquivo:** `src/hooks/api/useMembers.ts:30`
**Severidade:** Info

```typescript
if (search) {
  query = query.ilike('name', `%${search}%`);
}
```

Cada tecla digitada no campo de busca dispara uma nova requisição ao Supabase. Recomenda-se debounce de 300-500ms.

---

## IN-3: Campo `new_family_group_name` Enviado na Query Principal

**Arquivo:** `src/app/(dashboard)/membros/novo/page.tsx:51`
**Severidade:** Info

```typescript
const { new_family_group_name, family_group_id, ...memberData } = data;
```

O `new_family_group_name` é removido antes do insert, mas se o schema do `memberSchema` mudar e incluir novos campos auxiliares, eles podem vazar para o banco. Sugere-se usar `pick()` do Zod para extrair só os campos da tabela.

---

## Resumo

| Severidade | Quantidade | Status |
|-----------|-----------|--------|
| Crítico | 3 | 1 corrigido, 2 pendentes |
| Warning | 4 | Pendentes |
| Info | 3 | Pendentes |

**Próximos passos:**
1. Aplicar migration `20260508000014_fix_get_current_church_id.sql` no Supabase Dashboard
2. Corrigir interface `MemberTimeline` em `src/types/member.ts`
3. Criar página de edição `/membros/[id]/editar`
4. Adicionar paginação na listagem
