import { PickingInfo } from '@deck.gl/core'
import { uniq } from 'lodash'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  FourwingsAggregationOperation,
  FourwingsComparisonMode,
  FourwingsDeckSublayer,
  FourwingsLayerProps,
  FourwingsVisualizationMode,
  TIME_COMPARISON_NOT_SUPPORTED_INTERVALS,
  getUTCDateTime,
} from '@globalfishingwatch/deck-layers'
import {
  DatasetTypes,
  DataviewCategory,
  DataviewType,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { ColorRampId } from '@globalfishingwatch/deck-layers'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { getDataviewAvailableIntervals } from './dataviews'
import { ResolverGlobalConfig } from './types'

// TODO: decide if include static here or create a new one
export const resolveDeckFourwingsLayerProps = (
  dataview: UrlDataviewInstance,
  { start, end, resolution }: ResolverGlobalConfig,
  interactions: PickingInfo[]
): FourwingsLayerProps => {
  const startTime = start ? getUTCDateTime(start).toMillis() : 0
  const endTime = end ? getUTCDateTime(end).toMillis() : Infinity

  const visibleSublayers = dataview.config?.sublayers?.filter((sublayer) => sublayer?.visible)
  const sublayers: FourwingsDeckSublayer[] = (visibleSublayers || []).map((sublayer) => {
    const units = uniq(sublayer.datasets?.map((dataset) => dataset.unit))

    if (units.length > 0 && units.length !== 1) {
      console.warn('Shouldnt have distinct units for the same heatmap layer')
    }

    return {
      id: sublayer.id,
      visible: sublayer?.visible ?? true,
      datasets: sublayer?.datasets.map((dataset) => dataset.id),
      color: (sublayer?.color || dataview.config?.color) as string,
      colorRamp: sublayer?.colorRamp as ColorRampId,
      label: sublayer?.datasets?.[0]?.name!,
      unit: units[0]!,
      filter: sublayer?.filter,
      vesselGroups: sublayer?.vesselGroups,
    }
  })

  const maxZoomLevels = dataview.config?.sublayers?.flatMap(({ maxZoom }) =>
    maxZoom !== undefined ? (maxZoom as number) : []
  )

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

  const dataset = dataview.config?.sublayers
    ?.flatMap((sublayer) => sublayer.datasets)
    ?.find((dataset) => dataset.type === DatasetTypes.Fourwings)
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

  return {
    id: dataview.id,
    minFrame: startTime,
    maxFrame: endTime,
    category: dataview.category!,
    static: dataview.config?.type === DataviewType.HeatmapStatic,
    resolution,
    sublayers,
    comparisonMode,
    visualizationMode,
    aggregationOperation,
    availableIntervals,
    hoveredFeatures: interactions,
    minVisibleValue: dataview.config?.minVisibleValue,
    maxVisibleValue: dataview.config?.maxVisibleValue,
    debug: dataview.config?.debug ?? false,
    visible: dataview.config?.visible ?? true,
    colorRampWhiteEnd: dataview.config?.colorRampWhiteEnd ?? false,
    ...(tilesUrl && { tilesUrl }),
    // if any of the activity dataviews has a max zoom level defined
    // apply the minimum max zoom level (the most restrictive approach)
    ...(maxZoomLevels &&
      maxZoomLevels.length > 0 && {
        maxZoom: Math.min(...maxZoomLevels),
      }),
  }
}
