import { DatasetTypes, EndpointId } from '@globalfishingwatch/api-types'
import { getDatasetsExtent, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type {
  ColorRampId,
  FourwingsCurrentsTileLayerProps,
  FourwingsDeckSublayer,
  FourwingsVisualizationMode,
} from '@globalfishingwatch/deck-layers'
import { getUTCDateTime } from '@globalfishingwatch/deck-layers'

import { getDataviewAvailableIntervals } from './dataviews'
import type { DeckResolverFunction } from './types'

export const resolveDeckCurrentsLayerProps: DeckResolverFunction<
  FourwingsCurrentsTileLayerProps
> = (dataview, { start, end }): FourwingsCurrentsTileLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity

  const sublayers: FourwingsDeckSublayer[] = (dataview.datasetsConfig || [])?.map(
    (datasetConfig) => {
      return {
        id: datasetConfig.datasetId,
        visible: dataview.config?.visible ?? true,
        datasets: [datasetConfig.datasetId],
        color: dataview.config?.color as string,
        colorRamp: '' as ColorRampId,
        label: dataview?.datasets?.find((dataset) => dataset.id === datasetConfig.datasetId)?.name,
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
    // highlightedFeatures: highlightedFeatures as FourwingsPickingObject[],
    visible: dataview.config?.visible ?? true,
    availableIntervals,
    ...(tilesUrl && { tilesUrl }),
    ...(extentStart && { extentStart: getUTCDateTime(extentStart).toMillis() }),
    ...(extentEnd && { extentEnd: getUTCDateTime(extentEnd).toMillis() }),
  }
}
