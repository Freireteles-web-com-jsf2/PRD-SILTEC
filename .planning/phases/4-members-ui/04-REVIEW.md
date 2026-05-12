---
phase: 4-members-ui
reviewed: 2026-05-12T15:30:00Z
depth: standard
files_reviewed: 10
files_reviewed_list:
  - src/app/(dashboard)/membros/page.tsx
  - src/app/(dashboard)/membros/novo/page.tsx
  - src/app/(dashboard)/membros/[id]/page.tsx
  - src/app/(dashboard)/membros/[id]/editar/page.tsx
  - src/hooks/api/useMembersQuery.ts
  - src/hooks/api/useMember.ts
  - src/hooks/api/useMembers.ts
  - src/hooks/api/useFamilyGroups.ts
  - src/types/member.ts
  - src/types/memberSchema.ts
findings:
  critical: 2
  warning: 10
  info: 3
  total: 15
status: issues_found
---

# Phase 4: Code Review Report — Members UI

**Reviewed:** 2026-05-12T15:30:00Z
**Depth:** standard
**Files Reviewed:** 10
**Status:** issues_found

## Summary

Reviewed 10 files comprising the members CRUD UI (list, create, profile, edit) along with data hooks and type definitions for a Next.js App Router + Supabase + React Query + Zod project.

**Key concerns:**
1. A **security vulnerability** — `super_admin` role is selectable from client-side dropdowns, creating a privilege escalation vector if RLS is not strictly enforced on `member_roles`.
2. A **data integrity bug** — `church_id` is required by the `Member` type but never set during create/update operations, causing potential DB insert failures.
3. **Architecture fragmentation** — Two parallel hook implementations exist (useState and React Query). The React Query hooks (`useMembersQuery.ts`) are tested but **completely unused** in production pages, while the pages use direct `supabase` calls that bypass automated cache invalidation and error handling.
4. **Silent data loss paths** — Family member linking operations in both create and edit flows lack error handling; failures are silently swallowed.

---

## Critical Issues

### CR-01: `super_admin` role selectable from client-side UI (privilege escalation risk)

**File:** `src/app/(dashboard)/membros/novo/page.tsx:305`
**File:** `src/app/(dashboard)/membros/[id]/editar/page.tsx:365`

**Issue:** Both the "Novo Membro" and "Editar Membro" pages offer `super_admin` as a selectable option in the role dropdown. The role value is submitted directly to the Supabase API via the client SDK (`supabase.from('member_roles').insert(...)`). There is no middleware, server-side validation, or authorization gate visible in this codebase that restricts who can assign `super_admin`. The only defense is RLS policies on the `member_roles` table — which are not verifiable from frontend code. If RLS is misconfigured or absent, any authenticated user who can reach these pages can escalate their privileges.

**Fix:** Either (a) gate the `super_admin` option behind an authorization check (only show it to current super admins), or (b) remove it from the client-side dropdown entirely and handle super admin assignment through a separate secure flow (e.g., server action or admin-only API route).

```tsx
// Example fix: conditionally render based on current user's role
<option value="admin">Administrador</option>
{/* Only show super_admin if current user has that role */}
{currentUserRole === 'super_admin' && (
  <option value="super_admin">Super Admin</option>
)}
```

### CR-02: Missing `church_id` in member create/update operations

**Files:**
- `src/app/(dashboard)/membros/novo/page.tsx:53-57`
- `src/app/(dashboard)/membros/[id]/editar/page.tsx:79-82`
- `src/types/member.ts:5` (type definition requiring `church_id`)

**Issue:** The `Member` interface requires `church_id: string`, but neither the create flow (`novo/page.tsx:53-57`) nor the update flow (`editar/page.tsx:79-82`) provides `church_id` in the Supabase insert/update payload. There is no middleware, no auth context provider, and no other hook that injects `church_id` anywhere in the codebase (grep confirms zero references outside the type definition). If the `members.church_id` column is `NOT NULL` without a database default, every member insert will fail with a constraint violation, and the user's form data will be lost after the error alert. Even if the database has a default, this is a type contract violation — the TypeScript type guarantees a value that the runtime never provides.

**Fix:** (Option A) Make `church_id` optional in the `Member` type if it is handled by a DB default or RLS. (Option B) Fetch the user's `church_id` from the Supabase session metadata and include it in the payload:

```ts
const session = await supabase.auth.getSession();
const churchId = session.data.session?.user?.app_metadata?.church_id;
const { error } = await supabase.from('members').insert([{ ...memberData, church_id: churchId }]);
```

---

## Warnings

### WR-01: React Query hooks in `useMembersQuery.ts` are entirely unused in production code

**File:** `src/hooks/api/useMembersQuery.ts` (all 223 lines)

**Issue:** The file exports `useMembers`, `useMember`, `useCreateMember`, `useUpdateMember`, and `useDeleteMember` — all built on `@tanstack/react-query` with proper cache invalidation (`queryClient.invalidateQueries`). However, **none of these are imported by any production page** (grep confirms zero production imports — only `src/__tests__/hooks/useMembersQuery.test.ts` references them). The pages instead import:
- `useMembers` from `src/hooks/api/useMembers.ts` (useState-based, no caching)
- `useMember` from `src/hooks/api/useMember.ts` (useState-based, no caching)
- Direct `supabase` calls with manual error handling embedded in page components

This means:
- The React Query cache invalidation logic never executes.
- Two parallel implementations must be maintained.
- The test coverage in `useMembersQuery.test.ts` validates code that ships to production but never runs.

**Fix:** Either (a) wire up the pages to use the React Query hooks (preferred — they handle caching, staleness, and refetching correctly), or (b) delete `useMembersQuery.ts` and its associated test file to eliminate dead code.

---

### WR-02: No error handling on `family_members` insert in `novo/page.tsx`

**File:** `src/app/(dashboard)/membros/novo/page.tsx:62-69`

**Issue:** After creating a member, the code inserts into `family_members` to link the member to a family group. The response from Supabase is **never checked for errors** — no `const { error } = await ...`, no `.select()`, no `error` check. If this insert fails (due to RLS violation, foreign key constraint, etc.), the member is created but the family linkage is silently lost. The user is redirected to `/membros` believing the operation succeeded.

```tsx
// Lines 62-69 — no error handling
await supabase
  .from('family_members')
  .insert([{ 
    member_id: member.id, 
    family_group_id: familyGroupId,
    relationship: 'membro' 
  }]);
```

**Fix:**
```tsx
const { error: familyError } = await supabase
  .from('family_members')
  .insert([{ 
    member_id: member.id, 
    family_group_id: familyGroupId,
    relationship: 'membro' 
  }]);

if (familyError) throw familyError;
```

---

### WR-03: No error handling on `family_members` update/insert in `editar/page.tsx`

**File:** `src/app/(dashboard)/membros/[id]/editar/page.tsx:86-103`

**Issue:** The same silent data loss pattern exists in the edit flow. The initial query on line 87-91 uses `.single()` which throws if no match (PGRST116) or multiple matches (PGRST116 already — single() expects exactly one row). The update/insert on lines 93-102 have no error checking. If the family member update fails, the member data is saved but the family linkage silently breaks.

**Fix:** Add error checking for each database operation and surface failures to the user:
```tsx
if (familyGroupId) {
  const { data: existing, error: fetchError } = await supabase
    .from('family_members')
    .select('id')
    .eq('member_id', id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

  if (existing) {
    const { error: updateError } = await supabase
      .from('family_members')
      .update({ family_group_id: familyGroupId })
      .eq('id', existing.id);
    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase
      .from('family_members')
      .insert([{ member_id: id, family_group_id: familyGroupId, relationship: 'membro' }]);
    if (insertError) throw insertError;
  }
}
```

---

### WR-04: `role` filter parameter silently ignored by both `useMembers` implementations

**Files:**
- `src/hooks/api/useMembers.ts:18,83`
- `src/hooks/api/useMembersQuery.ts:32,83`

**Issue:** Both `useMembers` hooks accept a `role` parameter and include it in `fetchMembers` dependency arrays (triggering unnecessary re-fetches when `role` changes), but **neither implementation adds a query filter for it**. The parameter is destructured, added to the query key / dependency array, but never applied via `.eq('role', role)` or any other filter method. Any caller passing `role` will believe they are filtering, when in fact the filter is silently ignored — all members are returned regardless of role.

**Fix:**
```ts
// In the query building section:
if (role) {
  // Filter members who have an active role matching the criteria
  query = query.contains('member_roles', JSON.stringify([{ role, is_active: true }]));
  // OR: use a Supabase join filter pattern appropriate for the schema
}
```

Alternatively, remove the `role` parameter from the interface and implementation if role filtering is not yet supported.

---

### WR-05: All requests debounced equally (search + pagination + filters) causing UX sluggishness

**File:** `src/hooks/api/useMembers.ts:94`

**Issue:** The debounce condition `search !== undefined ? DEBOUNCE_MS : 0` is effectively **always 400ms** because `search` defaults to `''` (a string, never `undefined`). This means page navigation, status filter changes, and every other filter adjustment are all delayed by 400ms, not just search input. The debounce intention was clearly to only debounce when there's an active search query.

```ts
// Line 94 — always 400ms because search is '' not undefined
debounceRef.current = setTimeout(() => {
  fetchMembers();
}, search !== undefined ? DEBOUNCE_MS : 0);
```

**Fix:**
```ts
// Only debounce when search has actual content
const debounceDelay = search && search.trim() ? DEBOUNCE_MS : 0;
debounceRef.current = setTimeout(() => {
  fetchMembers();
}, debounceDelay);
```

---

### WR-06: Pagination count fallback uses `data.length` instead of 0, showing wrong totals

**File:** `src/hooks/api/useMembers.ts:71`

**Issue:** When Supabase returns `count: null` (which is technically possible despite `{ count: 'exact' }`), the code falls back to `data?.length`, which is the number of items on the **current page** (max 50), not the total matching count. If this fallback ever triggers, the pagination text "Mostrando X-Y de Z" would show `Z = 50` when there could be hundreds of members.

```ts
setTotal(count ?? data?.length ?? 0);
// If count is null and data has 50 items: total = 50 (wrong)
```

**Fix:**
```ts
setTotal(count ?? 0);
// If count is null: total = 0 (conservative, won't mislead pagination)
```

---

### WR-07: `useMember` (useState version) doesn't handle undefined `id` — causes infinite loading spinner

**File:** `src/hooks/api/useMember.ts:12-14`

**Issue:** When `id` is `undefined` (first render of `[id]/page.tsx` before `useParams()` resolves, or if the param is missing), the `useEffect` returns early at `if (!id) return;` without setting `loading` to `false`. Since `loading` starts as `true`, the component renders the loading spinner indefinitely. The React Query version (`useMembersQuery.ts:214`) handles this correctly with `enabled: !!id`.

Note: In Next.js App Router, `useParams()` never returns `undefined` for dynamic route params — it returns the param or throws. However, the hook should still handle this defensively.

**Fix:**
```ts
useEffect(() => {
  if (!id) {
    setLoading(false);
    return;
  }
  // ...rest of fetch logic
}, [id]);
```

---

### WR-08: Edit form doesn't pre-populate `family_group_id`

**File:** `src/app/(dashboard)/membros/[id]/editar/page.tsx:57`

**Issue:** The `reset()` call in the edit form always sets `family_group_id: ''`, regardless of the member's existing family group linkage. The user must manually re-select their family group every time they edit their profile. This is a UX regression from not mapping `member.family_members[0]?.family_groups?.id` to the form field.

**Fix:**
```ts
reset({
  // ...other fields
  family_group_id: member.family_members?.[0]?.family_groups?.id || '',
  // ...other fields
});
```

---

### WR-09: Unused icon imports in `novo/page.tsx`

**File:** `src/app/(dashboard)/membros/novo/page.tsx:15-16`

**Issue:** `MapPin` and `Church` icons are imported from `lucide-react` but never referenced anywhere in the JSX. These unused imports add to bundle size and create noise.

**Fix:** Remove the unused imports:
```tsx
import { 
  ArrowLeft, 
  Save, 
  User, 
  Users, 
  Plus,
  Award,
  Loader2
} from 'lucide-react';
```

---

### WR-10: `useMember` in `useMembersQuery.ts` lacks auth session check (inconsistent with sibling hook)

**File:** `src/hooks/api/useMembersQuery.ts:190-195`

**Issue:** The `useMembers` function in the same file checks `supabase.auth.getSession()` before making the query and returns `{ members: [], total: 0 }` if no session exists. However, `useMember` (line 190) does not perform this check — it goes straight to the Supabase query. While RLS will reject the unauthenticated request, this is an inconsistency that could lead to confusing error messages.

**Fix:**
```ts
const fetchMember = async (): Promise<Member> => {
  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    throw new AuthenticationError();
  }
  // ...rest of fetch
};
```

---

## Info

### IN-01: `useFamilyGroups` effect missing dependency

**File:** `src/hooks/api/useFamilyGroups.ts:45-47`

**Issue:** `useEffect(() => { fetchGroups(); }, [])` references `fetchGroups` which is defined inside the hook but not listed in the dependency array. While it works correctly (runs once on mount because `fetchGroups` is not in deps), this pattern violates React's `exhaustive-deps` rule and may cause stale closures if the component re-renders with new props.

**Fix:** Either inline the fetch logic inside the effect, or add `fetchGroups` to the dependency array (with `useCallback` wrapping `fetchGroups`).

---

### IN-02: `console.error` in production catch blocks — should use `logError` utility

**Files:**
- `src/app/(dashboard)/membros/novo/page.tsx:85`
- `src/app/(dashboard)/membros/[id]/editar/page.tsx:127`
- `src/hooks/api/useMembers.ts:74`

**Issue:** Error catch blocks log directly with `console.error` instead of using the application's `logError` utility from `@/lib/errors`. The existing `logError` function already provides environment-conditional logging and a hook point for monitoring services (Sentry, LogRocket). Direct `console.error` bypasses this.

**Fix:**
```ts
import { logError } from '@/lib/errors';
// ...
catch (error: any) {
  logError(error, { context: 'createMember' });
  // ...
}
```

---

### IN-03: Hardcoded `pageSize = 50` in list page

**File:** `src/app/(dashboard)/membros/page.tsx:24`

**Issue:** Page size is hardcoded as a local `const` inside the component. Consider extracting to a configuration constant or making it configurable.

**Fix:**
```ts
// In a constants file or configuration
export const MEMBERS_PAGE_SIZE = 50;
```

---

## Architecture Note: Hook Duplication

Beyond individual findings, the presence of two parallel hook implementations for the same data operations indicates **incomplete migration to React Query**:

| Hook | Location | Pattern | Used by |
|------|----------|---------|---------|
| `useMembers` | `useMembers.ts` | `useState` + `useEffect` | `membros/page.tsx` |
| `useMembers` | `useMembersQuery.ts` | `@tanstack/react-query` | **Nowhere in production** |
| `useMember` | `useMember.ts` | `useState` + `useEffect` | `[id]/page.tsx`, `[id]/editar/page.tsx` |
| `useMember` | `useMembersQuery.ts` | `@tanstack/react-query` | **Nowhere in production** |
| Create/Update/Delete | Embedded in page code | Direct `supabase` calls | `novo/page.tsx`, `editar/page.tsx` |
| Create/Update/Delete | `useMembersQuery.ts` | `@tanstack/react-query` + cache invalidation | **Nowhere in production** |

The React Query versions have test coverage (`useMembersQuery.test.ts`), properly handle loading/error states, and include automatic cache invalidation — they are architecturally superior but entirely disconnected from the UI. This should be resolved by either completing the migration or removing the dead code.

---

_Reviewed: 2026-05-12T15:30:00Z_
_Reviewer: gsd-code-reviewer_
_Depth: standard_
