import { uniq } from 'lodash'
import {
  DatasetTypes,
  EndpointId,
  DataviewCategory,
  Dataset,
  ApiEvent,
  DataviewInstance,
  EventTypes,
  DataviewSublayerConfig,
  DataviewType,
} from '@globalfishingwatch/api-types'
import {
  DEFAULT_FOURWINGS_INTERVALS,
  FourwingsComparisonMode,
  FourwingsVisualizationMode,
} from '@globalfishingwatch/deck-layers'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import {
  UrlDataviewInstance,
  getMergedDataviewId,
  resolveDataviewDatasetResource,
} from '@globalfishingwatch/dataviews-client'

// TODO Maybe this should rather be in dataset.endpoints[id = 4wings-tiles].query[id = interval].options
// or something similar ??
const getDatasetAvailableIntervals = (dataset?: Dataset) =>
  dataset?.configuration?.intervals as FourwingsInterval[]

const getDataviewAvailableIntervals = (
  dataview: UrlDataviewInstance,
  defaultIntervals = DEFAULT_FOURWINGS_INTERVALS
): FourwingsInterval[] => {
  const dataset = dataview.datasets?.find((dataset) => dataset.type === DatasetTypes.Fourwings)
  const dataviewInterval = dataview.config?.interval
  const dataviewIntervals = dataview.config?.intervals
  const datasetIntervals = getDatasetAvailableIntervals(dataset)
  let availableIntervals = defaultIntervals

  if (dataviewInterval) {
    availableIntervals = [dataviewInterval]
  } else if (dataviewIntervals && dataviewIntervals.length > 0) {
    availableIntervals = dataviewIntervals
  } else if (datasetIntervals && datasetIntervals.length > 0) {
    availableIntervals = datasetIntervals
  }
  return availableIntervals
}

type TimeRange = { start: string; end: string }

function isActivityDataview(dataview: UrlDataviewInstance) {
  return (
    dataview.category === DataviewCategory.Activity &&
    dataview.config?.type === DataviewType.HeatmapAnimated
  )
}

function isDetectionsDataview(dataview: UrlDataviewInstance) {
  return (
    dataview.category === DataviewCategory.Detections &&
    dataview.config?.type === DataviewType.HeatmapAnimated
  )
}

function isTrackDataview(dataview: UrlDataviewInstance) {
  return (
    dataview.category === DataviewCategory.Vessels && dataview.config?.type === DataviewType.Track
  )
}

type GetMergedHeatmapAnimatedDataviewParams = {
  visualizationMode?: FourwingsVisualizationMode
  comparisonMode?: FourwingsComparisonMode
  timeRange?: TimeRange
  colorRampWhiteEnd?: boolean
}
export function getMergedHeatmapAnimatedDataviews(
  heatmapAnimatedDataviews: UrlDataviewInstance[],
  {
    visualizationMode,
    comparisonMode,
    timeRange,
    colorRampWhiteEnd = false,
  } = {} as GetMergedHeatmapAnimatedDataviewParams
) {
  const dataviewsFiltered = [] as UrlDataviewInstance[]
  const activitySublayers = heatmapAnimatedDataviews.flatMap((dataview) => {
    const { config, datasetsConfig } = dataview
    if (!dataview?.datasets?.length) {
      console.warn('No datasets found on dataview:', dataview)
      return []
    }
    if (!config || !datasetsConfig || !datasetsConfig.length) {
      return []
    }
    const datasets = config.datasets || datasetsConfig.map((dc) => dc.datasetId)

    const activeDatasets = dataview.datasets.filter((dataset) =>
      dataview?.config?.datasets?.includes(dataset.id)
    )
    const units = uniq(activeDatasets?.map((dataset) => dataset.unit))
    if (units.length > 0 && units.length !== 1) {
      throw new Error('Shouldnt have distinct units for the same heatmap layer')
    }

    const availableIntervals = getDataviewAvailableIntervals(dataview)

    const sublayer: DataviewSublayerConfig = {
      id: dataview.id,
      datasets,
      colorRamp: config.colorRamp as string[],
      visible: config.visible,
      filter: config.filter,
      vesselGroups: config['vessel-groups'],
      legend: {
        label: dataview.name!,
        unit: units?.[0]!,
        color: dataview?.config?.color!,
      },
      availableIntervals,
    }

    return sublayer
  })

  const maxZoomLevels = heatmapAnimatedDataviews
    ?.filter(({ config }) => config && config?.maxZoom !== undefined)
    .flatMap(({ config }) => config?.maxZoom as number)

  const mergedActivityDataview = {
    id: getMergedDataviewId(heatmapAnimatedDataviews),
    category: heatmapAnimatedDataviews[0]?.category,
    config: {
      type: DataviewType.HeatmapAnimated,
      sublayers: activitySublayers,
      colorRampWhiteEnd,
      updateDebounce: true,
      visualizationMode,
      comparisonMode,
      // if any of the activity dataviews has a max zoom level defined
      // apply the minimum max zoom level (the most restrictive approach)
      ...(maxZoomLevels &&
        maxZoomLevels.length > 0 && {
          maxZoom: Math.min(...maxZoomLevels),
        }),
    },
  }
  dataviewsFiltered.push(mergedActivityDataview)

  // New sublayers as auxiliar activity layers
  const activityWithContextDataviews = heatmapAnimatedDataviews.flatMap((dataview) => {
    const auxiliarLayerActive = dataview.config?.auxiliarLayerActive ?? true
    if (
      dataview.datasetsConfig?.some(
        (d) => d.endpoint === EndpointId.ContextGeojson && auxiliarLayerActive
      )
    ) {
      const datasetsConfig = dataview.datasetsConfig?.flatMap((dc) => {
        if (dc.endpoint !== EndpointId.ContextGeojson) {
          return []
        }
        return {
          ...dc,
          query: [
            ...(dc.query || []),
            { id: 'start-date', value: timeRange?.start || '' },
            { id: 'end-date', value: timeRange?.end || '' },
          ],
        }
      })
      // Prepare a new dataview only for the auxiliar activity layer
      const auxiliarDataview: UrlDataviewInstance = {
        ...dataview,
        datasets: dataview.datasets?.filter((d) => d.type === DatasetTypes.TemporalContext),
        datasetsConfig,
      }
      const { url } = resolveDataviewDatasetResource(auxiliarDataview, DatasetTypes.TemporalContext)
      if (!url) {
        return []
      }
      auxiliarDataview.config = {
        color: dataview.config?.color,
        visible: auxiliarLayerActive,
        type: DataviewType.Polygons,
        url,
      }
      return auxiliarDataview
    }
    return []
  })
  dataviewsFiltered.push(...activityWithContextDataviews)
  return dataviewsFiltered
}

/**
 * Generates generator configs to be consumed by LayerComposer, based on the list of dataviews provided,
 * and associates Resources to them when needed for the generator (ie tracks data for a track generator).
 * If workspace is provided, it will only use the dataviews specified in the Workspace,
 * and apply any viewParams or datasetParams from it.
 * @param dataviews
 * @param resources
 * @param options
 */

// TODO: clean this up and decide if merging with ResolverGlobalConfig or move the file to deck-layer-composer
type ResolverGlobalConfig = {
  start?: string
  end?: string
  zoom?: number
  token?: string
  bivariateDataviews?: [string, string]
  activityVisualizationMode?: 'heatmap' | 'positions'
  detectionsVisualizationMode?: 'heatmap' | 'positions'
  // TODO review if we can move this to each own dataview
  compareStart?: string
  compareEnd?: string
  locale?: string
  visibleEvents?: EventTypes[]
  debug?: boolean
  timeRange?: TimeRange
  highlightedTime?: TimeRange
  highlightedEvent?: ApiEvent
  highlightedEvents?: string[]
  customGeneratorMapping?: Partial<Record<DataviewType, DataviewType>>
  singleTrack?: boolean
}

export function getDataviewsMerged(
  dataviews: (UrlDataviewInstance | DataviewInstance)[],
  params: ResolverGlobalConfig = {}
) {
  const { activityDataviews, detectionDataviews, trackDataviews, otherDataviews } =
    dataviews.reduce(
      (acc, dataview) => {
        if (isActivityDataview(dataview)) {
          acc.activityDataviews.push(dataview)
        } else if (isDetectionsDataview(dataview)) {
          acc.detectionDataviews.push(dataview)
        } else if (isTrackDataview(dataview)) {
          acc.trackDataviews.push(dataview)
        } else {
          acc.otherDataviews.push(dataview)
        }
        return acc
      },
      {
        activityDataviews: [] as UrlDataviewInstance[],
        detectionDataviews: [] as UrlDataviewInstance[],
        trackDataviews: [] as UrlDataviewInstance[],
        otherDataviews: [] as UrlDataviewInstance[],
      }
    )

  const singleHeatmapDataview = [...activityDataviews, ...detectionDataviews].length === 1
  const activityComparisonMode = activityDataviews.every((dataview) =>
    params.bivariateDataviews?.includes(dataview.id)
  )
    ? FourwingsComparisonMode.Bivariate
    : FourwingsComparisonMode.Compare
  const detectionsComparisonMode = detectionDataviews.every((dataview) =>
    params.bivariateDataviews?.includes(dataview.id)
  )
    ? FourwingsComparisonMode.Bivariate
    : FourwingsComparisonMode.Compare
  // If activity heatmap animated generators found, merge them into one generator with multiple sublayers
  const mergedActivityDataview = activityDataviews?.length
    ? getMergedHeatmapAnimatedDataviews(activityDataviews, {
        ...params,
        visualizationMode: params.activityVisualizationMode,
        comparisonMode: activityComparisonMode,
        colorRampWhiteEnd: singleHeatmapDataview,
      })
    : []
  const mergedDetectionsDataview = detectionDataviews.length
    ? getMergedHeatmapAnimatedDataviews(detectionDataviews, {
        ...params,
        visualizationMode: params.detectionsVisualizationMode,
        comparisonMode: detectionsComparisonMode,
        colorRampWhiteEnd: singleHeatmapDataview,
      })
    : []
  const dataviewsMerged = [
    ...otherDataviews,
    ...mergedActivityDataview,
    ...mergedDetectionsDataview,
    ...trackDataviews,
  ]
  return dataviewsMerged
}
