import { DatasetTypes, EndpointId } from '@globalfishingwatch/api-types'
import { getDatasetsExtent, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type {
  FourwingsDeckVectorSublayer,
  FourwingsPickingObject,
  FourwingsVectorsTileLayerProps,
} from '@globalfishingwatch/deck-layers'
import { getUTCDateTime } from '@globalfishingwatch/deck-layers'

import type { ResolvedFourwingsDataviewInstance } from '../types/dataviews'
import type { DeckResolverFunction } from '../types/resolvers'

import { getDataviewAvailableIntervals } from './dataviews'

export const resolveDeckVectorsLayerProps: DeckResolverFunction<
  FourwingsVectorsTileLayerProps,
  ResolvedFourwingsDataviewInstance
> = (
  dataview,
  { start, end, highlightedFeatures, debugTiles, vectorsTemporalAggregation }
): FourwingsVectorsTileLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity

  const datasets =
    dataview.datasets?.filter((dataset) => dataset.type === DatasetTypes.Fourwings) || []
  const { extentStart, extentEnd } = getDatasetsExtent<string>(datasets)

  const dataset = datasets?.[0]
  const sublayers: FourwingsDeckVectorSublayer[] = (dataview.datasetsConfig || [])?.map(
    (datasetConfig) => {
      return {
        id: dataview.id,
        color: dataview.config?.color || '#163f89',
        unit: dataset.unit,
        datasets: [datasetConfig.datasetId],
        direction: datasetConfig.datasetId.includes('uo') ? 'u' : 'v',
      }
    }
  )

  const availableIntervals = getDataviewAvailableIntervals(dataview)

  const tilesUrl = dataset
    ? resolveEndpoint(
        dataset,
        {
          datasetId: dataset.id,
          endpoint: EndpointId.FourwingsTiles,
          params: [
            {
              id: 'type',
              value: 'heatmap',
            },
          ],
        },
        { absolute: true }
      )
    : undefined

  return {
    id: dataview.id,
    startTime,
    endTime,
    category: dataview.category!,
    subcategory: dataview.config?.type,
    debugTiles,
    sublayers,
    maxZoom: dataview.config?.maxZoom,
    highlightedFeatures: highlightedFeatures as FourwingsPickingObject[],
    visible: dataview.config?.visible ?? true,
    availableIntervals,
    minVisibleValue: dataview.config?.minVisibleValue,
    maxVisibleValue: dataview.config?.maxVisibleValue,
    temporalAggregation: vectorsTemporalAggregation,
    ...(tilesUrl && { tilesUrl }),
    ...(extentStart && { extentStart: getUTCDateTime(extentStart).toMillis() }),
    ...(extentEnd && { extentEnd: getUTCDateTime(extentEnd).toMillis() }),
  }
}
