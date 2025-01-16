import type { MapCoordinates } from 'types'

import type { Dataset } from '@globalfishingwatch/api-types'
import type { ContextFeature } from '@globalfishingwatch/deck-layers'
import { getAreasByDistance } from '@globalfishingwatch/ocean-areas'

export const CONTEXT_FEATURES_LIMIT = 5

type FilterFeaturesByCenterDistanceParams = {
  viewport: MapCoordinates
  limit?: number
}
export const filterFeaturesByDistance = (
  features: ContextFeature[],
  {
    viewport,
    limit = CONTEXT_FEATURES_LIMIT,
  }: FilterFeaturesByCenterDistanceParams = {} as FilterFeaturesByCenterDistanceParams
) => {
  if (!features?.length || !viewport?.latitude || !viewport?.latitude) {
    return []
  }
  const featureCollection = {
    type: 'FeatureCollection' as const,
    features,
  }
  const closerAreas = getAreasByDistance(featureCollection, viewport)
  return closerAreas.slice(0, limit)
}

export const parseContextFeatures = (features: any[], dataset: Dataset) => {
  const idProperty = dataset?.configuration?.idProperty || 'gfw_id'
  return features.map((feature) => {
    return {
      ...feature,
      promoteId: idProperty,
      properties: {
        ...feature.properties,
        gfw_id: feature.properties[idProperty],
      },
    }
  })
}
