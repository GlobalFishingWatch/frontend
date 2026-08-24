# Code review

Review the current change for correctness, maintainability, and risk in this GFW frontend monorepo.

## Prefer built-in agents when available

If the user wants Bugbot / Security Review, suggest or run:

- `/review-bugbot` — automated bug finding on the current diff
- `/review-security` — security-focused review
- `/review` (Cursor built-in) — pick agents interactively

Use this command for a **manual** review when those agents are unavailable or the user wants repo-specific guidance.

## Focus areas

1. **Correctness** — matches intent; edge cases; error handling
2. **Platform patterns** — RTK Query / slices / selectors; TanStack Router routes; `.module.css`; `*.hooks.ts`
3. **Map/deck** — class-based deck.gl layers OK; watch picking, data loaders, and dataview resolution
4. **ui-components** — named exports; CSS modules; no drive-by API breaks
5. **Safety** — no secrets in diff; no force-push / destructive scripts; no exploit PoCs
6. **Tests** — Vitest coverage for non-trivial logic

## Output format

- One line per finding: `path:line — severity — problem — fix`
- Severities: `blocker` | `major` | `nit`
- End with a short verdict (approve / request changes)
