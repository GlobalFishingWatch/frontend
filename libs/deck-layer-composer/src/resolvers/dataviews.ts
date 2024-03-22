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
import { UrlDataviewInstance, getMergedDataviewId } from '@globalfishingwatch/dataviews-client'

const getDatasetsAvailableIntervals = (datasets: Dataset[]) =>
  uniq((datasets || [])?.flatMap((d) => (d?.configuration?.intervals as FourwingsInterval[]) || []))

export const getDataviewAvailableIntervals = (
  dataview: UrlDataviewInstance,
  defaultIntervals = DEFAULT_FOURWINGS_INTERVALS
): FourwingsInterval[] => {
  const allDatasets = dataview.datasets?.length
    ? dataview.datasets
    : (dataview?.config?.sublayers || [])?.flatMap((sublayer) => sublayer.datasets || [])
  const fourwingsDatasets = allDatasets?.filter(
    (dataset) => dataset.type === DatasetTypes.Fourwings
  )
  const dataviewInterval = dataview.config?.interval
  const dataviewIntervals = dataview.config?.intervals
  const datasetIntervals = getDatasetsAvailableIntervals(fourwingsDatasets)
  let availableIntervals = defaultIntervals

  if (dataviewInterval) {
    availableIntervals = [dataviewInterval as FourwingsInterval]
  } else if (dataviewIntervals && dataviewIntervals.length > 0) {
    availableIntervals = dataviewIntervals as FourwingsInterval[]
  } else if (datasetIntervals && datasetIntervals.length > 0) {
    availableIntervals = datasetIntervals
  }
  return availableIntervals
}

const getDatasetAttribution = (dataset?: Dataset) =>
  dataset?.source && dataset?.source !== 'user' ? dataset?.source : undefined

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

function isEnvironmentalDataview(dataview: UrlDataviewInstance) {
  return (
    dataview.category === DataviewCategory.Environment &&
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

export function getFourwingsDataviewSublayers(dataview: UrlDataviewInstance) {
  const { config, datasetsConfig } = dataview

  if (!dataview?.datasets?.length) {
    console.warn('No datasets found on dataview:', dataview)
    return []
  }

  if (!config || !datasetsConfig || !datasetsConfig.length) {
    return []
  }

  const activeDatasets =
    dataview.category === DataviewCategory.Environment
      ? dataview.datasets
      : dataview.datasets.filter((dataset) => dataview?.config?.datasets?.includes(dataset.id))

  const sublayer: DataviewSublayerConfig = {
    id: dataview.id,
    datasets: activeDatasets,
    colorRamp: config.colorRamp as string,
    visible: config.visible,
    filter: config.filter,
    vesselGroups: config['vessel-groups'],
    maxZoom: config.maxZoom,
  }

  return sublayer
}

export function getFourwingsDataviewsResolved(
  fourwingsDataview: UrlDataviewInstance | UrlDataviewInstance[],
  {
    timeRange,
    visualizationMode = 'heatmap',
    comparisonMode = FourwingsComparisonMode.Compare,
    colorRampWhiteEnd = false,
  } = {} as GetMergedHeatmapAnimatedDataviewParams
) {
  const dataviewsFiltered = [] as UrlDataviewInstance[]

  const fourwingsDataviews = Array.isArray(fourwingsDataview)
    ? fourwingsDataview
    : [fourwingsDataview]

  // TODO: resolve tiles api url
  const mergedActivityDataview = {
    id: getMergedDataviewId(fourwingsDataviews),
    category: fourwingsDataviews[0]?.category,
    config: {
      type: fourwingsDataviews[0]?.config?.type,
      sublayers: fourwingsDataviews.flatMap(getFourwingsDataviewSublayers),
      colorRampWhiteEnd,
      visualizationMode,
      comparisonMode,
    },
  }

  dataviewsFiltered.push(mergedActivityDataview)

  // New sublayers as auxiliar activity layers
  const activityWithContextDataviews = fourwingsDataviews.flatMap((dataview) => {
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
        config: {
          color: dataview.config?.color,
          visible: auxiliarLayerActive,
          type: DataviewType.Polygons,
        },
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

export function getDataviewsResolved(
  dataviews: (UrlDataviewInstance | DataviewInstance)[],
  params: ResolverGlobalConfig = {}
) {
  const {
    activityDataviews,
    detectionDataviews,
    environmentalDataviews,
    trackDataviews,
    otherDataviews,
  } = dataviews.reduce(
    (acc, dataview) => {
      if (isActivityDataview(dataview)) {
        acc.activityDataviews.push(dataview)
      } else if (isDetectionsDataview(dataview)) {
        acc.detectionDataviews.push(dataview)
      } else if (isEnvironmentalDataview(dataview)) {
        acc.environmentalDataviews.push(dataview)
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
      environmentalDataviews: [] as UrlDataviewInstance[],
      trackDataviews: [] as UrlDataviewInstance[],
      otherDataviews: [] as UrlDataviewInstance[],
    }
  )

  const singleHeatmapDataview =
    [...activityDataviews, ...detectionDataviews, ...environmentalDataviews].length === 1
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
    ? getFourwingsDataviewsResolved(activityDataviews, {
        ...params,
        visualizationMode: params.activityVisualizationMode,
        comparisonMode: activityComparisonMode,
        colorRampWhiteEnd: singleHeatmapDataview,
      })
    : []
  const mergedDetectionsDataview = detectionDataviews.length
    ? getFourwingsDataviewsResolved(detectionDataviews, {
        ...params,
        visualizationMode: params.detectionsVisualizationMode,
        comparisonMode: detectionsComparisonMode,
        colorRampWhiteEnd: singleHeatmapDataview,
      })
    : []
  const environmentalDataviewsParsed = environmentalDataviews.flatMap(
    (d) =>
      getFourwingsDataviewsResolved(d, {
        colorRampWhiteEnd: singleHeatmapDataview,
      }) || []
  )
  const dataviewsMerged = [
    ...otherDataviews,
    ...mergedActivityDataview,
    ...mergedDetectionsDataview,
    ...environmentalDataviewsParsed,
    ...trackDataviews,
  ]
  return dataviewsMerged
}
