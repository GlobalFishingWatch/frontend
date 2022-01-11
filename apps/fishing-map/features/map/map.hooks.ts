import { useSelector, useDispatch } from 'react-redux'
import { Geometry } from 'geojson'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { debounce } from 'lodash'
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
  MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
} from '@globalfishingwatch/dataviews-client'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { SublayerCombinationMode } from '@globalfishingwatch/fourwings-aggregate'
import { ENCOUNTER_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'
import { selectLocationType } from 'routes/routes.selectors'
import { HOME, USER, WORKSPACE, WORKSPACES_LIST } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import useMapInstance from 'features/map/map-context.hooks'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectHighlightedEvent, setHighlightedEvent } from 'features/timebar/timebar.slice'
import { setHintDismissed } from 'features/help/hints/hints.slice'
import {
  selectShowTimeComparison,
  selectTimeComparisonValues,
} from 'features/analysis/analysis.selectors'
import { useMapSourceTilesLoaded } from 'features/map/map-sources.hooks'
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
  fetchViirsInteractionThunk,
  selectViirsInteractionStatus,
  ApiViirsStats,
} from './map.slice'
import useViewport from './map-viewport.hooks'

export const SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION = [
  'fishing-effort',
  'presence-detail',
  'viirs-match',
]
// TODO remove once match-prototype is ready for production
export const SUBLAYER_INTERACTION_TYPES_WITH_VIIRS_INTERACTION = ['viirs']

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
  const generatorsConfig = useSelector(selectDefaultMapGeneratorsConfig)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const timeComparisonValues = useSelector(selectTimeComparisonValues)

  return useMemo(() => {
    let globalConfig: GlobalGeneratorConfig = {
      zoom: viewport.zoom,
      start,
      end,
      token: GFWAPI.getToken(),
    }
    if (showTimeComparison && timeComparisonValues) {
      globalConfig = {
        ...globalConfig,
        ...timeComparisonValues,
      }
    }
    return {
      generatorsConfig,
      globalConfig,
    }
  }, [generatorsConfig, viewport.zoom, start, end, timeComparisonValues, showTimeComparison])
}

export const useClickedEventConnect = () => {
  const map = useMapInstance()
  const dispatch = useDispatch()
  const clickedEvent = useSelector(selectClickedEvent)
  const locationType = useSelector(selectLocationType)
  const fishingInteractionStatus = useSelector(selectFishingInteractionStatus)
  const viirsInteractionStatus = useSelector(selectViirsInteractionStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)
  const { dispatchLocation } = useLocationConnect()
  const { cleanFeatureState } = useFeatureState(map)
  const { setMapCoordinates } = useViewport()
  const encounterSourceLoaded = useMapSourceTilesLoaded(ENCOUNTER_EVENTS_SOURCE_ID)
  const fishingPromiseRef = useRef<any>()
  const presencePromiseRef = useRef<any>()
  const viirsPromiseRef = useRef<any>()
  const eventsPromiseRef = useRef<any>()

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
      const { count, expansionZoom, lat, lng } = clusterFeature.properties
      if (count > 1) {
        if (encounterSourceLoaded) {
          setMapCoordinates({
            latitude: lat,
            longitude: lng,
            zoom: expansionZoom,
          })
          cleanFeatureState('click')
        }
        return
      }
    }

    // Cancel all pending promises
    const promisesRef = [fishingPromiseRef, presencePromiseRef, viirsPromiseRef, eventsPromiseRef]
    promisesRef.forEach((ref) => {
      if (ref.current) {
        ref.current.abort()
      }
    })

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
      const activityProperty = fishingActivityFeatures.some(
        (feature) => feature.temporalgrid.sublayerInteractionType === 'viirs-match'
      )
        ? 'detections'
        : 'hours'
      fishingPromiseRef.current = dispatch(
        fetchFishingActivityInteractionThunk({ fishingActivityFeatures, activityProperty })
      )
    }

    const viirsFeature = event.features?.find((feature) => {
      if (!feature.temporalgrid) {
        return false
      }
      const isFeatureVisible = feature.temporalgrid.visible
      const isViirsFeature = SUBLAYER_INTERACTION_TYPES_WITH_VIIRS_INTERACTION.includes(
        feature.temporalgrid.sublayerInteractionType
      )
      return isFeatureVisible && isViirsFeature
    })

    if (viirsFeature) {
      viirsPromiseRef.current = dispatch(fetchViirsInteractionThunk({ feature: viirsFeature }))
    }

    const encounterFeature = event.features.find(
      (f) => f.generatorType === GeneratorType.TileCluster
    )
    if (encounterFeature) {
      eventsPromiseRef.current = dispatch(fetchEncounterEventThunk(encounterFeature))
    }
  }
  return {
    clickedEvent,
    fishingInteractionStatus,
    viirsInteractionStatus,
    apiEventStatus,
    dispatchClickedEvent,
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
  generatorContextLayer?: ContextLayerType | null
  geometry?: Geometry
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
  viirs?: ApiViirsStats[]
  temporalgrid?: TemporalGridFeature
  category: DataviewCategory
}

export type TooltipEvent = {
  latitude: number
  longitude: number
  features: TooltipEventFeature[]
}

export const useMapHighlightedEvent = (features?: TooltipEventFeature[]) => {
  const highlightedEvent = useSelector(selectHighlightedEvent)
  const dispatch = useDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceDispatch = useCallback(
    debounce((event: any) => {
      dispatch(setHighlightedEvent(event))
    }, 100),
    []
  )

  const setHighlightedEventDebounced = useCallback(() => {
    let highlightEvent: { id: string } | undefined
    const vesselFeature = features?.find((f) => f.category === DataviewCategory.Vessels)
    const clusterFeature = features?.find((f) => f.type === GeneratorType.TileCluster)
    if (!clusterFeature && vesselFeature) {
      highlightEvent = { id: vesselFeature.properties?.id }
    } else if (clusterFeature) {
      highlightEvent = { id: clusterFeature.properties?.event_id }
    }
    if (highlightEvent) {
      if (highlightedEvent?.id !== highlightEvent.id) {
        debounceDispatch(highlightEvent)
      }
    } else if (highlightedEvent) {
      debounceDispatch(undefined)
    }
  }, [features, highlightedEvent, debounceDispatch])

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
    if (generatorId === MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID) {
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

    const title = getDatasetTitleByDataview(dataview, true)
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
