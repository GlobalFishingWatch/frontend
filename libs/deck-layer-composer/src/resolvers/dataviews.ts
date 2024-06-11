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

export const AUXILIAR_DATAVIEW_SUFIX = 'auxiliar'

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

export type TimeRange = { start: string; end: string }

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

function isHeatmapStaticDataview(dataview: UrlDataviewInstance) {
  return dataview.config?.type === DataviewType.HeatmapStatic
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

  const maxZoomLevels = activeDatasets?.flatMap(({ configuration }) =>
    configuration?.maxZoom !== undefined ? (configuration?.maxZoom as number) : []
  )
  const maxZoom = maxZoomLevels?.length ? Math.min(...maxZoomLevels) : undefined

  const sublayer: DataviewSublayerConfig = {
    id: dataview.id,
    datasets: activeDatasets,
    color: config.color as string,
    colorRamp: config.colorRamp as string,
    visible: config.visible,
    filter: config.filter,
    vesselGroups: config['vessel-groups'],
    maxZoom,
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

  const mergedActivityDataview = {
    id: getMergedDataviewId(fourwingsDataviews),
    category: fourwingsDataviews[0]?.category,
    config: {
      type: fourwingsDataviews[0]?.config?.type,
      maxZoom: fourwingsDataviews[0]?.config?.maxZoom,
      sublayers: fourwingsDataviews.flatMap(getFourwingsDataviewSublayers),
      minVisibleValue: fourwingsDataviews[0].config?.minVisibleValue,
      maxVisibleValue: fourwingsDataviews[0].config?.maxVisibleValue,
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
        id: `${dataview.id}-${AUXILIAR_DATAVIEW_SUFIX}`,
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
  activityVisualizationMode?: FourwingsVisualizationMode
  detectionsVisualizationMode?: FourwingsVisualizationMode
  // TODO review if we can move this to each own dataview
  compareStart?: string
  compareEnd?: string
  locale?: string
  visibleEvents?: EventTypes[]
  debug?: boolean
  timeRange?: TimeRange
  highlightedTime?: Partial<TimeRange>
  highlightedEvent?: ApiEvent
  highlightedEvents?: string[]
  customGeneratorMapping?: Partial<Record<DataviewType, DataviewType>>
  singleTrack?: boolean
}

const DATAVIEWS_LAYER_ORDER: DataviewType[] = [
  DataviewType.Basemap,
  DataviewType.Context,
  DataviewType.HeatmapStatic,
  DataviewType.Heatmap,
  DataviewType.HeatmapAnimated,
  DataviewType.TileCluster,
  DataviewType.Track,
  DataviewType.VesselEvents,
  DataviewType.VesselEventsShapes,
  DataviewType.UserContext,
  DataviewType.UserPoints,
  DataviewType.Polygons,
  DataviewType.BasemapLabels,
  DataviewType.Graticules,
  DataviewType.Rulers,
  DataviewType.Annotation,
]

export function getDataviewsSorted(
  dataviews: (UrlDataviewInstance | DataviewInstance)[],
  order = DATAVIEWS_LAYER_ORDER
) {
  return dataviews.toSorted((a, b) => {
    const aType = a.config?.type as DataviewType
    const bType = b.config?.type as DataviewType
    const aPos = order.indexOf(aType)
    const bPos = order.indexOf(bType)
    return aPos - bPos
  }) as DataviewInstance[]
}

export function getComparisonMode(
  dataviews: (UrlDataviewInstance | DataviewInstance)[],
  params: ResolverGlobalConfig
) {
  const dataviewsArray = Array.isArray(dataviews) ? dataviews : [dataviews]
  if (params.compareStart && params.compareEnd) {
    return FourwingsComparisonMode.TimeCompare
  }
  return dataviewsArray.every((dataview) => params.bivariateDataviews?.includes(dataview.id))
    ? FourwingsComparisonMode.Bivariate
    : FourwingsComparisonMode.Compare
}

export function getDataviewsResolved(
  dataviews: (UrlDataviewInstance | DataviewInstance)[],
  params: ResolverGlobalConfig = {}
) {
  const {
    activityDataviews,
    detectionDataviews,
    environmentalDataviews,
    staticDataviews,
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
      } else if (isHeatmapStaticDataview(dataview)) {
        acc.staticDataviews.push(dataview)
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
      staticDataviews: [] as UrlDataviewInstance[],
      trackDataviews: [] as UrlDataviewInstance[],
      otherDataviews: [] as UrlDataviewInstance[],
    }
  )

  const singleHeatmapDataview =
    [...activityDataviews, ...detectionDataviews, ...environmentalDataviews].length === 1

  const activityComparisonMode = getComparisonMode(activityDataviews, params)
  const detectionsComparisonMode = getComparisonMode(detectionDataviews, params)

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
        colorRampWhiteEnd:
          d.config?.type === DataviewType.HeatmapStatic ? false : singleHeatmapDataview,
      }) || []
  )
  const staticDataviewsParsed = staticDataviews.flatMap(
    (d) =>
      getFourwingsDataviewsResolved(d, {
        colorRampWhiteEnd:
          d.config?.type === DataviewType.HeatmapStatic ? false : singleHeatmapDataview,
      }) || []
  )
  const trackDataviewsParsed = trackDataviews.flatMap((d) => ({
    ...d,
    config: {
      ...d.config,
      singleTrack: trackDataviews.length === 1,
    },
  }))
  const dataviewsMerged = [
    ...otherDataviews,
    ...staticDataviewsParsed,
    ...environmentalDataviewsParsed,
    ...mergedDetectionsDataview,
    ...mergedActivityDataview,
    ...trackDataviewsParsed,
  ]
  return dataviewsMerged
}