# Assistant

The assistant is a chat panel in the side panel. `PlatformLayout` mounts the side panel, so the
assistant opens on every platform page: map, report, vessel profile, and the content pages
(`/vessel-search`, `/ports`, `/areas`, `/help-and-resources`, `/user`). It talks to `gfw-agent`
(`AGENT_BASE_URL/chat`) through the AI SDK `useChat` hook.

Two things depend on the page the user is on:

1. **What the agent can read about the page.** The agent asks for it with _context tools_, which
   the browser answers from its stores, only when the agent needs them.
2. **What the page must do after the agent navigates.** Some state is not driven by the url once
   the page is mounted, so it must be set explicitly.

Both are defined per route in `assistant-context.config.ts`.

## Page context registry

```text
assistant-context.config.ts
┌──────────────────────────────────────────────────────────────────────┐
│ ASSISTANT_CONTEXTS: { [routeId]: () => import(module) }              │
│                                                                      │
│  '/_platform/_map'                          → map tools              │
│  '/_platform/_map/map/$category/'           → workspaces list        │
│  '…/vessel/$vesselId' (both)                → vessel profile         │
│  '…/report/…' (both)                        → area report            │
│  '…/vessel-group-report/$vesselGroupId'     → vessel group report    │
│  '…/ports/$portId', '…/ports-report/$portId'→ port report            │
│  '/_platform/_content/ports', '…/areas/…'   → places                 │
│  '/_platform/_content/vessel-search'        → vessel search          │
│  '/_platform/_content/help-and-resources/…' → help                   │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ loadPageContexts(router.state.matches)
                               │ EVERY matched route with an entry, parent first:
                               │ a vessel profile gets the map tools AND its own
                               ▼
AssistantContextModule  (what the lazily loaded module exports)
┌──────────────────────────────────────────────────────────────────────┐
│ tools: { get_x(deps, match) → what the page shows }                  │
│ onNavigate?(search, deps)    → state the url does not drive          │
│                                                                      │
│ deps = { reduxStore, jotaiStore }                                    │
└──────────────────────────────────────────────────────────────────────┘
```

Modules are dynamic imports. This keeps map, vessel and report code out of the assistant chunk on
pages that do not have it. The `assistant` check in `scripts/load-boundaries/config.ts` enforces
it, so **never import a context module statically**.

A module that fails to load, or a tool that throws, is skipped with a `console.warn`: it must
never break the chat. A tool **never fetches** (except `get_user_resources`): it returns what the
page shows, from redux, jotai or the RTK Query cache. Data the page has not loaded comes back as
`{ status: 'loading' }`, and a tool with no data here as `{ available: false }`.

## Sending a message and answering context tools

```text
 user types ──► useAssistantSession.sendMessage({ text })
                      │
                      ▼ prepareSendMessagesRequest (every request, continuations too)
                POST /chat { messages: [last], memory,
                             requestContext: { url, contextTools } }
                      │       contextTools = the matched modules' tool names
                      ▼
                gfw-agent: decodes the url into the prompt, lists contextTools
                      │
       model calls a context tool (a Mastra clientTool: no server execute)
                      │ the run stops, the stream ends on the call
                      ▼
                useChat onToolCall ──► runAssistantContextTool(name, matches, deps)
                      │                 └─ the matched module that has the tool
                      ▼
                addToolOutput ──► sendAutomaticallyWhen(shouldSendContextToolOutputs)
                      │
                      ▼
                POST /chat { messages: [the assistant message with the outputs], … }
                gfw-agent resumes the run with them and answers
```

Each lookup costs one more request and model step, so the agent only calls the tools a question
needs. `requestContext` is computed per request, so after `navigate` the continuation already
carries the new url and tools. `shouldSendContextToolOutputs` only resends for context tools:
`navigate` runs on the server. It stops after `MAX_CONTEXT_TOOL_CALLS_PER_TURN` calls in one turn.

gfw-agent leaves context tool outputs of earlier turns out of the prompt (they are a stale
snapshot), so the agent calls a tool again when a later message needs it.

## Context tools

Names and descriptions (what the model reads about each output) live in
`@globalfishingwatch/skills/context-tools` (`libs/skills`), shared with gfw-agent, so a
change reaches the agent only after a skills release and a version bump there.

| Page                | Tools                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| any map route       | `get_workspace`, `get_map_view`, `get_clicked_feature`                                                        |
| workspaces list     | `get_workspaces_list`                                                                                         |
| vessel profile      | `get_vessel_identity`, `get_vessel_activity`, `get_vessel_areas`, `get_vessel_related`, `get_vessel_insights` |
| area report         | `get_report_area`, `get_report_activity`, `get_report_vessels`, `get_report_events`                           |
| vessel group report | `get_vessel_group`, `get_vessel_group_insights`, `get_report_activity`, `get_report_vessels`, `get_report_events` |
| port report         | `get_port_report`, `get_report_events`                                                                        |
| ports / areas       | `get_places_page` (list state only: the agent has its own place lookup)                                       |
| vessel search       | `get_vessel_search_results`                                                                                   |
| help hub            | `get_help_page`                                                                                               |
| every page          | `get_user_resources`: the user's workspaces, datasets, vessel groups and reports, fetched when asked          |

`get_report_activity`, `get_report_vessels` and `get_report_events` live in
`_reports/assistant/report-assistant-tools.ts` and are spread into each report module. In a time
comparison graph `get_report_activity` returns the totals the report shows
(`getTimeComparisonTotals`, shared with `ReportActivityComparisonTotals`), never a cut of the
timebar range. Event summaries (`getSingleEventSummary`, in the map module) are shared by
`get_clicked_feature` and the vessel profile `latestEvents`. Modules get the route match as a second argument, so they
read `match.params`, `match.search` and `match.loaderData` instead of fetching.

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
                ┌─────────────── loadPageContexts ─────────────────┐
                │ the matched module with onNavigate(search, deps) │
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
   `tools: AssistantContextModule['tools']` and, only if needed, `onNavigate(search, deps)`.
2. Add `'<routeId>': () => import('…')` to `ASSISTANT_CONTEXTS`. Under the map layout the map
   tools come along on their own.
3. A new tool goes in `ASSISTANT_CONTEXT_TOOLS` (`libs/skills/src/context-tools`) with a description
   of its output. Then release skills and bump it in gfw-agent.
4. Run `pnpm nx run platform:check-load-boundaries`.

Skip all of this when the url already holds everything the agent needs.

## Files

| File                                                    | Role                                                                                                        |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `assistant-context.config.ts`                           | route → context module registry                                                                             |
| `assistant-context.ts`                                  | `isAssistantContextTool`, `getAssistantRequestContext`, `runAssistantContextTool`, `applyAssistantNavigate` |
| `assistant-session.hooks.ts`                            | `useChat` transport, context tool loop, feedback, navigate effect                                           |
| `navigate-tool.ts`                                      | tool output schema, link props, active-view check                                                           |
| `AssistantMessages.tsx`                                 | message rendering, navigate links, tool chips, input                                                        |
| `_map/assistant/map-assistant-context.ts`               | map tools, `onNavigate`                                                                                     |
| `_map/workspaces-list/assistant/…`                      | workspaces list                                                                                             |
| `_vessels/vessel/assistant/vessel-assistant-context.ts` | vessel profile                                                                                              |
| `_reports/assistant/report-assistant-tools.ts`          | vessels table and events tools shared by the reports                                                        |
| `_reports/report-{area,vessel-group,port}/assistant/…`  | each report                                                                                                 |
| `_places/…`, `_vessels/search/…`, `help/…` `assistant/` | content pages                                                                                               |
| `_user/assistant/user-assistant-context.ts`             | `get_user_resources`                                                                                        |
