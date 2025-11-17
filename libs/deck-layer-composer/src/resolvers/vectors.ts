import { DatasetTypes, EndpointId } from '@globalfishingwatch/api-types'
import { getDatasetsExtent, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type {
  FourwingsDeckVectorSublayer,
  FourwingsPickingObject,
  FourwingsVectorsTileLayerProps,
  FourwingsVisualizationMode,
} from '@globalfishingwatch/deck-layers'
import { getUTCDateTime } from '@globalfishingwatch/deck-layers'

import type { ResolvedFourwingsDataviewInstance } from '../types/dataviews'
import type { DeckResolverFunction } from '../types/resolvers'

import { getDataviewAvailableIntervals } from './dataviews'

export const resolveDeckVectorsLayerProps: DeckResolverFunction<
  FourwingsVectorsTileLayerProps,
  ResolvedFourwingsDataviewInstance
> = (dataview, { start, end, highlightedFeatures }): FourwingsVectorsTileLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity

  const sublayers: FourwingsDeckVectorSublayer[] = (dataview.datasetsConfig || [])?.map(
    (datasetConfig) => {
      return {
        id: dataview.id,
        datasets: [datasetConfig.datasetId],
        direction: 'u',
      }
    }
  )

  const maxZoomLevels = (dataview.config?.sublayers || [])?.flatMap(({ maxZoom }) =>
    maxZoom !== undefined ? (maxZoom as number) : []
  )
  if (dataview.config?.maxZoom !== undefined) {
    maxZoomLevels.push(dataview.config?.maxZoom)
  }

  const visualizationMode =
    (dataview.config?.visualizationMode as FourwingsVisualizationMode) || 'heatmap'
  const availableIntervals = getDataviewAvailableIntervals(dataview)

  const allVisibleDatasets = (dataview.config?.sublayers || []).flatMap((sublayer) =>
    sublayer.visible
      ? sublayer.datasets.filter((dataset) => dataset.type === DatasetTypes.Fourwings)
      : []
  )
  const { extentStart, extentEnd } = getDatasetsExtent<string>(allVisibleDatasets)

  const dataset = allVisibleDatasets?.[0]

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
    visualizationMode,
    sublayers,
    maxZoom: 8,
    highlightedFeatures: highlightedFeatures as FourwingsPickingObject[],
    visible: dataview.config?.visible ?? true,
    availableIntervals,
    ...(tilesUrl && { tilesUrl }),
    ...(extentStart && { extentStart: getUTCDateTime(extentStart).toMillis() }),
    ...(extentEnd && { extentEnd: getUTCDateTime(extentEnd).toMillis() }),
  }
}
