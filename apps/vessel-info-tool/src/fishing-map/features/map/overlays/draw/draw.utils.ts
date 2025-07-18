import type { Feature } from 'geojson'

import type { Dataset, DatasetConfiguration } from '@globalfishingwatch/api-types'
import { DatasetCategory, DatasetTypes,DRAW_DATASET_SOURCE } from '@globalfishingwatch/api-types'
import type { DrawFeatureType } from '@globalfishingwatch/deck-layers'

export const getDrawDatasetDefinition = (
  name: string,
  geometryType: DrawFeatureType
): Partial<Dataset> => {
  return {
    name,
    type: DatasetTypes.UserContext,
    category: DatasetCategory.Context,
    subcategory: 'user',
    unit: 'NA',
    source: DRAW_DATASET_SOURCE,
    configuration: {
      propertyToInclude: 'draw_id',
      format: 'geojson',
      geometryType,
    } as DatasetConfiguration,
  }
}

export const getFileWithFeatures = (name: string, features: Feature[]) => {
  const startingIndex = features.reduce((acc, feature) => {
    const featureIndex = feature.properties?.gfw_id
    return featureIndex && featureIndex > acc ? featureIndex : acc
  }, 1)
  return new File(
    [
      JSON.stringify({
        type: 'FeatureCollection',
        features: features.map((feature, index) => ({
          ...feature,
          properties: {
            ...(feature.properties || {}),
            gfw_id: feature.properties?.gfw_id || startingIndex + index,
            draw_id: feature.properties?.gfw_id || startingIndex + index,
          },
        })),
      }),
    ],
    `${name}.json`,
    {
      type: 'application/json',
    }
  )
}
