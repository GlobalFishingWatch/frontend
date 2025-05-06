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
  if (!dataset) {
    throw new Error('Dataset not found for basemap labels layer')
  }

  const datasetConfig = {
    endpoint: EndpointId.PMTiles,
    datasetId: dataset.id,
    query: [],
    params: [
      {
        id: 'file_path',
        value: dataset.configuration?.filePath as string,
      },
    ],
  }
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
