import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'

import type { PlacesResult } from 'features/_places/places.types'
import type { AssistantContextDeps, AssistantPageMatch } from 'features/assistant/assistant-context'

export async function getContext(_deps: AssistantContextDeps, match: AssistantPageMatch) {
  const result = match.loaderData as PlacesResult | undefined
  if (!result) return undefined
  const isPorts = match.routeId.endsWith('/ports')
  return {
    page: {
      type: isPorts ? ('ports' as const) : ('areas' as const),
      placeType: isPorts ? 'port' : (match.params.placeType as OceanAreaType),
      /** matches for the query and map filter, of `total` places of this type */
      count: result.count,
      total: result.total,
      /** the first page of matches, in list order */
      places: result.places.map(({ id, name, flag }) => ({ id, name, ...(flag && { flag }) })),
    },
  }
}

export type PlacesAssistantContext = NonNullable<Awaited<ReturnType<typeof getContext>>>
