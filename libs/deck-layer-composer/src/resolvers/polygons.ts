import type { FeatureCollection } from 'geojson'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { findDatasetByType, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import type {
  LayerGroup,
  PolygonPickingObject,
  PolygonsLayerProps,
} from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from './types'

const resolvePolygonsData: DeckResolverFunction<PolygonsLayerProps['data']> = (
  dataview,
  { start, end }
) => {
  if (dataview.config?.data) {
    return dataview.config.data as FeatureCollection
  }
  const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.TemporalContext)
  if (!url) {
    console.warn('No url found for polygon resolver', dataview)
    return ''
  }
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.TemporalContext) as Dataset

  const datasetConfig = dataview.datasetsConfig?.find(
    (datasetConfig) => datasetConfig.datasetId === dataset.id
  )
  const dataUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
  const dataUrlWithDates = dataUrl
    .replace('start-date=', `start-date=${start}`)
    .replace('end-date=', `end-date=${end}`)
  return dataUrlWithDates
}

export const resolveDeckPolygonsLayerProps: DeckResolverFunction<PolygonsLayerProps> = (
  dataview,
  globalConfig
) => {
  return {
    id: dataview.id,
    data: resolvePolygonsData(dataview, globalConfig),
    pickable: dataview.config?.pickable ?? true,
    category: dataview.category!,
    subcategory: dataview.config?.type,
    color: dataview.config?.color as string,
    group: dataview.config?.group as LayerGroup,
    highlightedFeatures: globalConfig.highlightedFeatures as PolygonPickingObject[],
  }
}
