import { uniq } from 'es-toolkit'

import {
  DatasetTypes,
  DataviewCategory,
  DataviewType,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { getDatasetsExtent, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type {
 ColorRampId,  FourwingsDeckSublayer,
  FourwingsLayerProps,
  FourwingsPickingObject,
  FourwingsVisualizationMode } from '@globalfishingwatch/deck-layers'
import {
  FourwingsAggregationOperation,
  FourwingsComparisonMode,
  getUTCDateTime,
  TIME_COMPARISON_NOT_SUPPORTED_INTERVALS,
} from '@globalfishingwatch/deck-layers'

import { getDataviewAvailableIntervals } from './dataviews'
import type { DeckResolverFunction } from './types'

export const resolveDeckFourwingsLayerProps: DeckResolverFunction<FourwingsLayerProps> = (
  dataview,
  {
    start,
    end,
    highlightedFeatures,
    compareStart,
    compareEnd,
    highlightedTime,
    onPositionsMaxPointsError,
  }
): FourwingsLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity

  const visibleSublayers = dataview.config?.sublayers?.filter((sublayer) => sublayer?.visible)
  const sublayers: FourwingsDeckSublayer[] = (visibleSublayers || []).map((sublayer) => {
    const units = uniq(sublayer.datasets?.map((dataset) => dataset.unit))
    const positionProperties = uniq(
      sublayer?.datasets.flatMap((dataset) => Object.keys(dataset?.schema || {}))
    )
    const { extentStart, extentEnd } = getDatasetsExtent<number>(sublayer.datasets, {
      format: 'timestamp',
    })

    if (units.length > 0 && units.length !== 1) {
      console.warn('Shouldnt have distinct units for the same heatmap layer')
    }

    return {
      id: sublayer.id,
      visible: sublayer?.visible ?? true,
      datasets: sublayer?.datasets.map((dataset) => dataset.id),
      color: (sublayer?.color || dataview.config?.color) as string,
      positionProperties,
      colorRamp: sublayer?.colorRamp as ColorRampId,
      label: sublayer?.datasets?.[0]?.name,
      unit: units[0]!,
      filter: sublayer?.filter,
      vesselGroups: sublayer?.vesselGroups,
      vesselGroupsLength: sublayer?.vesselGroupsLength,
      extentStart,
      extentEnd,
    }
  })

  const maxZoomLevels = (dataview.config?.sublayers || [])?.flatMap(({ maxZoom }) =>
    maxZoom !== undefined ? (maxZoom as number) : []
  )
  if (dataview.config?.maxZoom !== undefined) {
    maxZoomLevels.push(dataview.config?.maxZoom)
  }

  const allAvailableIntervals = getDataviewAvailableIntervals(dataview)
  const availableIntervals =
    dataview.config?.comparisonMode === FourwingsComparisonMode.TimeCompare
      ? allAvailableIntervals.filter(
          (interval) => !TIME_COMPARISON_NOT_SUPPORTED_INTERVALS.includes(interval)
        )
      : allAvailableIntervals

  // TODO: get this from the dataset config
  const aggregationOperation =
    dataview.category === DataviewCategory.Environment
      ? FourwingsAggregationOperation.Avg
      : FourwingsAggregationOperation.Sum

  const visualizationMode =
    (dataview.config?.visualizationMode as FourwingsVisualizationMode) || 'heatmap'
  const comparisonMode = (dataview.config?.comparisonMode as FourwingsComparisonMode) || 'compare'

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
              // api enpdoint needs 'position' instead of 'positions'
              // TODO: discuss this with Raul before the release
              value: visualizationMode === 'positions' ? 'position' : 'heatmap',
            },
          ],
        },
        { absolute: true }
      )
    : undefined

  const interactionUrl = dataset
    ? resolveEndpoint(
        dataset,
        {
          datasetId: dataset.id,
          endpoint: EndpointId.FourwingsTiles,
          params: [
            {
              id: 'type',
              // api enpdoint needs 'position' instead of 'positions'
              // TODO: discuss this with Raul before the release
              value: visualizationMode === 'positions' ? 'position' : 'heatmap',
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
    static: dataview.config?.type === DataviewType.HeatmapStatic,
    sublayers,
    comparisonMode,
    visualizationMode,
    aggregationOperation,
    availableIntervals,
    highlightedFeatures: highlightedFeatures as FourwingsPickingObject[],
    ...(highlightedTime?.start && {
      highlightStartTime: getUTCDateTime(highlightedTime?.start).toMillis(),
    }),
    ...(highlightedTime?.end && {
      highlightEndTime: getUTCDateTime(highlightedTime?.end).toMillis(),
    }),
    minVisibleValue: dataview.config?.minVisibleValue,
    maxVisibleValue: dataview.config?.maxVisibleValue,
    visible: dataview.config?.visible ?? true,
    color: dataview.config?.color,
    colorRampWhiteEnd: dataview.config?.colorRampWhiteEnd ?? false,
    ...(onPositionsMaxPointsError && { onPositionsMaxPointsError }),
    ...(tilesUrl && { tilesUrl }),
    ...(compareStart && { compareStart: getUTCDateTime(compareStart).toMillis() }),
    ...(compareEnd && { compareEnd: getUTCDateTime(compareEnd).toMillis() }),
    ...(extentStart && { extentStart: getUTCDateTime(extentStart).toMillis() }),
    ...(extentEnd && { extentEnd: getUTCDateTime(extentEnd).toMillis() }),
    // if any of the activity dataviews has a max zoom level defined
    // apply the minimum max zoom level (the most restrictive approach)
    ...(maxZoomLevels &&
      maxZoomLevels.length > 0 && {
        maxZoom: Math.min(...maxZoomLevels),
      }),
  }
}
