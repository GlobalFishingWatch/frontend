import { uniqBy } from 'lodash'
import { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
import { getAreasByDistance } from '@globalfishingwatch/ocean-areas'
import { Dataset } from '@globalfishingwatch/api-types'
import { MapCoordinates } from 'types'

export const CONTEXT_FEATURES_LIMIT = 5

type FilterFeaturesByCenterDistanceParams = {
  viewport: MapCoordinates
  uniqKey?: string
  limit?: number
}
export const filterFeaturesByDistance = (
  features: GeoJSONFeature[],
  {
    viewport,
    uniqKey = 'properties.id',
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
  return uniqBy(closerAreas, uniqKey).slice(0, limit)
}

export const parseContextFeatures = (features: any[], dataset: Dataset) => {
  const idProperty = dataset?.configuration?.idProperty || 'gfw_id'
  return features.map((feature) => {
    return {
      ...feature,
      promoteId: idProperty,
      datasetId: dataset.id,
      source: feature.source,
      properties: {
        ...feature.properties,
        gfw_id: feature.properties[idProperty],
      },
    }
  })
}
