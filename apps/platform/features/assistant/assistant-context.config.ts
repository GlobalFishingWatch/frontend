import type { AssistantContextModule, AssistantRouteId } from 'features/assistant/assistant-context'

const loadMap = () => import('features/_map/assistant/map-assistant-context')
const loadPlaces = () => import('features/_places/assistant/places-assistant-context')
const loadSearch = () =>
  import('features/_vessels/search/assistant/vessel-search-assistant-context')
const loadHelp = () => import('features/help/assistant/help-assistant-context')

export const ASSISTANT_CONTEXTS: Partial<
  Record<AssistantRouteId, () => Promise<AssistantContextModule>>
> = {
  '/_platform/_map': loadMap,
  '/_platform/_content/ports': loadPlaces,
  '/_platform/_content/areas/$placeType': loadPlaces,
  '/_platform/_content/vessel-search': loadSearch,
  '/_platform/_content/help-and-resources/': loadHelp,
  '/_platform/_content/help-and-resources/$sectionSlug/{-$itemSlug}': loadHelp,
}
