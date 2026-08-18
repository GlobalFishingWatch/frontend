# Routing architecture (TanStack Router + Redux bridge)

This app migrated from `redux-first-router` to **TanStack Router + TanStack Start**. TanStack
Router is the single source of truth for the URL. A thin, **one-way** bridge mirrors the router's
location into Redux so the large body of existing code that reads location from the store keeps
working.

## Decision

Keep Redux as a read-only mirror of router state rather than rewriting ~40 `selectLocation*`
selectors and their consumers in one pass. This is an **intentional, stable end state**, not a
half-finished migration — splitting that rewrite out keeps the migration reviewable and avoids a
risky big-bang change.

## How it works

- `router-sync.ts` — `setupRouterSync(router, store)` subscribes to the router and dispatches
  `setLocation` on `onBeforeNavigate` (so layout sees the new location before render) and clears
  the history-navigation flag on `onResolved`. Wired in `routes/_app.tsx` via `useEffect`; the
  returned teardown **must** run on unmount (the router singleton is long-lived — leaking
  subscribers stacks duplicates).
- `location.slice.ts` — the mirrored location shape (`type`, `payload`, `query`, `pathname`,
  `to`, `prev`), bridging the legacy `redux-first-router` payload format and TanStack paths.
- `routes.search.ts` — Zod schemas + per-route `validateSearch`; URL (de)serialization in
  `router.tsx` reuses `parseWorkspace` / `stringifyWorkspace`.
- `router-ref.ts` — module singleton holding the router for the few genuinely
  outside-React call sites; prefer `useRouter()` inside components.

## Invariants — do not break

1. **Sync stays one-way (router → Redux).** Never dispatch `setLocation` to drive navigation;
   navigate via the router (`useRouter().navigate`) and let the bridge mirror it. A reverse sync
   reintroduces the feedback loops this design avoids.
2. **`setupRouterSync`'s teardown must be called on unmount.**
3. The `lastDispatchedHref` dedup guard exists because viewport/timebar updates fire rapid
   same-URL events — keep it.
