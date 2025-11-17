import { groupBy, uniq, uniqBy } from 'es-toolkit'

import type { ApiEvent, Dataset, DataviewInstance, EventTypes } from '@globalfishingwatch/api-types'
import {
  DatasetTypes,
  DataviewCategory,
  DataviewType,
  EndpointId,
} from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  getMergedDataviewId,
  isActivityDataview,
  isAnyContextDataview,
  isDetectionsDataview,
  isEnvironmentalDataview,
  isHeatmapStaticDataview,
  isHeatmapVectorsDataview,
  isTrackDataview,
  isUserHeatmapDataview,
  isUserTrackDataview,
  isVesselGroupDataview,
} from '@globalfishingwatch/dataviews-client'
import type {
  FOOTPRINT_HIGH_RES_ID,
  FOOTPRINT_ID,
  FourwingsVisualizationMode,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
} from '@globalfishingwatch/deck-layers'
import { FourwingsComparisonMode } from '@globalfishingwatch/deck-layers'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { FOURWINGS_INTERVALS_ORDER } from '@globalfishingwatch/deck-loaders'

import type {
  FourwingsSublayerConfig,
  ResolvedContextDataviewInstance,
  ResolvedDataviewInstance,
  ResolvedFourwingsDataviewInstance,
} from '../types/dataviews'
import type { TimeRange } from '../types/resolvers'

export const AUXILIAR_DATAVIEW_SUFIX = 'auxiliar'

const getDatasetsAvailableIntervals = (datasets: Dataset[]) =>
  uniq((datasets || [])?.flatMap((d) => (d?.configuration?.intervals as FourwingsInterval[]) || []))

export const getDataviewAvailableIntervals = (
  dataview: UrlDataviewInstance | ResolvedFourwingsDataviewInstance,
  defaultIntervals = FOURWINGS_INTERVALS_ORDER
): FourwingsInterval[] => {
  const allDatasets = dataview.datasets?.length
    ? dataview.datasets
    : (((dataview as ResolvedFourwingsDataviewInstance)?.config?.sublayers || [])?.flatMap(
        (sublayer) => sublayer.datasets || []
      ) as Dataset[])
  const fourwingsDatasets = allDatasets?.filter(
    (dataset) => dataset.type === DatasetTypes.Fourwings
  )
  const dataviewInterval = dataview.config?.interval
  const dataviewIntervals = dataview.config?.intervals
  const datasetIntervals = getDatasetsAvailableIntervals(fourwingsDatasets)
  let availableIntervals = defaultIntervals

  if (dataviewInterval) {
    availableIntervals = [dataviewInterval as FourwingsInterval]
  } else if (datasetIntervals && datasetIntervals.length > 0) {
    availableIntervals = datasetIntervals
  } else if (dataviewIntervals && dataviewIntervals.length > 0) {
    availableIntervals = dataviewIntervals as FourwingsInterval[]
  }
  return availableIntervals
}

export const getAvailableIntervalsInDataviews = (dataviews: UrlDataviewInstance[]) => {
  return uniq(dataviews.flatMap((dataview) => getDataviewAvailableIntervals(dataview)))
}

type GetMergedHeatmapAnimatedDataviewParams = {
  visualizationMode?: FourwingsVisualizationMode
  comparisonMode?: FourwingsComparisonMode
  timeRange?: TimeRange
  colorRampWhiteEnd?: boolean
  color?: string
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
    dataview.category === DataviewCategory.Environment ||
    dataview.category === DataviewCategory.User
      ? dataview.datasets
      : dataview.datasets.filter((dataset) => dataview?.config?.datasets?.includes(dataset.id))

  const maxZoomLevels = activeDatasets?.flatMap(({ configuration }) =>
    configuration?.maxZoom !== undefined ? (configuration?.maxZoom as number) : []
  )
  const maxZoom = maxZoomLevels?.length ? Math.min(...maxZoomLevels) : undefined

  const sublayer: FourwingsSublayerConfig = {
    id: dataview.id,
    datasets: activeDatasets,
    color: config.color as string,
    colorRamp: config.colorRamp as string,
    visible: config.visible,
    filter: config.filter,
    filterIds: config.filterIds,
    vesselGroups: config['vessel-groups'],
    vesselGroupsLength: dataview.vesselGroup?.vessels?.length,
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
    : [fourwingsDataview].filter(Boolean)

  if (!fourwingsDataviews.length) {
    return []
  }

  const mergedActivityDataview: ResolvedFourwingsDataviewInstance = {
    id: getMergedDataviewId(fourwingsDataviews),
    category: fourwingsDataviews[0]?.category,
    config: {
      type: fourwingsDataviews[0]?.config?.type,
      maxZoom: fourwingsDataviews[0]?.config?.maxZoom,
      sublayers: fourwingsDataviews.flatMap(getFourwingsDataviewSublayers),
      minVisibleValue: fourwingsDataviews[0].config?.minVisibleValue,
      maxVisibleValue: fourwingsDataviews[0].config?.maxVisibleValue,
      colorRampWhiteEnd,
      color: fourwingsDataviews[0].config?.color,
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
          pickable: false,
        },
      }
      return auxiliarDataview
    }
    return []
  })
  dataviewsFiltered.push(...activityWithContextDataviews)
  return dataviewsFiltered
}

export function groupContextDataviews(contextDataviews: UrlDataviewInstance[]) {
  return groupBy(contextDataviews, (d) => {
    if (isUserTrackDataview(d)) {
      // This skips the track dataviews groups as is much harder
      // to load just one dataset because of the data loader filtering logic
      return d.id
    }
    const datasets = d.datasets?.map((d) => d.id).join(',')
    return `${d.dataviewId}_${datasets}` as string
  })
}

export function getContextDataviewsResolved(
  contextDataview: UrlDataviewInstance | UrlDataviewInstance[]
): ResolvedContextDataviewInstance[] {
  const contextDataviews = Array.isArray(contextDataview)
    ? contextDataview
    : [contextDataview].filter(Boolean)

  if (!contextDataviews.length) {
    return []
  }

  const hasSingleUserTrackDataview = contextDataviews.filter(isUserTrackDataview).length === 1
  const contextDataviewsGrouped = groupContextDataviews(contextDataviews)

  return Object.values(contextDataviewsGrouped).flatMap((dataviews) => {
    if (!dataviews.length) {
      return []
    }
    const layers = dataviews.flatMap((d) => {
      if (d.config?.layers?.length) {
        return d.config?.layers
      }
      if (d.datasetsConfig?.length) {
        return d.datasetsConfig?.map((d) => ({ id: d.datasetId, dataset: d.datasetId }))
      }
      return []
    })
    const uniqLayers = uniqBy(layers, (l) => l.id)

    const mergedDataviewConfig: ResolvedContextDataviewInstance['config'] = {
      visible: dataviews[0]?.config?.visible ?? true,
      type: dataviews[0]?.config?.type as DataviewType,
      ...(isUserTrackDataview(dataviews[0]) && {
        singleTrack: hasSingleUserTrackDataview,
      }),
      layers: uniqLayers.map((layer) => {
        return {
          id: layer.id,
          dataset: layer.dataset,
          sublayers: dataviews.flatMap((dataview) => {
            return {
              id: layer.id,
              color: dataview.config?.color as string,
              unit: dataview.datasets?.find((d) => d.id === layer.dataset)?.unit,
              dataviewId: dataview.id,
              thickness: dataview.config?.thickness,
              filters: dataview.config?.filters,
              filterOperators: dataview.config?.filterOperators,
            }
          }),
        }
      }),
    }
    const mergedContextDataview: ResolvedContextDataviewInstance = {
      ...dataviews[0],
      id: getMergedDataviewId(dataviews),
      config: mergedDataviewConfig,
    }

    return mergedContextDataview
  })
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
  bivariateDataviews?: [string, string] | null
  activityVisualizationMode?: FourwingsVisualizationMode
  detectionsVisualizationMode?: FourwingsVisualizationMode
  environmentVisualizationMode?: typeof HEATMAP_ID | typeof HEATMAP_LOW_RES_ID
  vesselGroupsVisualizationMode?: typeof FOOTPRINT_ID | typeof FOOTPRINT_HIGH_RES_ID
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
  DataviewType.BasemapImage,
  DataviewType.Context,
  DataviewType.UserContext,
  DataviewType.Polygons,
  DataviewType.HeatmapStatic,
  DataviewType.Heatmap,
  DataviewType.HeatmapAnimated,
  DataviewType.FourwingsTileCluster,
  DataviewType.Track,
  DataviewType.VesselEvents,
  DataviewType.VesselEventsShapes,
  DataviewType.UserPoints,
  DataviewType.BasemapLabels,
  DataviewType.Graticules,
  DataviewType.Bathymetry,
  DataviewType.Rulers,
  DataviewType.Annotation,
]
const HEATMAP_ANIMATED_CATEGORIES_ORDER: DataviewCategory[] = [
  DataviewCategory.Environment,
  DataviewCategory.Detections,
  DataviewCategory.Activity,
  DataviewCategory.VesselGroups,
]

export function getDataviewsSorted(
  dataviews: (UrlDataviewInstance | DataviewInstance)[],
  order = DATAVIEWS_LAYER_ORDER
) {
  return [...(dataviews || [])].reverse().sort((a, b) => {
    const aType = a.config?.type as DataviewType
    const bType = b.config?.type as DataviewType
    const aPos = order.indexOf(aType)
    const bPos = order.indexOf(bType)
    if (aType === DataviewType.HeatmapAnimated && bType === DataviewType.HeatmapAnimated) {
      return (
        HEATMAP_ANIMATED_CATEGORIES_ORDER.indexOf(a.category as DataviewCategory) -
        HEATMAP_ANIMATED_CATEGORIES_ORDER.indexOf(b.category as DataviewCategory)
      )
    }
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

const DATAVIEW_GROUPS_CONFIG = [
  { key: 'activityDataviews' as const, test: isActivityDataview },
  { key: 'detectionDataviews' as const, test: isDetectionsDataview },
  { key: 'environmentalDataviews' as const, test: isEnvironmentalDataview },
  { key: 'staticDataviews' as const, test: isHeatmapStaticDataview },
  { key: 'vectorsDataviews' as const, test: isHeatmapVectorsDataview },
  { key: 'vesselGroupDataview' as const, test: isVesselGroupDataview },
  { key: 'userHeatmapDataviews' as const, test: isUserHeatmapDataview },
  { key: 'vesselTrackDataviews' as const, test: isTrackDataview },
  {
    key: 'contextDataviews' as const,
    test: isAnyContextDataview,
  },
]

type DataviewGroupKey = (typeof DATAVIEW_GROUPS_CONFIG)[number]['key'] | 'otherDataviews'
type DataviewsGrouped = Record<DataviewGroupKey, UrlDataviewInstance[]>

function getDataviewsGrouped(dataviews: UrlDataviewInstance[]): DataviewsGrouped {
  return dataviews.reduce<Record<DataviewGroupKey, UrlDataviewInstance[]>>(
    (acc, dataview) => {
      const key = DATAVIEW_GROUPS_CONFIG.find(({ test }) => test(dataview))?.key || 'otherDataviews'
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(dataview as UrlDataviewInstance)
      return acc
    },
    {} as Record<DataviewGroupKey, UrlDataviewInstance[]>
  )
}

export function getDataviewsResolved(
  dataviews: (UrlDataviewInstance | DataviewInstance)[],
  params: ResolverGlobalConfig = {}
) {
  const {
    activityDataviews = [],
    detectionDataviews = [],
    environmentalDataviews = [],
    staticDataviews = [],
    vectorsDataviews = [],
    vesselGroupDataview = [],
    vesselTrackDataviews = [],
    userHeatmapDataviews = [],
    contextDataviews = [],
    otherDataviews = [],
  } = getDataviewsGrouped(dataviews)

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
        visualizationMode: params.environmentVisualizationMode,
      }) || []
  )
  const staticDataviewsParsed = staticDataviews.flatMap((d) => {
    let visualizationMode = undefined
    if (d.category === DataviewCategory.Environment) {
      visualizationMode = params.environmentVisualizationMode
    } else if (d.category === DataviewCategory.Activity) {
      visualizationMode = params.activityVisualizationMode
    } else if (d.category === DataviewCategory.Detections) {
      visualizationMode = params.detectionsVisualizationMode
    }
    return (
      getFourwingsDataviewsResolved(d, {
        colorRampWhiteEnd:
          d.config?.type === DataviewType.HeatmapStatic ? false : singleHeatmapDataview,
        visualizationMode,
      }) || []
    )
  })
  const vectorsDataviewsParsed = vectorsDataviews.flatMap((dataview) => {
    return {
      ...dataview,
      config: { ...dataview.config, visualizationMode: params.environmentVisualizationMode },
    }
  })

  const vesselGroupDataviewParsed = vesselGroupDataview.flatMap((d) => {
    const comparisonMode = getComparisonMode([d], params)
    return (
      getFourwingsDataviewsResolved(d, {
        visualizationMode:
          comparisonMode === FourwingsComparisonMode.TimeCompare
            ? 'heatmap'
            : params.vesselGroupsVisualizationMode || 'footprint',
        colorRampWhiteEnd: false,
        comparisonMode,
      }) || []
    )
  })

  const userHeatmapDataviewsParsed = getFourwingsDataviewsResolved(userHeatmapDataviews)
  const vesselTrackDataviewsParsed = uniqBy<UrlDataviewInstance, string>(
    vesselTrackDataviews.flatMap((d) => ({
      ...d,
      config: {
        ...d.config,
        singleTrack: vesselTrackDataviews.length === 1,
      },
    })),
    (d) => d.id
  )

  const contextDataviewsParsed = getContextDataviewsResolved(contextDataviews)

  const dataviewsMerged = [
    ...otherDataviews,
    ...staticDataviewsParsed,
    ...vectorsDataviewsParsed,
    ...environmentalDataviewsParsed,
    ...vesselGroupDataviewParsed,
    ...mergedDetectionsDataview,
    ...mergedActivityDataview,
    ...vesselTrackDataviewsParsed,
    ...userHeatmapDataviewsParsed,
    ...contextDataviewsParsed,
  ]
  return dataviewsMerged as ResolvedDataviewInstance[]
}
