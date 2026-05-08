---
status: issues_found
files_reviewed: 9
depth: standard
review_date: 2026-05-08
critical: 0
warning: 4
info: 6
total: 10
---

# Code Review Report

**Phase:** Initial Review
**Depth:** Standard
**Files Reviewed:** 9
**Status:** issues_found

---

## Critical Findings

*(none)*

---

## Warning Findings

### WR-01: Logout button has no click handler

**File:** `src/components/layout/Sidebar.tsx:58`
**Issue:** The "Sair" (logout) button calls no action. The `signOut` function is available from `useAuth()` but is never wired to the button's onClick.

**Fix:**
```tsx
import { useAuth } from '@/hooks/useAuth';

// Inside Sidebar component:
const { signOut } = useAuth();

// Change button to:
<button 
  onClick={signOut}
  className="w-full flex items-center gap-md text-error px-lg py-md hover:bg-error/10 rounded-xl transition-all"
>
```

---

### WR-02: "Remember me" checkbox state is unused

**File:** `src/app/(auth)/login/page.tsx:117-122`
**Issue:** The "Lembrar-me" checkbox is rendered and styled but its state is never captured or sent to the authentication provider. The checkbox functions as a no-op.

**Fix:**
```tsx
// Add state for remember me:
const [rememberMe, setRememberMe] = useState(false);

// Add to checkbox:
<input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
  className="w-4 h-4 text-primary border-border rounded focus:ring-primary bg-surface-container-low"
/>

// Pass rememberMe to signIn or handle it in onSubmit:
// Note: Supabase doesn't natively support "remember me" - this may require
// custom session handling to extend session duration
```

---

### WR-03: Search input has no onChange handler

**File:** `src/components/layout/TopBar.tsx:12-16`
**Issue:** The search input renders but has no `onChange` or `value` prop, making it non-functional. User input is not captured.

**Fix:**
```tsx
import { useState } from 'react';

// Inside TopBar:
const [searchQuery, setSearchQuery] = useState('');

// Update input:
<input
  className="w-full bg-surface-container-low border-none rounded-full pl-12 pr-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 text-body-md outline-none placeholder:text-on-surface-variant/50"
  placeholder="Pesquisar..."
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

// Optionally add search submission:
onKeyDown={(e) => {
  if (e.key === 'Enter') {
    // Handle search
  }
}}
```

---

### WR-04: Hardcoded calendar dates break functionality

**File:** `src/app/(dashboard)/dashboard/page.tsx:105-113`
**Issue:** The calendar grid renders hardcoded dates `[28,29,30,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]` instead of dynamically generating dates for the current month. The conditional logic (`n > 12 ? 'opacity-30' : ''`) treats numbers > 12 as "previous month" which is incorrect for a real calendar.

**Fix:**
Replace static array with dynamic date generation:
```tsx
// Generate calendar days for current month
const [currentDate] = useState(new Date());
const year = currentDate.getFullYear();
const month = currentDate.getMonth();
const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const daysInPrevMonth = new Date(year, month, 0).getDate();

// Build calendar grid
const calendarDays = [];
// Previous month days
for (let i = firstDay - 1; i >= 0; i--) {
  calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
}
// Current month days
for (let i = 1; i <= daysInMonth; i++) {
  calendarDays.push({ day: i, isCurrentMonth: true });
}
// Next month days
const remaining = 42 - calendarDays.length;
for (let i = 1; i <= remaining; i++) {
  calendarDays.push({ day: i, isCurrentMonth: false });
}
```

---

## Info Findings

### IN-01: Redundant inline styles alongside Tailwind classes

**File:** `src/app/(dashboard)/dashboard/page.tsx:74-77`
**Issue:** Bar heights are specified both via `h-[${bar.h1}%] ` className and via `style={{ height: \`${bar.h1}%\` }}`. The inline style overrides the className, making the Tailwind class redundant.

**Fix:**
```tsx
// Remove the redundant h-[...]% from className:
<div 
  className="w-full bg-primary/40 rounded-t-lg relative group" 
  style={{ height: `${bar.h1}%` }}
>
  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container text-label-sm p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
    R$ 12k
  </div>
</div>
```

---

### IN-02: Duplicate font loading

**File:** `src/app/globals.css:5` and `src/app/layout.tsx:20-21`
**Issue:** Google Fonts (Manrope) are loaded via `@import url(...)` in globals.css AND via `<link>` tags in layout.tsx. This causes the font to be fetched twice, impacting page load performance.

**Fix:**
Remove the @import from `globals.css` and keep only the `<link>` tags in `layout.tsx` (which is the better approach for font preloading):

```css
/* Remove from globals.css line 5: */
/* @import url('https://fonts.googleapis.com/...'); */
```

---

### IN-03: Duplicate glass utility classes

**File:** `src/app/globals.css:124-134`
**Issue:** `.glass` and `.glass-card` have identical CSS definitions (lines 124-128 and 130-134). Code duplication reduces maintainability.

**Fix:**
```css
/* Keep .glass and extend .glass-card from it */
.glass-card {
  @extend .glass;
  /* Any glass-card-specific overrides can go here */
}
```

---

### IN-04: Index-based keys in map functions

**File:** `src/app/(dashboard)/dashboard/page.tsx` (multiple locations: 38, 72, 102, 105, 120, 153)
**Issue:** Array maps use index (`i`) as key instead of stable identifiers. While not causing visible bugs for static arrays, this pattern causes React to re-render more than necessary when arrays are reordered or modified.

**Fix:**
Use stable identifiers where available:
```tsx
// Instead of: {activities.map((act, i) => (
<tr key={act.name + act.time}>  // Or a unique id property

// Instead of: {navItems.map((item) => (
<Link key={item.href} ...>  // href is already unique and stable
```

---

### IN-05: Type assertion limits future flexibility

**File:** `src/app/(dashboard)/dashboard/page.tsx:78`
**Issue:** The month labels array uses `as const` narrowing, which prevents dynamic month generation:
```tsx
<span className="font-label-sm text-on-surface-variant">
  {(['JAN','FEV','MAR','ABR','MAI','JUN'] as const)[i]}
</span>
```
This hardcodes 6 months and would break if the chart supported variable time ranges.

**Fix:**
Define months as a constant that can be derived dynamically:
```tsx
const MONTHS = ['JAN','FEV','MAR','ABR','MAI','JUN'];
```

---

### IN-06: Hardcoded color values override CSS variables

**File:** `src/app/globals.css:92-93`
**Issue:** The body has both Tailwind classes (`bg-background text-foreground`) AND hardcoded inline colors (`background-color: #0b1326; color: #dae2fd`). The hardcoded values will override the CSS variable-based Tailwind classes, making the design token system inconsistent.

**Fix:**
Remove hardcoded values and rely on Tailwind classes:
```css
body {
  @apply bg-background text-foreground;
  font-family: var(--font-manrope), system-ui, sans-serif;
}
```

---

## Summary

The codebase is well-structured with good separation of concerns (auth hooks, layout components, pages). The Material Design 3-inspired design system in Tailwind is comprehensive.

**No critical issues found.** The most concerning items are:
1. **Logout button is non-functional** — users cannot sign out via the sidebar
2. **Search input doesn't work** — the TopBar search is visual only
3. **Hardcoded calendar** — will show incorrect dates

These are functional gaps rather than security vulnerabilities or data loss risks. The auth pattern with Supabase is correctly implemented with proper cleanup in useEffect. Form validation with Zod is properly integrated.

---

## Files Reviewed

| File | Lines | Key Observations |
|------|-------|------------------|
| `src/app/globals.css` | 194 | Well-organized Tailwind layers; duplicate font import and hardcoded colors |
| `src/app/layout.tsx` | 28 | Clean root layout; font preloading via links |
| `src/app/(dashboard)/layout.tsx` | 45 | Auth guard pattern; good redirect logic |
| `src/app/(dashboard)/dashboard/page.tsx` | 183 | Static dashboard; hardcoded data and calendar; redundant inline styles |
| `src/app/(auth)/login/page.tsx` | 163 | Good form validation; unused "remember me" state |
| `src/components/layout/Sidebar.tsx` | 66 | Good navigation pattern; logout button non-functional |
| `src/components/layout/TopBar.tsx` | 30 | Search input non-functional (no onChange) |
| `tailwind.config.ts` | 138 | Comprehensive design system; custom spacing and colors |
| `src/hooks/useAuth.tsx` | 105 | Properly implemented auth context with Supabase; good cleanup |

---

_Reviewed: 2026-05-08T00:00:00Z_
_Reviewer: gsd-code-reviewer_
_Depth: standard_
