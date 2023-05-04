import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
  InteractionEvent,
  TemporalGridFeature,
  useFeatureState,
} from '@globalfishingwatch/react-hooks'
import {
  ContextLayerType,
  GeneratorType,
  GlobalGeneratorConfig,
} from '@globalfishingwatch/layer-composer'
import {
  UrlDataviewInstance,
  MULTILAYER_SEPARATOR,
  isMergedAnimatedGenerator,
} from '@globalfishingwatch/dataviews-client'
import { DataviewCategory, Locale } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { SublayerCombinationMode } from '@globalfishingwatch/fourwings-aggregate'
import { selectWorkspaceVisibleEventsArray } from 'features/workspace/workspace.selectors'
import { selectLocationType } from 'routes/routes.selectors'
import { HOME, USER, WORKSPACE, WORKSPACES_LIST } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import useMapInstance from 'features/map/map-context.hooks'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectHighlightedEvents, setHighlightedEvents } from 'features/timebar/timebar.slice'
import { setHintDismissed } from 'features/hints/hints.slice'
import {
  selectShowTimeComparison,
  selectTimeComparisonValues,
} from 'features/analysis/analysis.selectors'
import { useMapClusterTilesLoaded, useMapSourceTiles } from 'features/map/map-sources.hooks'
import { ENCOUNTER_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectDefaultMapGeneratorsConfig,
  WORKSPACES_POINTS_TYPE,
  WORKSPACE_GENERATOR_ID,
} from './map.selectors'
import {
  setClickedEvent,
  selectClickedEvent,
  MAX_TOOLTIP_LIST,
  MAX_VESSELS_LOAD,
  fetchEncounterEventThunk,
  SliceInteractionEvent,
  selectFishingInteractionStatus,
  selectApiEventStatus,
  ExtendedFeatureVessel,
  ExtendedFeatureEvent,
  fetchFishingActivityInteractionThunk,
  fetchBQEventThunk,
} from './map.slice'
import useViewport from './map-viewport.hooks'

export const SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION = ['activity', 'detections']

export const getVesselsInfoConfig = (vessels: ExtendedFeatureVessel[]) => {
  return {
    vessels,
    numVessels: vessels.length,
    overflow: vessels.length > MAX_TOOLTIP_LIST,
    overflowNumber: vessels.length - MAX_TOOLTIP_LIST,
    overflowLoad: vessels.length > MAX_VESSELS_LOAD,
    overflowLoadNumber: vessels.length - MAX_VESSELS_LOAD,
  }
}

// This is a convenience hook that returns at the same time the portions of the store we interested in
// as well as the functions we need to update the same portions
export const useGeneratorsConnect = () => {
  const { start, end } = useTimerangeConnect()
  const { viewport } = useViewport()
  const { i18n } = useTranslation()
  const generatorsConfig = useSelector(selectDefaultMapGeneratorsConfig)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)
  const visibleEvents = useSelector(selectWorkspaceVisibleEventsArray)
  const sourceTilesLoaded = useMapSourceTiles()
  const updatedGeneratorConfig = useMemo(() => {
    return generatorsConfig.map((generatorConfig, i) => {
      if (generatorConfig.type === GeneratorType.Polygons) {
        return {
          ...generatorConfig,
          opacity: sourceTilesLoaded[generatorConfig.id]?.loaded ? 1 : 0,
        }
      }
      return generatorConfig
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatorsConfig, sourceTilesLoaded])

  return useMemo(() => {
    let globalConfig: GlobalGeneratorConfig = {
      zoom: viewport.zoom,
      start,
      end,
      token: GFWAPI.getToken(),
      locale: i18n.language as Locale,
      visibleEvents,
    }
    if (showTimeComparison && timeComparisonValues) {
      globalConfig = {
        ...globalConfig,
        ...timeComparisonValues,
      }
    }
    return {
      generatorsConfig: updatedGeneratorConfig,
      globalConfig,
    }
  }, [
    viewport.zoom,
    start,
    end,
    i18n.language,
    showTimeComparison,
    timeComparisonValues,
    updatedGeneratorConfig,
    visibleEvents,
  ])
}

export const useClickedEventConnect = () => {
  const map = useMapInstance()
  const dispatch = useAppDispatch()
  const clickedEvent = useSelector(selectClickedEvent)
  const locationType = useSelector(selectLocationType)
  const fishingInteractionStatus = useSelector(selectFishingInteractionStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)
  const { dispatchLocation } = useLocationConnect()
  const { cleanFeatureState } = useFeatureState(map)
  const { setMapCoordinates } = useViewport()
  const tilesClusterLoaded = useMapClusterTilesLoaded()
  const fishingPromiseRef = useRef<any>()
  const presencePromiseRef = useRef<any>()
  const eventsPromiseRef = useRef<any>()

  const cancelPendingInteractionRequests = useCallback(() => {
    const promisesRef = [fishingPromiseRef, presencePromiseRef, eventsPromiseRef]
    promisesRef.forEach((ref) => {
      if (ref.current) {
        ref.current.abort()
      }
    })
  }, [])

  const dispatchClickedEvent = (event: InteractionEvent | null) => {
    if (event === null) {
      dispatch(setClickedEvent(null))
      return
    }
    // Used on workspaces-list or user panel to go to the workspace detail page
    if (locationType === USER || locationType === WORKSPACES_LIST) {
      const workspace = event?.features?.find(
        (feature: any) => feature.properties.type === WORKSPACES_POINTS_TYPE
      )
      if (workspace) {
        const isDefaultWorkspace = workspace.properties.id === DEFAULT_WORKSPACE_ID
        dispatchLocation(
          isDefaultWorkspace ? HOME : WORKSPACE,
          isDefaultWorkspace
            ? {}
            : {
                category:
                  workspace.properties?.category && workspace.properties.category !== 'null'
                    ? workspace.properties.category
                    : WorkspaceCategories.FishingActivity,
                workspaceId: workspace.properties.id,
              },
          true
        )
        const { latitude, longitude, zoom } = workspace.properties
        if (latitude && longitude && zoom) {
          setMapCoordinates({ latitude, longitude, zoom })
        }
        return
      }
    }

    const clusterFeature = event?.features?.find(
      (f) => f.generatorType === GeneratorType.TileCluster
    )
    if (clusterFeature?.properties?.expansionZoom) {
      const { count, expansionZoom, lat, lng, lon } = clusterFeature.properties
      const longitude = lng || lon
      if (count > 1) {
        if (tilesClusterLoaded && lat && longitude) {
          setMapCoordinates({
            latitude: lat,
            longitude,
            zoom: expansionZoom,
          })
          cleanFeatureState('click')
        }
        return
      }
    }

    // Cancel all pending promises
    cancelPendingInteractionRequests()

    if (!event || !event.features) {
      if (clickedEvent) {
        dispatch(setClickedEvent(null))
      }
      return
    }

    // When hovering in a vessel event we don't want to have clicked events
    const areAllFeaturesVesselEvents = event.features.every(
      (f) => f.generatorType === GeneratorType.VesselEvents
    )

    if (areAllFeaturesVesselEvents) {
      return
    }

    dispatch(setClickedEvent(event as SliceInteractionEvent))

    // get temporal grid clicked features and order them by sublayerindex
    const fishingActivityFeatures = event.features
      .filter((feature) => {
        if (!feature.temporalgrid?.visible) {
          return false
        }
        return SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION.includes(
          feature.temporalgrid.sublayerInteractionType
        )
      })
      .sort((feature) => feature.temporalgrid?.sublayerIndex ?? 0)

    if (fishingActivityFeatures?.length) {
      dispatch(setHintDismissed('clickingOnAGridCellToShowVessels'))
      const activityProperties = fishingActivityFeatures.map((feature) =>
        feature.temporalgrid.sublayerInteractionType === 'detections' ? 'detections' : 'hours'
      )
      fishingPromiseRef.current = dispatch(
        fetchFishingActivityInteractionThunk({ fishingActivityFeatures, activityProperties })
      )
    }

    const tileClusterFeature = event.features.find(
      (f) => f.generatorType === GeneratorType.TileCluster
    )
    if (tileClusterFeature) {
      const bqPocQuery = tileClusterFeature.source !== ENCOUNTER_EVENTS_SOURCE_ID
      const fetchFn = bqPocQuery ? fetchBQEventThunk : fetchEncounterEventThunk
      eventsPromiseRef.current = dispatch(fetchFn(tileClusterFeature))
    }
  }

  return {
    clickedEvent,
    fishingInteractionStatus,
    apiEventStatus,
    dispatchClickedEvent,
    cancelPendingInteractionRequests,
  }
}

// TODO this could extend ExtendedFeature
export type TooltipEventFeature = {
  id?: string
  title?: string
  visible?: boolean
  type?: GeneratorType
  color?: string
  unit?: string
  source: string
  sourceLayer: string
  layerId: string
  datasetId?: string
  promoteId?: string
  generatorContextLayer?: ContextLayerType | null
  value: string // TODO Why not a number?
  properties: Record<string, string>
  vesselsInfo?: {
    overflow: boolean
    overflowNumber: number
    overflowLoad: boolean
    overflowLoadNumber: number
    numVessels: number
    vessels: ExtendedFeatureVessel[]
  }
  event?: ExtendedFeatureEvent
  temporalgrid?: TemporalGridFeature
  category: DataviewCategory
}

export type TooltipEvent = {
  latitude: number
  longitude: number
  features: TooltipEventFeature[]
}

export const useMapHighlightedEvent = (features?: TooltipEventFeature[]) => {
  const highlightedEvents = useSelector(selectHighlightedEvents)
  const dispatch = useAppDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceDispatch = useCallback(
    debounce((eventId?: string) => {
      dispatch(setHighlightedEvents(eventId ? [eventId] : undefined))
    }, 100),
    []
  )

  const setHighlightedEventDebounced = useCallback(() => {
    let highlightEvent: string | undefined
    const vesselFeature = features?.find((f) => f.category === DataviewCategory.Vessels)
    const clusterFeature = features?.find((f) => f.type === GeneratorType.TileCluster)
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

export const parseMapTooltipEvent = (
  event: SliceInteractionEvent | null,
  dataviews: UrlDataviewInstance<GeneratorType>[],
  temporalgridDataviews: UrlDataviewInstance<GeneratorType>[]
) => {
  if (!event || !event.features) return null

  const baseEvent = {
    point: event.point,
    latitude: event.latitude,
    longitude: event.longitude,
  }

  const clusterFeature = event.features.find(
    (f) => f.generatorType === GeneratorType.TileCluster && parseInt(f.properties.count) > 1
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

  const tooltipEventFeatures: TooltipEventFeature[] = event.features.flatMap((feature) => {
    const { temporalgrid, generatorId } = feature
    const baseFeature = {
      source: feature.source,
      sourceLayer: feature.sourceLayer,
      layerId: feature.layerId as string,
    }

    if (temporalgrid?.sublayerCombinationMode === SublayerCombinationMode.TimeCompare) {
      return {
        ...baseFeature,
        category: DataviewCategory.Comparison,
        value: event.features[0]?.value,
        visible: true,
        unit: event.features[0]?.temporalgrid?.unit,
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
      // Not needed to create a dataview just for the workspaces list interaction
      if (generatorId && (generatorId as string).includes(WORKSPACE_GENERATOR_ID)) {
        const tooltipWorkspaceFeature: TooltipEventFeature = {
          ...baseFeature,
          type: GeneratorType.GL,
          value: feature.properties.label,
          properties: {},
          category: DataviewCategory.Context,
        }
        return tooltipWorkspaceFeature
      }
      return []
    }

    const title = getDatasetTitleByDataview(dataview)
    const tooltipEventFeature: TooltipEventFeature = {
      title,
      type: dataview.config?.type,
      color: dataview.config?.color || 'black',
      visible: dataview.config?.visible,
      category: dataview.category || DataviewCategory.Context,
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

  if (!tooltipEventFeatures.length) return null
  return {
    ...baseEvent,
    features: tooltipEventFeatures,
  }
}
