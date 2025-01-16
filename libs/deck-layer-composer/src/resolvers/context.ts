import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import {
  findDatasetByType,
  getDatasetConfiguration,
  resolveEndpoint,
} from '@globalfishingwatch/datasets-client'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import type {
  ContextLayerConfig,
  ContextLayerId,
  ContextLayerProps,
  ContextPickingObject,
} from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from './types'

export const resolveDeckContextLayerProps: DeckResolverFunction<ContextLayerProps> = (
  dataview,
  { highlightedFeatures }
) => {
  // TODO make this work for auxiliar layers
  // https://github.com/GlobalFishingWatch/frontend/blob/master/libs/dataviews-client/src/resolve-dataviews-generators.ts#L606
  const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.Context)
  if (!url) {
    console.warn('No url found for temporal context')
  }
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.Context) as Dataset
  const { idProperty, valueProperties } = getDatasetConfiguration(dataset)

  const layers = (dataview.config?.layers || [])?.flatMap((layer): ContextLayerConfig | [] => {
    const dataset = dataview.datasets?.find((dataset) => dataset.id === layer.dataset)
    const datasetConfig = dataview.datasetsConfig?.find(
      (datasetConfig) => datasetConfig.datasetId === layer.dataset
    )
    if (!dataset || !datasetConfig) {
      return []
    }

    const tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
    return {
      id: layer.id as ContextLayerId,
      datasetId: dataset.id,
      tilesUrl,
      filters: dataview.config?.filters,
    }
  })

  return {
    id: dataview.id,
    layers: layers,
    category: dataview.category!,
    color: dataview.config?.color as string,
    idProperty,
    valueProperties,
    highlightedFeatures: highlightedFeatures as ContextPickingObject[],
  }
}
