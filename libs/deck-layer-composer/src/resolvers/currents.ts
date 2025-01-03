import { uniq } from 'es-toolkit'
import type {
  FourwingsCurrentsTileLayerProps,
  FourwingsDeckSublayer,
  FourwingsVisualizationMode,
} from '@globalfishingwatch/deck-layers'
import { getUTCDateTime } from '@globalfishingwatch/deck-layers'
import { DatasetTypes, EndpointId } from '@globalfishingwatch/api-types'
import type { ColorRampId } from '@globalfishingwatch/deck-layers'
import { getDatasetsExtent, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { getDataviewAvailableIntervals } from './dataviews'
import type { DeckResolverFunction } from './types'

export const resolveDeckCurrentsLayerProps: DeckResolverFunction<
  FourwingsCurrentsTileLayerProps
> = (dataview, { start, end }): FourwingsCurrentsTileLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity

  const visibleSublayers = dataview.config?.sublayers?.filter((sublayer) => sublayer?.visible)
  const sublayers: FourwingsDeckSublayer[] = (visibleSublayers || []).map((sublayer) => {
    return {
      id: sublayer.id,
      visible: sublayer?.visible ?? true,
      datasets: sublayer?.datasets.map((dataset) => dataset.id),
      color: (sublayer?.color || dataview.config?.color) as string,
      colorRamp: sublayer?.colorRamp as ColorRampId,
      label: sublayer?.datasets?.[0]?.name,
    }
  })

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
