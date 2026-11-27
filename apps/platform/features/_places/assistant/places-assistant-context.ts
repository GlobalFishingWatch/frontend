import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'
import type { AssistantContextToolOutput } from '@globalfishingwatch/skills/context-tools'

import type { PlacesResult } from 'features/_places/places.types'
import type {
  AssistantContextModule,
  AssistantPageMatch,
} from 'features/assistant/assistant-context'

/**
 * /ports and /areas/$placeType: the list state, not the list itself. The query and filters are in
 * the url, the places are the agent's own lookup tools.
 */
function getPlacesPage(
  _deps: unknown,
  match: AssistantPageMatch
): AssistantContextToolOutput<'get_places_page'> | undefined {
  const result = match.loaderData as PlacesResult | undefined
  if (!result) return undefined
  const isPorts = match.routeId.endsWith('/ports')
  return {
    placeType: isPorts ? 'port' : (match.params.placeType as OceanAreaType),
    /** matches for the query and map filter, of `total` places of this type */
    count: result.count,
    total: result.total,
  }
}

export const tools: AssistantContextModule['tools'] = { get_places_page: getPlacesPage }
