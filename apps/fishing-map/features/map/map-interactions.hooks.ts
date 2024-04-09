import { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { DeckProps, PickingInfo, Position } from '@deck.gl/core'
import { InteractionEventCallback, useSimpleMapHover } from '@globalfishingwatch/react-hooks'
import { ExtendedStyle } from '@globalfishingwatch/layer-composer'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import {
  useMapHoverInteraction,
  useSetMapHoverInteraction,
  useMapClick,
  InteractionEvent,
  DeckLayerInteractionPickingInfo,
  parseDeckPickingInfoToFeatures,
} from '@globalfishingwatch/deck-layer-composer'
import { ClusterPickingObject, FourwingsPickingObject } from '@globalfishingwatch/deck-layers'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { useMapAnnotation } from 'features/map/overlays/annotations/annotations.hooks'
import {
  SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION,
  TooltipEventFeature,
  parseMapTooltipEvent,
  useMapHighlightedEvent,
} from 'features/map/map.hooks'
import useRulers from 'features/map/overlays/rulers/rulers.hooks'
import useMapInstance, { useDeckMap } from 'features/map/map-context.hooks'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getEventLabel } from 'utils/analytics'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import { selectIsMarineManagerLocation, selectLocationType } from 'routes/routes.selectors'
import { useMapClusterTilesLoaded } from 'features/map/map-sources.hooks'
import { WORKSPACES_POINTS_TYPE } from 'features/map/map.config'
import { useMapErrorNotification } from 'features/map/overlays/error-notification/error-notification.hooks'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { selectCurrentDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { DEFAULT_WORKSPACE_ID, DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { ENCOUNTER_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'
import { setHintDismissed } from 'features/help/hints.slice'
import { USER, WORKSPACES_LIST, HOME, WORKSPACE } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import { useMapRulersDrag } from './overlays/rulers/rulers-drag.hooks'
import { isRulerLayerPoint } from './map-interaction.utils'
import {
  SliceInteractionEvent,
  fetchBQEventThunk,
  fetchEncounterEventThunk,
  fetchFishingActivityInteractionThunk,
  selectApiEventStatus,
  selectClickedEvent,
  selectFishingInteractionStatus,
  setClickedEvent,
} from './map.slice'
import { useSetViewState } from './map-viewport.hooks'

function cleanFeatureState(state: any) {
  console.warn('TODO: handle this in deck')
}

export const useClickedEventConnect = () => {
  const map = useMapInstance()
  const dispatch = useAppDispatch()
  const clickedEvent = useSelector(selectClickedEvent)
  const locationType = useSelector(selectLocationType)
  const fishingInteractionStatus = useSelector(selectFishingInteractionStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)
  const { dispatchLocation } = useLocationConnect()
  // const { cleanFeatureState } = useFeatureState(map)
  const setViewState = useSetViewState()
  const { setMapAnnotation } = useMapAnnotation()
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
                payload: {
                  category:
                    workspace.properties?.category && workspace.properties.category !== 'null'
                      ? workspace.properties.category
                      : DEFAULT_WORKSPACE_CATEGORY,
                  workspaceId: workspace.properties.id,
                },
              },
          { replaceQuery: true }
        )
        const { latitude, longitude, zoom } = workspace.properties
        if (latitude && longitude && zoom) {
          setViewState({ latitude, longitude, zoom })
        }
        return
      }
    }

    const clusterFeature = event?.features?.find(
      (f) => f.category === DataviewCategory.Events
    ) as ClusterPickingObject

    if (clusterFeature?.properties?.expansionZoom) {
      const { count, expansionZoom, lat, lon } = clusterFeature.properties
      if (count > 1) {
        if (tilesClusterLoaded && lat && lon) {
          setViewState({
            latitude: lat,
            longitude: lon,
            zoom: expansionZoom,
          })
          cleanFeatureState('click')
        }
        return
      }
    }

    const annotatedFeature = event?.features?.find(
      (f) => f.generatorType === DataviewType.Annotation
    )
    if (annotatedFeature?.properties?.id) {
      setMapAnnotation(annotatedFeature.properties)
      return
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
      (f) => f.generatorType === DataviewType.VesselEvents
    )

    if (areAllFeaturesVesselEvents) {
      return
    }

    dispatch(setClickedEvent(event as SliceInteractionEvent))

    // get temporal grid clicked features and order them by sublayerindex
    const fishingActivityFeatures = (event.features as FourwingsPickingObject[]).filter(
      (feature) => {
        if (feature?.sublayers?.every((sublayer) => !sublayer.visible)) {
          return false
        }
        return SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION.includes(feature.category)
      }
    )

    if (fishingActivityFeatures?.length) {
      dispatch(setHintDismissed('clickingOnAGridCellToShowVessels'))
      const activityProperties = fishingActivityFeatures.map((feature) =>
        feature.category === 'detections' ? 'detections' : 'hours'
      )
      fishingPromiseRef.current = dispatch(
        fetchFishingActivityInteractionThunk({ fishingActivityFeatures, activityProperties })
      )
    }

    const tileClusterFeature = event.features.find(
      (f) => f.generatorType === DataviewType.TileCluster
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

const defaultEmptyFeatures = [] as DeckLayerInteractionPickingInfo[]
export const useMapMouseHover = (style?: ExtendedStyle) => {
  const map = useDeckMap()
  const setMapHoverFeatures = useSetMapHoverInteraction()
  const { isMapDrawing } = useMapDrawConnect()
  const { isMapAnnotating } = useMapAnnotation()
  const { onRulerMapHover, rulersEditing } = useRulers()
  const dataviews = useSelector(selectCurrentDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)

  const [hoveredEvent, setHoveredEvent] = useState<SliceInteractionEvent | null>(null)
  const [hoveredDebouncedEvent, setHoveredDebouncedEvent] = useState<SliceInteractionEvent | null>(
    null
  )

  const onSimpleMapHover = useSimpleMapHover(setHoveredEvent as InteractionEventCallback)
  // const onMapHover = useMapHover(
  //   setHoveredEvent as InteractionEventCallback,
  //   setHoveredDebouncedEvent as InteractionEventCallback,
  //   map,
  //   style?.metadata
  // )

  const onMouseMove: DeckProps['onHover'] = useCallback(
    (info: PickingInfo, event: any) => {
      if (!map || !info.coordinate) return

      let features = defaultEmptyFeatures
      try {
        features = map?.pickMultipleObjects({
          x: info.x,
          y: info.y,
          radius: 0,
        }) as DeckLayerInteractionPickingInfo[]
      } catch (e) {
        console.warn(e)
      }

      setMapHoverFeatures({
        longitude: info.coordinate[0],
        latitude: info.coordinate[1],
        features,
      })
      // onRulerDrag(features)

      if (rulersEditing) {
        onRulerMapHover(info)
      }
    },
    [map, onRulerMapHover, rulersEditing, setMapHoverFeatures]
  )

  const hoveredTooltipEvent = parseMapTooltipEvent(hoveredEvent, dataviews, temporalgridDataviews)
  useMapHighlightedEvent(hoveredTooltipEvent?.features)

  // const resetHoverState = useCallback(() => {
  //   setHoveredEvent(null)
  //   setHoveredDebouncedEvent(null)
  //   cleanFeatureState('hover')
  // }, [cleanFeatureState])

  return {
    onMouseMove,
    // resetHoverState,
    hoveredEvent,
    hoveredDebouncedEvent,
    hoveredTooltipEvent,
  }
}

// Hook to wrap the custom tools click interactions with the map that has more priority
// returning undefined when not handled so we can continue with the propagation
export const useHandleMapToolsClick = () => {
  const { isMapDrawing } = useMapDrawConnect()
  const { isMapAnnotating, addMapAnnotation } = useMapAnnotation()
  const { isErrorNotificationEditing, addErrorNotification } = useMapErrorNotification()
  const { onRulerMapClick, rulersEditing } = useRulers()
  const isMarineManagerLocation = useSelector(selectIsMarineManagerLocation)
  const handleMapClickInteraction = useCallback(
    (interaction: InteractionEvent) => {
      const { latitude, longitude, features } = interaction
      const position = [longitude, latitude] as Position
      if (isMapAnnotating) {
        return addMapAnnotation(position)
      }
      if (isErrorNotificationEditing) {
        return addErrorNotification(position)
      }
      if (rulersEditing) {
        return onRulerMapClick(position)
      }
      return undefined
    },
    [
      addErrorNotification,
      addMapAnnotation,
      isErrorNotificationEditing,
      isMapAnnotating,
      onRulerMapClick,
      rulersEditing,
    ]
  )
  return handleMapClickInteraction
}

export const useMapMouseClick = () => {
  // const map = useMapInstance()
  const map = useDeckMap()
  const handleMapToolsClick = useHandleMapToolsClick()
  // const setMapClickFeatures = useSetMapClickInteraction()
  const dataviews = useSelector(selectCurrentDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const { clickedEvent, dispatchClickedEvent } = useClickedEventConnect()

  const onClick = useMapClick(dispatchClickedEvent)
  const clickedTooltipEvent = parseMapTooltipEvent(clickedEvent, dataviews, temporalgridDataviews)

  const clickedCellLayers = useMemo(() => {
    if (!clickedEvent || !clickedTooltipEvent) return

    const layersByCategory = (clickedTooltipEvent?.features ?? [])
      .sort(
        (a, b) =>
          POPUP_CATEGORY_ORDER.indexOf(a.category) - POPUP_CATEGORY_ORDER.indexOf(b.category)
      )
      .reduce(
        (prev: Record<string, TooltipEventFeature[]>, current) => ({
          ...prev,
          [current.category]: [...(prev[current.category] ?? []), current],
        }),
        {} as Record<string, TooltipEventFeature[]>
      )

    return Object.entries(layersByCategory).map(
      ([featureCategory, features]) =>
        `${featureCategory}: ${(features as any[]).map((f) => f.layerId).join(',')}`
    )
  }, [clickedEvent, clickedTooltipEvent])

  const onMapClick: DeckProps['onClick'] = useCallback(
    (info: PickingInfo, event: any) => {
      if (!map || !info.coordinate) return
      if (event.srcEvent.defaultPrevented) {
        // this is needed to allow interacting with overlay elements content
        return true
      }
      trackEvent({
        category: TrackCategory.EnvironmentalData,
        action: `Click in grid cell`,
        label: getEventLabel(clickedCellLayers ?? []),
      })
      let features = defaultEmptyFeatures
      try {
        features = map?.pickMultipleObjects({
          x: info.x,
          y: info.y,
          radius: 0,
        }) as DeckLayerInteractionPickingInfo[]
      } catch (e) {
        console.warn(e)
      }

      const mapClickInteraction: InteractionEvent = {
        type: 'click',
        longitude: info.coordinate[0],
        latitude: info.coordinate[1],
        point: { x: info.x, y: info.y },
        features: parseDeckPickingInfoToFeatures(features),
      }

      const toolsClickedHandled = handleMapToolsClick(mapClickInteraction) !== undefined
      if (!toolsClickedHandled) {
        onClick(mapClickInteraction)
      }
    },
    [map, clickedCellLayers, handleMapToolsClick, onClick]
  )

  return { onMapClick, clickedTooltipEvent }
}

const hasTooltipEventFeature = (
  hoveredTooltipEvent: ReturnType<typeof parseMapTooltipEvent>,
  type: DataviewType
) => {
  return hoveredTooltipEvent?.features.find((f) => f.type === type) !== undefined
}

const hasToolFeature = (hoveredTooltipEvent?: ReturnType<typeof parseMapTooltipEvent>) => {
  if (!hoveredTooltipEvent) return false
  return (
    hasTooltipEventFeature(hoveredTooltipEvent, DataviewType.Annotation) ||
    hasTooltipEventFeature(hoveredTooltipEvent, DataviewType.Rulers)
  )
}

export const _deprecatedUseMapCursor = (
  hoveredTooltipEvent?: ReturnType<typeof parseMapTooltipEvent>
) => {
  const map = useMapInstance()
  const { isMapAnnotating } = useMapAnnotation()
  const { isErrorNotificationEditing } = useMapErrorNotification()
  const { isMapDrawing } = useMapDrawConnect()
  const { rulersEditing } = useRulers()
  const gfwUser = useSelector(selectIsGFWUser)
  const isMarineManagerLocation = useSelector(selectIsMarineManagerLocation)
  const dataviews = useSelector(selectCurrentDataviewInstancesResolved)
  const tilesClusterLoaded = useMapClusterTilesLoaded()

  const getCursor = useCallback(() => {
    if (hoveredTooltipEvent && hasToolFeature(hoveredTooltipEvent)) {
      if (hasTooltipEventFeature(hoveredTooltipEvent, DataviewType.Annotation) && !gfwUser) {
        return 'grab'
      }
      return 'all-scroll'
    } else if (isMapAnnotating || rulersEditing || isErrorNotificationEditing) {
      return 'crosshair'
    } else if (isMapDrawing || isMarineManagerLocation) {
      // updating cursor using css at style.css as the library sets classes depending on the state
      return undefined
    } else if (hoveredTooltipEvent) {
      // Workaround to fix cluster events duplicated, only working for encounters and needs
      // TODO if wanted to scale it to other layers
      const clusterConfig = dataviews.find((d) => d.config?.type === DataviewType.TileCluster)
      const eventsCount = clusterConfig?.config?.duplicatedEventsWorkaround ? 2 : 1

      const clusterFeature = hoveredTooltipEvent.features.find(
        (f) => f.type === DataviewType.TileCluster && parseInt(f.properties.count) > eventsCount
      )

      if (clusterFeature) {
        if (!tilesClusterLoaded) {
          return 'progress'
        }
        const { expansionZoom, lat, lng, lon } = clusterFeature.properties
        const longitude = lng || lon
        return expansionZoom && lat && longitude ? 'zoom-in' : 'grab'
      }
      const vesselFeatureEvents = hoveredTooltipEvent.features.filter(
        (f) => f.category === DataviewCategory.Vessels
      )
      if (vesselFeatureEvents.length > 1) {
        return 'grab'
      }
      return 'pointer'
    } else if (map?.isMoving()) {
      return 'grabbing'
    }
    return 'grab'
  }, [
    hoveredTooltipEvent,
    isMapAnnotating,
    rulersEditing,
    isErrorNotificationEditing,
    isMapDrawing,
    isMarineManagerLocation,
    map,
    gfwUser,
    dataviews,
    tilesClusterLoaded,
  ])

  return getCursor()
}

export const useMapCursor = () => {
  const { isMapAnnotating } = useMapAnnotation()
  const { isErrorNotificationEditing } = useMapErrorNotification()
  const { rulersEditing } = useRulers()
  const hoverFeatures = useMapHoverInteraction()?.features
  const getCursor = useCallback(
    ({ isDragging }: { isDragging: boolean }) => {
      if (isMapAnnotating || isErrorNotificationEditing || rulersEditing) {
        if (rulersEditing && hoverFeatures.some(isRulerLayerPoint)) {
          return 'move'
        }
        return 'crosshair'
      } else if (isDragging) {
        return 'grabbing'
      }
      return 'grab'
    },
    [hoverFeatures, isErrorNotificationEditing, isMapAnnotating, rulersEditing]
  )
  return { getCursor }
}

export const useMapDrag = () => {
  const map = useDeckMap()
  const { rulersEditing } = useRulers()
  const { onRulerDrag, onRulerDragStart, onRulerDragEnd } = useMapRulersDrag()

  const onMapDragStart = useCallback(
    (info: PickingInfo, event: any) => {
      if (!map || !info.coordinate) return
      if (rulersEditing) {
        try {
          const features = map?.pickMultipleObjects({
            x: info.x,
            y: info.y,
            radius: 0,
          })
          onRulerDragStart(info, features)
        } catch (e) {
          console.warn(e)
        }
      }
    },
    [map, onRulerDragStart, rulersEditing]
  )

  const onMapDrag = useCallback(
    (info: PickingInfo, event: any) => {
      if (!info.coordinate) return
      if (rulersEditing) {
        onRulerDrag(info)
      }
    },
    [onRulerDrag, rulersEditing]
  )

  const onMapDragEnd = useCallback(
    (info: PickingInfo, event: any) => {
      if (!info.coordinate) return
      if (rulersEditing) {
        onRulerDragEnd()
      }
    },
    [onRulerDragEnd, rulersEditing]
  )
  return { onMapDrag, onMapDragStart, onMapDragEnd }
}
