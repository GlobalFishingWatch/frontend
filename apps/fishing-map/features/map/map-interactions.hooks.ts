import { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { DeckProps, PickingInfo } from '@deck.gl/core'
import type { MjolnirPointerEvent } from 'mjolnir.js'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import {
  useMapHoverInteraction,
  useSetMapHoverInteraction,
  InteractionEvent,
  InteractionEventType,
} from '@globalfishingwatch/deck-layer-composer'
import {
  ClusterPickingObject,
  DeckLayerInteractionPickingInfo,
  FourwingsHeatmapPickingObject,
} from '@globalfishingwatch/deck-layers'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { useMapAnnotation } from 'features/map/overlays/annotations/annotations.hooks'
import { SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION } from 'features/map/map.hooks'
import useRulers from 'features/map/overlays/rulers/rulers.hooks'
import { useDeckMap } from 'features/map/map-context.hooks'
import { useMapErrorNotification } from 'features/map/overlays/error-notification/error-notification.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setHintDismissed } from 'features/help/hints.slice'
import { ENCOUNTER_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'
import { useMapRulersDrag } from './overlays/rulers/rulers-drag.hooks'
import { isRulerLayerPoint } from './map-interaction.utils'
import {
  SliceExtendedClusterPickingObject,
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
import { useDrawLayer } from './overlays/draw/draw.hooks'

export const useClickedEventConnect = () => {
  const dispatch = useAppDispatch()
  const clickedEvent = useSelector(selectClickedEvent)
  const fishingInteractionStatus = useSelector(selectFishingInteractionStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)
  const setViewState = useSetViewState()
  const { isMapAnnotating, addMapAnnotation } = useMapAnnotation()
  const { isErrorNotificationEditing, addErrorNotification } = useMapErrorNotification()
  const { rulersEditing, onRulerMapClick } = useRulers()
  // TODO:deck tilesClusterLoaded from Layer instance
  const tilesClusterLoaded = true
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
    if (isMapAnnotating) {
      addMapAnnotation([event.longitude, event.latitude])
      return
    }
    if (isErrorNotificationEditing) {
      addErrorNotification([event.longitude, event.latitude])
      return
    }
    if (rulersEditing) {
      onRulerMapClick([event.longitude, event.latitude])
      return
    }

    const clusterFeature = event?.features?.find(
      (f) => (f as ClusterPickingObject).category === DataviewCategory.Events
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
    // TODO:deck fix this
    // const vesselEventFeatures = event.features.filter(
    //   (f) =>
    //     f.generatorType === GeneratorType.VesselEvents ||
    //     f.generatorType === GeneratorType.VesselEventsShapes
    // )
    // if (vesselEventFeatures?.length) {
    //   vesselEventFeatures.forEach((feature) => {
    //     if (feature.properties) {
    //       trackEvent({
    //         category: TrackCategory.Tracks,
    //         action: `click_${feature.properties.type}_event_from_track`,
    //         label: feature.properties.vesselId,
    //       })
    //     }
    //   })
    //   const areAllFeaturesVesselEvents = vesselEventFeatures.length === event.features.length
    //   if (areAllFeaturesVesselEvents) {
    //     return
    //   }
    // }

    dispatch(setClickedEvent(event as SliceInteractionEvent))

    // get temporal grid clicked features and order them by sublayerindex
    const fishingActivityFeatures = (event.features as FourwingsHeatmapPickingObject[]).filter(
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
      (f) => f.category === DataviewCategory.Events && f.subcategory === DataviewType.TileCluster
    ) as SliceExtendedClusterPickingObject
    if (tileClusterFeature) {
      const bqPocQuery = tileClusterFeature.layerId !== ENCOUNTER_EVENTS_SOURCE_ID
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

export const useGetPickingInteraction = () => {
  const map = useDeckMap()

  const getPickingInteraction = useCallback(
    (info: PickingInfo, type: InteractionEventType): InteractionEvent | undefined => {
      if (!map || !info?.coordinate) {
        return
      }
      let pickingInfo = [] as DeckLayerInteractionPickingInfo[]
      try {
        pickingInfo = map?.pickMultipleObjects({
          x: info.x,
          y: info.y,
          radius: 0,
        }) as DeckLayerInteractionPickingInfo[]
      } catch (e) {
        console.warn(e)
      }
      const uniqFeatureIds = [] as string[]
      const features = pickingInfo.flatMap((f) => {
        if (f.object?.id) {
          if (!uniqFeatureIds.includes(f.object.id as string)) {
            uniqFeatureIds.push(f.object.id as string)
            return f.object
          }
          return []
        }
        return f.object || []
      })
      return {
        ...info,
        type,
        longitude: info.coordinate[0],
        latitude: info.coordinate[1],
        point: { x: info.x, y: info.y },
        features,
      }
    },
    [map]
  )
  return getPickingInteraction
}

export const useMapMouseHover = () => {
  const getPickingInteraction = useGetPickingInteraction()
  const setMapHoverFeatures = useSetMapHoverInteraction()
  const { isMapDrawing } = useMapDrawConnect()
  const { isMapAnnotating } = useMapAnnotation()
  const { isErrorNotificationEditing } = useMapErrorNotification()
  const { onRulerMapHover, rulersEditing } = useRulers()

  const [hoveredCoordinates, setHoveredCoordinates] = useState<number[]>()
  const [hoveredDebouncedEvent, setHoveredDebouncedEvent] = useState<SliceInteractionEvent | null>(
    null
  )

  // const onSimpleMapHover = useSimpleMapHover(setHoveredEvent as InteractionEventCallback)
  // const onMapHover = useMapHover(
  //   setHoveredEvent as InteractionEventCallback,
  //   setHoveredDebouncedEvent as InteractionEventCallback,
  //   map,
  //   style?.metadata
  // )

  const onMouseMove: DeckProps['onHover'] = useCallback(
    (info: PickingInfo, event: MjolnirPointerEvent) => {
      setHoveredCoordinates(info.coordinate)
      if (
        event.type === 'pointerleave' ||
        isMapAnnotating ||
        isMapDrawing ||
        isErrorNotificationEditing
      ) {
        setMapHoverFeatures({} as InteractionEvent)
        return
      }
      if (rulersEditing) {
        onRulerMapHover(info)
        return
      }
      const hoverInteraction = getPickingInteraction(info, 'hover')
      if (hoverInteraction) {
        const eventsInteraction = {
          ...hoverInteraction,
          features: hoverInteraction.features?.filter(
            (f) => f.category === DataviewCategory.Events
          ),
        }
        if (eventsInteraction.features?.length) {
          setMapHoverFeatures(eventsInteraction)
          return
        }
        setMapHoverFeatures(hoverInteraction)
      }
    },
    [
      getPickingInteraction,
      isErrorNotificationEditing,
      isMapAnnotating,
      isMapDrawing,
      onRulerMapHover,
      rulersEditing,
      setMapHoverFeatures,
    ]
  )

  return {
    onMouseMove,
    // resetHoverState,
    hoveredCoordinates,
    hoveredDebouncedEvent,
    // hoveredTooltipEvent,
  }
}

export const useMapMouseClick = () => {
  const getPickingInteraction = useGetPickingInteraction()
  const { dispatchClickedEvent } = useClickedEventConnect()

  const onMapClick: DeckProps['onClick'] = useCallback(
    (info: PickingInfo, event: any) => {
      if (!info.coordinate) return
      if (event.srcEvent.defaultPrevented) {
        // this is needed to allow interacting with overlay elements content
        return true
      }
      const clickInteraction = getPickingInteraction(info, 'click')
      if (clickInteraction) {
        dispatchClickedEvent(clickInteraction)
      }
    },
    [getPickingInteraction, dispatchClickedEvent]
  )

  return onMapClick
}

export const useMapCursor = () => {
  const { isMapDrawing } = useMapDrawConnect()
  // const { getDrawCursor } = useDrawLayer()
  const { isMapAnnotating } = useMapAnnotation()
  const { isErrorNotificationEditing } = useMapErrorNotification()
  const { rulersEditing, getRulersCursor } = useRulers()
  const hoverFeatures = useMapHoverInteraction()?.features
  const getCursor = useCallback(
    ({ isDragging }: { isDragging: boolean }) => {
      if (isMapAnnotating || isErrorNotificationEditing || rulersEditing) {
        if (rulersEditing && hoverFeatures?.some(isRulerLayerPoint)) {
          return 'move'
        }
        return 'crosshair'
      }
      if (isDragging) {
        return 'grabbing'
      }
      if (hoverFeatures?.length) {
        return 'pointer'
      }
      return 'grab'
    },
    [rulersEditing, isMapAnnotating, isErrorNotificationEditing, hoverFeatures]
  )
  return { getCursor }
}

export const useMapDrag = () => {
  const getPickingInteraction = useGetPickingInteraction()
  const map = useDeckMap()
  const { rulersEditing } = useRulers()
  const { onRulerDrag, onRulerDragStart, onRulerDragEnd } = useMapRulersDrag()
  const onMapDragStart = useCallback(
    (info: PickingInfo, event: any) => {
      const dragstartInteraction = getPickingInteraction(info, 'dragstart')
      if (!map || !info.coordinate) return
      if (dragstartInteraction) {
        onRulerDragStart(info, dragstartInteraction.features)
      }
    },
    [getPickingInteraction, map, onRulerDragStart]
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
        map?.setProps({ controller: { dragPan: true } })
        onRulerDragEnd()
      }
    },
    [map, onRulerDragEnd, rulersEditing]
  )
  return { onMapDrag, onMapDragStart, onMapDragEnd }
}
