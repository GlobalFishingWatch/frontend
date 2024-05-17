import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { PolygonsLayerProps } from '@globalfishingwatch/deck-layers'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import { findDatasetByType, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { DeckResolverFunction } from './types'

export const resolveDeckPolygonsLayerProps: DeckResolverFunction<PolygonsLayerProps> = (
  dataview,
  { start, end }
) => {
  const { url } = resolveDataviewDatasetResource(dataview, DatasetTypes.TemporalContext)
  if (!url) {
    console.warn('No url found for temporal context')
  }
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.TemporalContext) as Dataset

  const datasetConfig = dataview.datasetsConfig?.find(
    (datasetConfig) => datasetConfig.datasetId === dataset.id
  )
  const dataUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
  const dataUrlWithDates = dataUrl
    .replace('start-date=', `start-date=${start}`)
    .replace('end-date=', `end-date=${end}`)

  return {
    id: `${dataview.id}-polygons`,
    dataUrl: dataUrlWithDates,
    category: dataview.category!,
    color: dataview.config?.color!,
  }
}
