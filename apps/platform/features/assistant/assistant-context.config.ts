import type { AssistantContextEntry } from 'features/assistant/assistant-context'

/**
 * What the assistant sends about each page. Every entry whose route is matched applies, so a
 * route nested in another adds its context next to its parent's. Modules load on the first
 * message only, so none of their code reaches the assistant chunk (scripts/load-boundaries).
 */
export const ASSISTANT_CONTEXTS: AssistantContextEntry[] = [
  {
    // map, reports and vessel profiles: every route under the map layout
    routeId: '/_platform/_map',
    load: () => import('features/_map/assistant/map-assistant-context'),
  },
]
