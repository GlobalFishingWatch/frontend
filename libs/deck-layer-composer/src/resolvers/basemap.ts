import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes, EndpointId } from '@globalfishingwatch/api-types'
import {
  findDatasetByType,
  getDatasetConfiguration,
  resolveEndpoint,
} from '@globalfishingwatch/datasets-client'
import type {
  BaseMapImageLayerProps,
  BaseMapLabelsLayerProps,
  BaseMapLayerProps,
} from '@globalfishingwatch/deck-layers'
import { BasemapType } from '@globalfishingwatch/deck-layers'

import type { ResolvedDataviewInstance } from '../types/dataviews'
import type { DeckResolverFunction } from '../types/resolvers'

export function resolvePMTilesDatasetTilesUrl(dataview: ResolvedDataviewInstance) {
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.PMTiles) as Dataset
  if (!dataset) {
    throw new Error('Dataset not found for basemap image layer')
  }
  const { filePath } = getDatasetConfiguration(dataset, 'pmTilesV1')
  const datasetConfig = {
    endpoint: EndpointId.PMTiles,
    datasetId: dataset.id,
    query: [],
    params: [
      {
        id: 'file_path',
        value: filePath as string,
      },
    ],
  }
  return resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
}

export const resolveDeckBasemapLabelsLayerProps: DeckResolverFunction<BaseMapLabelsLayerProps> = (
  dataview
) => {
  const tilesUrl = resolvePMTilesDatasetTilesUrl(dataview)
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

export const resolveDeckBasemapImageLayerProps: DeckResolverFunction<BaseMapImageLayerProps> = (
  dataview
) => {
  const tilesUrl = resolvePMTilesDatasetTilesUrl(dataview)
  return {
    id: dataview.id,
    visible: dataview.config?.visible ?? true,
    tileSize: dataview.config?.tileSize as number,
    tilesUrl: tilesUrl as string,
    maxZoom: dataview.config?.maxZoom as number,
  }
}
