import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
  UrlDataviewInstance,
  MULTILAYER_SEPARATOR,
  isMergedAnimatedGenerator,
} from '@globalfishingwatch/dataviews-client'
import {
  DatasetSubCategory,
  DataviewCategory,
  DataviewType,
  Locale,
} from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { SublayerCombinationMode } from '@globalfishingwatch/fourwings-aggregate'
import { ResolverGlobalConfig } from '@globalfishingwatch/deck-layer-composer'
import {
  getActiveDatasetsInActivityDataviews,
  getDatasetTitleByDataview,
} from 'features/datasets/datasets.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectHighlightedEvents, setHighlightedEvents } from 'features/timebar/timebar.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectShowTimeComparison,
  selectTimeComparisonValues,
} from 'features/reports/reports.selectors'
import {
  selectActivityVisualizationMode,
  selectBivariateDataviews,
  selectDetectionsVisualizationMode,
  selectMapResolution,
} from 'features/app/selectors/app.selectors'
import { selectWorkspaceVisibleEventsArray } from 'features/workspace/workspace.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { WORKSPACE_GENERATOR_ID, REPORT_BUFFER_GENERATOR_ID } from './map.config'
import {
  MAX_TOOLTIP_LIST,
  SliceInteractionEvent,
  ExtendedFeatureVessel,
  SliceExtendedFeature,
} from './map.slice'
import { useViewStateAtom } from './map-viewport.hooks'

export const SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION = ['activity', 'detections']

export const getVesselsInfoConfig = (vessels: ExtendedFeatureVessel[]) => {
  return {
    vessels,
    numVessels: vessels.length,
    overflow: vessels.length > MAX_TOOLTIP_LIST,
    overflowNumber: vessels.length - MAX_TOOLTIP_LIST,
    overflowLoad: vessels.length > MAX_TOOLTIP_LIST,
    overflowLoadNumber: vessels.length - MAX_TOOLTIP_LIST,
  }
}

export const useGlobalConfigConnect = () => {
  const { start, end } = useTimerangeConnect()
  const { viewState } = useViewStateAtom()
  const { i18n } = useTranslation()
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
  const bivariateDataviews = useSelector(selectBivariateDataviews)
  const activityVisualizationMode = useSelector(selectActivityVisualizationMode)
  const detectionsVisualizationMode = useSelector(selectDetectionsVisualizationMode)
  const visibleEvents = useSelector(selectWorkspaceVisibleEventsArray)
  const mapResolution = useSelector(selectMapResolution)
  const debug = useSelector(selectDebugOptions)?.debug

  return useMemo(() => {
    let globalConfig: ResolverGlobalConfig = {
      zoom: viewState.zoom,
      start,
      end,
      debug,
      token: GFWAPI.getToken(),
      locale: i18n.language as Locale,
      bivariateDataviews,
      activityVisualizationMode,
      detectionsVisualizationMode,
      resolution: mapResolution,
      visibleEvents,
    }
    if (showTimeComparison && timeComparisonValues) {
      globalConfig = {
        ...globalConfig,
        ...timeComparisonValues,
      }
    }
    return globalConfig
  }, [
    viewState.zoom,
    start,
    end,
    debug,
    i18n.language,
    bivariateDataviews,
    activityVisualizationMode,
    detectionsVisualizationMode,
    mapResolution,
    visibleEvents,
    showTimeComparison,
    timeComparisonValues,
  ])
}

// TODO:deck fuerte
// hack to allow building the app wihtout migrating the rest of the interactions
// needs to be updated with the new deck-layers
export type TooltipEventFeatureVesselsInfo = {
  overflow: boolean
  overflowNumber: number
  overflowLoad: boolean
  overflowLoadNumber: number
  numVessels: number
  vessels: ExtendedFeatureVessel[]
}
export type TooltipEventFeature = {
  vesselsInfo?: TooltipEventFeatureVesselsInfo
  [key: string]: any
}
// export type TooltipEventFeature = {
//   category: DataviewCategory
//   color?: string
//   datasetId?: string
//   datasetSource?: string
//   event?: ExtendedFeatureEvent
//   generatorContextLayer?: ContextLayerType | null
//   geometry?: Point | Polygon | MultiPolygon
//   id?: string
//   layerId: string
//   promoteId?: string
//   properties: Record<string, string>
//   source: string
//   sourceLayer: string
//   subcategory?: DatasetSubCategory
//   temporalgrid?: TemporalGridFeature
//   title?: string
//   type?: DataviewType
//   unit?: string
//   value: string // TODO Why not a number?
//   visible?: boolean
//   vesselsInfo?: {
//     overflow: boolean
//     overflowNumber: number
//     overflowLoad: boolean
//     overflowLoadNumber: number
//     numVessels: number
//     vessels: ExtendedFeatureVessel[]
//   }
// }

export type TooltipEvent = {
  latitude: number
  longitude: number
  features: TooltipEventFeature[]
}

export const useDebouncedDispatchHighlightedEvent = () => {
  const dispatch = useAppDispatch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    debounce((eventIds?: string | string[]) => {
      let ids: string[] | undefined
      if (eventIds) {
        ids = Array.isArray(eventIds) ? eventIds : [eventIds]
      }
      dispatch(setHighlightedEvents(ids))
    }, 100),
    []
  )
}

export const useMapHighlightedEvent = (features?: TooltipEventFeature[]) => {
  const highlightedEvents = useSelector(selectHighlightedEvents)
  const debounceDispatch = useDebouncedDispatchHighlightedEvent()

  const setHighlightedEventDebounced = useCallback(() => {
    let highlightEvent: string | undefined
    const vesselFeature = features?.find((f) => f.category === DataviewCategory.Vessels)
    const clusterFeature = features?.find((f) => f.type === DataviewType.TileCluster)
    if (!clusterFeature && vesselFeature) {
      highlightEvent = vesselFeature.properties?.id
    } else if (clusterFeature) {
      highlightEvent = clusterFeature.properties?.event_id
    }
    if (highlightEvent) {
      if (
        !highlightedEvents ||
        highlightedEvents.length !== 1 ||
        highlightedEvents[0] !== highlightEvent
      ) {
        debounceDispatch(highlightEvent)
      }
    } else if (highlightedEvents && highlightedEvents.length) {
      debounceDispatch(undefined)
    }
  }, [features, highlightedEvents, debounceDispatch])

  useEffect(() => {
    setHighlightedEventDebounced()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features])
}

export const parseMapTooltipFeatures = (
  features: SliceExtendedFeature[],
  dataviews: UrlDataviewInstance<DataviewType>[],
  temporalgridDataviews?: UrlDataviewInstance<DataviewType>[]
): TooltipEventFeature[] => {
  const tooltipEventFeatures: TooltipEventFeature[] = features.flatMap((feature) => {
    const { temporalgrid, generatorId, generatorType } = feature
    const baseFeature = {
      source: feature.source,
      sourceLayer: feature.sourceLayer,
      layerId: feature.layerId as string,
      type: generatorType as DataviewType,
    }

    if (temporalgrid?.sublayerCombinationMode === SublayerCombinationMode.TimeCompare) {
      return {
        ...baseFeature,
        category: DataviewCategory.Comparison,
        value: features[0]?.value,
        visible: true,
        unit: features[0]?.temporalgrid?.unit,
      } as TooltipEventFeature
    }

    let dataview

    if (isMergedAnimatedGenerator(generatorId as string)) {
      if (!temporalgrid || temporalgrid.sublayerId === undefined || !temporalgrid.visible) {
        return []
      }

      dataview = temporalgridDataviews?.find((dataview) => dataview.id === temporalgrid.sublayerId)
    } else {
      dataview = dataviews?.find((dataview) => {
        // Needed to get only the initial part to support multiple generator
        // from the same dataview, see map.selectors L137
        const cleanGeneratorId = (generatorId as string)?.split(MULTILAYER_SEPARATOR)[0]
        return dataview.id === cleanGeneratorId
      })
    }

    if (!dataview) {
      // There are three use cases when there is no dataview and we want interaction
      // 1. Wworkspaces list
      if (generatorId && (generatorId as string).includes(WORKSPACE_GENERATOR_ID)) {
        const tooltipWorkspaceFeature: TooltipEventFeature = {
          ...baseFeature,
          type: DataviewType.GL,
          value: feature.properties.label,
          properties: {},
          category: DataviewCategory.Context,
        }
        return tooltipWorkspaceFeature
      }
      // 2. Report buffer
      else if (generatorId === REPORT_BUFFER_GENERATOR_ID) {
        const tooltipWorkspaceFeature: TooltipEventFeature = {
          ...baseFeature,
          category: DataviewCategory.Context,
          properties: {},
          value: feature.properties.label,
          visible: true,
        }
        return tooltipWorkspaceFeature
      }
      // 3. Tools (Annotations and Rulers)
      else if (generatorType === DataviewType.Annotation || generatorType === DataviewType.Rulers) {
        const tooltipToolFeature: TooltipEventFeature = {
          ...baseFeature,
          category: DataviewCategory.Context,
          properties: feature.properties,
          value: feature.properties.label,
          visible: true,
        }
        return tooltipToolFeature
      }
      return []
    }

    const title = getDatasetTitleByDataview(dataview)

    const datasets =
      dataview.category === DataviewCategory.Activity ||
      dataview.category === DataviewCategory.Detections
        ? getActiveDatasetsInActivityDataviews([dataview])
        : (dataview.datasets || [])?.map((d) => d.id)

    const dataset = dataview?.datasets?.find(({ id }) => datasets.includes(id))
    const subcategory = dataset?.subcategory as DatasetSubCategory
    const tooltipEventFeature: TooltipEventFeature = {
      title,
      type: dataview.config?.type,
      color: dataview.config?.color,
      visible: dataview.config?.visible,
      category: dataview.category || DataviewCategory.Context,
      subcategory,
      datasetSource: dataset?.source,
      ...feature,
      properties: { ...feature.properties },
    }
    // Insert custom properties by each dataview configuration
    const properties = dataview.datasetsConfig
      ? dataview.datasetsConfig.flatMap((datasetConfig) => {
          if (!datasetConfig.query?.length) return []
          return datasetConfig.query.flatMap((query) =>
            query.id === 'properties' ? (query.value as string) : []
          )
        })
      : []
    properties.forEach((property) => {
      if (feature.properties[property]) {
        tooltipEventFeature.properties[property] = feature.properties[property]
      }
    })

    if (feature.vessels) {
      tooltipEventFeature.vesselsInfo = getVesselsInfoConfig(feature.vessels)
    }
    return tooltipEventFeature
  })
  return tooltipEventFeatures
}

export const parseMapTooltipEvent = (
  event: SliceInteractionEvent | null,
  dataviews: UrlDataviewInstance<DataviewType>[],
  temporalgridDataviews: UrlDataviewInstance<DataviewType>[]
) => {
  if (!event || !event.features) return null

  const baseEvent = {
    point: event.point,
    latitude: event.latitude,
    longitude: event.longitude,
  }

  const clusterFeature = event.features.find(
    (f) => f.generatorType === DataviewType.TileCluster && parseInt(f.properties.count) > 1
  )

  // We don't want to show anything else when hovering a cluster point
  if (clusterFeature) {
    return {
      ...baseEvent,
      features: [
        {
          type: clusterFeature.generatorType,
          properties: clusterFeature.properties,
        } as TooltipEventFeature,
      ],
    }
  }
  const tooltipEventFeatures = parseMapTooltipFeatures(
    event.features,
    dataviews,
    temporalgridDataviews
  )
  if (!tooltipEventFeatures.length) return null
  return {
    ...baseEvent,
    features: tooltipEventFeatures,
  }
}
