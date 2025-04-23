import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes, EndpointId } from '@globalfishingwatch/api-types'
import { findDatasetByType, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type { BaseMapLabelsLayerProps, BaseMapLayerProps } from '@globalfishingwatch/deck-layers'
import { BasemapType } from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from './types'

export const resolveDeckBasemapLabelsLayerProps: DeckResolverFunction<BaseMapLabelsLayerProps> = (
  dataview
) => {
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.PMTiles) as Dataset
  const datasetConfig = dataview.datasetsConfig?.find(
    (datasetConfig) =>
      datasetConfig.endpoint === EndpointId.PmTiles ||
      datasetConfig.endpoint === EndpointId.ContextTiles
  )
  const tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string

  return {
    id: dataview.id,
    tilesUrl,
    category: dataview.category!,
    visible: dataview.config?.visible ?? true,
    locale: dataview.config?.locale,
  }
}

export const resolveDeckBasemapLayerProps: DeckResolverFunction<BaseMapLayerProps> = (dataview) => {
  return {
    id: dataview.id,
    category: dataview.category!,
    visible: dataview.config?.visible ?? true,
    basemap: (dataview.config?.basemap as BasemapType) || BasemapType.Default,
  }
}
