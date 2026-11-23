# Assistant

The assistant is a chat panel in the side panel. `PlatformLayout` mounts the side panel, so the
assistant opens on every platform page: map, report, vessel profile, and the content pages
(`/vessel-search`, `/ports`, `/areas`, `/help-and-resources`, `/user`). It talks to `gfw-agent`
(`AGENT_BASE_URL/chat`) through the AI SDK `useChat` hook.

Two things depend on the page the user is on:

1. **What the agent knows about the page.** Each message carries a `requestContext`.
2. **What the page must do after the agent navigates.** Some state is not driven by the url once
   the page is mounted, so it must be set explicitly.

Both are defined per route in `assistant-context.config.ts`. A page has **one** context at most.

## Page context registry

```text
assistant-context.config.ts
┌──────────────────────────────────────────────────────────────┐
│ ASSISTANT_CONTEXTS: { [routeId]: () => import(module) }      │
│                                                              │
│  '/_platform/_map': () => import('features/_map/assistant/   │
│                                  map-assistant-context')     │
│                                                              │
│  '<another layout or route>': () => import(...)       ◄─ add │
└──────────────────────────────┬───────────────────────────────┘
                               │ loadPageContext(router.state.matches)
                               │ the deepest matched route with an entry wins,
                               │ no merging: one context per page
                               ▼
AssistantContextModule  (what the lazily loaded module exports)
┌──────────────────────────────────────────────────────────────┐
│ getContext(deps)          → keys added to requestContext     │
│ onNavigate?(search, deps) → state the url does not drive     │
│                                                              │
│ deps = { reduxStore, jotaiStore }                            │
└──────────────────────────────────────────────────────────────┘
```

Modules are dynamic imports and load on the first message only. This keeps map code (deck.gl,
map selectors) out of the assistant chunk on pages that have no map. The `assistant` check in
`scripts/load-boundaries/config.ts` enforces it, so **never import a context module statically**.

A module that fails to load or to run is skipped with a `console.warn`: a page context must never
block a message.

## Sending a message

```text
 user types                AssistantMessages            useAssistantSession.sendMessage
 ───────────► textarea ──► onSend() ──────────────────► │
                                                        │ getAssistantRequestContext(
                                                        │   router.state.matches, deps)
                                                        ▼
                                  ┌────────── loadPageContext ───────────┐
                                  │ the page's module, if it has one:    │
                                  │   module.getContext(deps)            │
                                  └──────────────────┬───────────────────┘
                                                     │ { ...context,
                                                     │   url: location.href }  ◄─ url always wins
                                                     ▼
                              POST /chat  { messages: [last], memory, requestContext }
                                                     │
                                                     ▼
                              gfw-agent (src/mastra/workspace-context.ts)
                              adds requestContext to the prompt, does not store it
```

On map routes, `map-assistant-context.getContext` returns:

- `workspace`: id, name, stored state and the visible dataview instances.
- `mapView`: what the map shows (layers in view, bounds, clicked feature, ocean area name).

The agent reads these keys by name. Rename one only together with `gfw-agent`. Content pages send
only `url`, because their url already holds their state.

## The agent navigates

The agent's `navigate` tool returns `{ navigation: { to, params, search }, alternatives? }`. `to`
must be one of `ROUTE_PATHS`. There are two paths into the same steps: the tool result arrives
(automatic), or the user clicks a navigate link in the message (manual).

```text
       tool result arrives                          user clicks NavigateToolLink
   (useAssistantSession effect,                     (AssistantMessages)
    once per toolCallId)                                     │
              │                                              │
              ▼                                              ▼
   markExplicitSettings(search)                   markExplicitSettings(search)
   map-specific: sets the timebar flag            │
   BEFORE navigating, so a report that            │
   mounts reads it                                │
              │                                   │
              ▼                                   ▼
   router.navigate(getNavigateToolLinkProps)      applyNavigatePageState(search)
   search: agent's search, minus tk and           runs BEFORE <Link> navigates:
   panels; the assistant panel stays open         matches are the CURRENT page's
              │                                   │
              ▼                                   ▼
   .then(applyNavigatePageState(search))          <Link> navigates
   matches are the TARGET page's
              │                                   │
              └─────────────────┬─────────────────┘
                                ▼
                applyAssistantNavigate(matches, search, deps)
                ┌──────────────── loadPageContext ─────────────────┐
                │ module?.onNavigate?.(search, deps)               │
                │ map: set timerange + camera on the mounted map   │
                └──────────────────────────────────────────────────┘
```

Why the manual path can use the current page's matches: `onNavigate` is only needed by a page that
is mounted now and stays mounted (map → map, where the url no longer drives the camera or the
timebar). A page that mounts on this navigation reads the url itself. From the map to a content
page, `onNavigate` sets state on a map that is about to unmount, which is harmless.

`isNavigateToolViewActive` decides the link label ("current view" against "go back"). On `/map`
and workspace routes it also compares the viewport, with a float-noise tolerance. Reports and
vessel profiles fit the camera themselves, so their url viewport is ignored.

## Adding a page

1. Create `features/<feature>/assistant/<feature>-assistant-context.ts` exporting
   `getContext(deps)` and, only if needed, `onNavigate(search, deps)`.
2. Add `'<routeId>': () => import('…')` to `ASSISTANT_CONTEXTS`. Under the map layout, the new
   entry replaces the map context on that route, so return the map keys too if the agent still
   needs them.
3. Add any new keys to `AssistantRequestContext` in `assistant-context.ts`, and make `gfw-agent`
   read them.
4. Run `pnpm nx run platform:check-load-boundaries`.

Skip all of this when the url already holds everything the agent needs.

## Files

| File                                      | Role                                                          |
| ----------------------------------------- | ------------------------------------------------------------- |
| `assistant-context.config.ts`             | route → context module registry                               |
| `assistant-context.ts`                    | types, `getAssistantRequestContext`, `applyAssistantNavigate` |
| `assistant-session.hooks.ts`              | `useChat` transport, send, feedback, navigate tool effect     |
| `navigate-tool.ts`                        | tool output schema, link props, active-view check             |
| `AssistantMessages.tsx`                   | message rendering, navigate links, input                      |
| `_map/assistant/map-assistant-context.ts` | map context: workspace, map view, `onNavigate`                |
