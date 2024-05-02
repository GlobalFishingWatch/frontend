import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Locale } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  ResolverGlobalConfig,
  useMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'
import { DeckLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectHighlightedEvents,
  selectHighlightedTime,
  setHighlightedEvents,
} from 'features/timebar/timebar.slice'
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
import { MAX_TOOLTIP_LIST, ExtendedFeatureVessel, selectClickedEvent } from './map.slice'
import { useViewStateAtom } from './map-viewport.hooks'

export const SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION = ['activity', 'detections']

export const getVesselsInfoConfig = (vessels: ExtendedFeatureVessel[]) => {
  if (!vessels?.length) return {}
  return {
    numVessels: vessels.length,
    overflow: vessels.length > MAX_TOOLTIP_LIST,
    overflowNumber: Math.max(vessels.length - MAX_TOOLTIP_LIST, 0),
    overflowLoad: vessels.length > MAX_TOOLTIP_LIST,
    overflowLoadNumber: Math.max(vessels.length - MAX_TOOLTIP_LIST, 0),
  }
}

export const useGlobalConfigConnect = () => {
  const { start, end } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)
  const { viewState } = useViewStateAtom()
  const { i18n } = useTranslation()
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
  const bivariateDataviews = useSelector(selectBivariateDataviews)
  const activityVisualizationMode = useSelector(selectActivityVisualizationMode)
  const detectionsVisualizationMode = useSelector(selectDetectionsVisualizationMode)
  const visibleEvents = useSelector(selectWorkspaceVisibleEventsArray)
  const mapResolution = useSelector(selectMapResolution)
  const clickedFeatures = useSelector(selectClickedEvent)
  const hoverFeatures = useMapHoverInteraction()?.features
  const debug = useSelector(selectDebugOptions)?.debug

  const highlightedFeatures = useMemo(() => {
    return [...(clickedFeatures?.features || []), ...(hoverFeatures || [])]
  }, [clickedFeatures?.features, hoverFeatures])

  return useMemo(() => {
    let globalConfig: ResolverGlobalConfig = {
      zoom: viewState.zoom,
      start,
      end,
      debug,
      token: GFWAPI.getToken(),
      bivariateDataviews,
      activityVisualizationMode,
      detectionsVisualizationMode,
      resolution: mapResolution,
      highlightedTime: highlightedTime || {},
      visibleEvents,
      highlightedFeatures,
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
    bivariateDataviews,
    activityVisualizationMode,
    detectionsVisualizationMode,
    mapResolution,
    highlightedTime,
    visibleEvents,
    highlightedFeatures,
    showTimeComparison,
    timeComparisonValues,
  ])
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

// TODO:deck do this within the deck layer
export const useMapHighlightedEvent = (features?: DeckLayerPickingObject[]) => {
  // const highlightedEvents = useSelector(selectHighlightedEvents)
  // const debounceDispatch = useDebouncedDispatchHighlightedEvent()

  const setHighlightedEventDebounced = useCallback(() => {
    // let highlightEvent: string | undefined
    // const vesselFeature = features?.find((f) => f.category === DataviewCategory.Vessels)
    // const clusterFeature = features?.find((f) => f.type === DataviewType.TileCluster)
    // if (!clusterFeature && vesselFeature) {
    //   highlightEvent = vesselFeature.properties?.id
    // } else if (clusterFeature) {
    //   highlightEvent = clusterFeature.properties?.event_id
    // }
    // if (highlightEvent) {
    //   if (
    //     !highlightedEvents ||
    //     highlightedEvents.length !== 1 ||
    //     highlightedEvents[0] !== highlightEvent
    //   ) {
    //     debounceDispatch(highlightEvent)
    //   }
    // } else if (highlightedEvents && highlightedEvents.length) {
    //   debounceDispatch(undefined)
    // }
  }, [])

  useEffect(() => {
    setHighlightedEventDebounced()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features])
}

// TODO:deck ideally remove this intermediate step
// export const parseMapTooltipFeatures = (
//   features: SliceExtendedFeature[]
//   // dataviews: UrlDataviewInstance<DataviewType>[],
//   // temporalgridDataviews?: UrlDataviewInstance<DataviewType>[]
// ) => {
//   const tooltipEventFeatures: TooltipEventFeature[] = features.flatMap((feature) => {
//     const { category, id, comparisonMode, sublayers } =
//       feature as SliceExtendedFourwingsPickingObject
//     const baseFeature = {
//       category: feature.category,
//       layerId: id as string,
//       type: category,
//     }

//     if (comparisonMode === FourwingsComparisonMode.TimeCompare) {
//       return {
//         ...baseFeature,
//         category: DataviewCategory.Comparison,
//         value: sublayers[0]?.value,
//         visible: true,
//         unit: sublayers[0]?.unit,
//       } as TooltipEventFeature
//     }

//     let dataview

//     if (isMergedAnimatedGenerator(generatorId as string)) {
//       if (!temporalgrid || temporalgrid.sublayerId === undefined || !temporalgrid.visible) {
//         return []
//       }

//       dataview = temporalgridDataviews?.find((dataview) => dataview.id === temporalgrid.sublayerId)
//     } else {
//       dataview = dataviews?.find((dataview) => {
//         // Needed to get only the initial part to support multiple generator
//         // from the same dataview, see map.selectors L137
//         const cleanGeneratorId = (generatorId as string)?.split(MULTILAYER_SEPARATOR)[0]
//         return dataview.id === cleanGeneratorId
//       })
//     }

//     TODO:deck check if this is still neded
//     if (!dataview) {
//       // There are three use cases when there is no dataview and we want interaction
//       // 1. Wworkspaces list
//       if (generatorId && (generatorId as string).includes(WORKSPACE_GENERATOR_ID)) {
//         const tooltipWorkspaceFeature: TooltipEventFeature = {
//           ...baseFeature,
//           type: DataviewType.GL,
//           value: feature.properties.label,
//           properties: {},
//           category: DataviewCategory.Context,
//         }
//         return tooltipWorkspaceFeature
//       }
//       // 2. Report buffer
//       else if (generatorId === REPORT_BUFFER_GENERATOR_ID) {
//         const tooltipWorkspaceFeature: TooltipEventFeature = {
//           ...baseFeature,
//           category: DataviewCategory.Context,
//           properties: {},
//           value: feature.properties.label,
//           visible: true,
//         }
//         return tooltipWorkspaceFeature
//       }
//       // 3. Tools (Annotations and Rulers)
//       else if (generatorType === DataviewType.Annotation || generatorType === DataviewType.Rulers) {
//         const tooltipToolFeature: TooltipEventFeature = {
//           ...baseFeature,
//           category: DataviewCategory.Context,
//           properties: feature.properties,
//           value: feature.properties.label,
//           visible: true,
//         }
//         return tooltipToolFeature
//       }
//       return []
//     }

//     const title = getDatasetTitleByDataview(dataview)

//     const datasets =
//       dataview.category === DataviewCategory.Activity ||
//       dataview.category === DataviewCategory.Detections
//         ? getActiveDatasetsInActivityDataviews([dataview])
//         : (dataview.datasets || [])?.map((d) => d.id)

//     const dataset = dataview?.datasets?.find(({ id }) => datasets.includes(id))
//     const subcategory = dataset?.subcategory as DatasetSubCategory
//     const tooltipEventFeature: TooltipEventFeature = {
//       title,
//       type: dataview.config?.type,
//       color: dataview.config?.color,
//       visible: dataview.config?.visible,
//       category: dataview.category || DataviewCategory.Context,
//       subcategory,
//       datasetSource: dataset?.source,
//       ...feature,
//       properties: { ...feature.properties },
//     }
//     // Insert custom properties by each dataview configuration
//     const properties = dataview.datasetsConfig
//       ? dataview.datasetsConfig.flatMap((datasetConfig) => {
//           if (!datasetConfig.query?.length) return []
//           return datasetConfig.query.flatMap((query) =>
//             query.id === 'properties' ? (query.value as string) : []
//           )
//         })
//       : []
//     properties.forEach((property) => {
//       if (feature.properties[property]) {
//         tooltipEventFeature.properties[property] = feature.properties[property]
//       }
//     })

//     if (feature.vessels) {
//       tooltipEventFeature.vesselsInfo = getVesselsInfoConfig(feature.vessels)
//     }
//     return tooltipEventFeature
//   })
//   return tooltipEventFeatures
// }
