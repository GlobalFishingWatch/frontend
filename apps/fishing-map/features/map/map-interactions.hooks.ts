import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { DeckProps, PickingInfo } from '@deck.gl/core'
import type { ThunkDispatch } from '@reduxjs/toolkit'
import { debounce, throttle } from 'es-toolkit'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import type { MjolnirPointerEvent } from 'mjolnir.js'

import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type {
  InteractionEvent,
  InteractionEventType,
} from '@globalfishingwatch/deck-layer-composer'
import {
  useGetDeckLayers,
  useMapHoverInteraction,
  useSetMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'
import type {
  DeckLayerInteractionPickingInfo,
  DeckLayerPickingObject,
  FourwingsClusterPickingObject,
  FourwingsHeatmapPickingObject,
} from '@globalfishingwatch/deck-layers'
import { FOURWINGS_MAX_ZOOM } from '@globalfishingwatch/deck-layers'

import { trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { ENCOUNTER_EVENTS_SOURCES } from 'features/dataviews/dataviews.utils'
import { selectEventsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setHintDismissed } from 'features/help/hints.slice'
import { useDeckMap } from 'features/map/map-context.hooks'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { useMapAnnotation } from 'features/map/overlays/annotations/annotations.hooks'
import { useMapErrorNotification } from 'features/map/overlays/error-notification/error-notification.hooks'
import useRulers from 'features/map/overlays/rulers/rulers.hooks'
import { setHighlightedEvents } from 'features/timebar/timebar.slice'

import { annotationsCursorAtom } from './overlays/annotations/Annotations'
import { useMapRulersDrag } from './overlays/rulers/rulers-drag.hooks'
import type { SliceExtendedClusterPickingObject, SliceInteractionEvent } from './map.slice'
import {
  fetchBQEventThunk,
  fetchClusterEventThunk,
  fetchHeatmapInteractionThunk,
  fetchLegacyEncounterEventThunk,
  selectActivityInteractionStatus,
  selectApiEventStatus,
  selectClickedEvent,
  setClickedEvent,
} from './map.slice'
import {
  getAnalyticsEvent,
  isRulerLayerPoint,
  isTilesClusterLayer,
  isTilesClusterLayerCluster,
} from './map-interaction.utils'
import { useSetMapCoordinates } from './map-viewport.hooks'

export const SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION = [
  DataviewCategory.Activity,
  DataviewCategory.Detections,
  DataviewCategory.VesselGroups,
  DataviewCategory.Events,
]

const useMapClusterTilesLoading = () => {
  const eventsDataviews = useSelector(selectEventsDataviews)
  const eventsDeckLayers = useGetDeckLayers(eventsDataviews?.map((d) => d.id))
  if (!eventsDeckLayers?.length) {
    return false
  }
  return eventsDeckLayers.some((layer) => !layer.instance.isLoaded)
}

type InteractionPromise = ThunkDispatch<Promise<any>, any, any> & { abort: any }
const initialInteractionPromises = {
  activity: undefined,
  events: undefined,
}
const interactionPromisesAtom = atom<{
  activity: InteractionPromise | undefined
  events: InteractionPromise | undefined
}>(initialInteractionPromises)

export const useCancelInteractionPromises = () => {
  const [interactionPromises, setInteractionPromises] = useAtom(interactionPromisesAtom)

  const cancelPendingInteractionRequests = useCallback(() => {
    const promisesRef = [interactionPromises.activity, interactionPromises.events]
    promisesRef.forEach((p) => {
      if (p) {
        p.abort()
      }
    })
    setInteractionPromises(initialInteractionPromises)
  }, [interactionPromises.events, interactionPromises.activity, setInteractionPromises])

  return cancelPendingInteractionRequests
}

export const useClickedEventConnect = () => {
  const dispatch = useAppDispatch()
  const setInteractionPromises = useSetAtom(interactionPromisesAtom)
  const cancelPendingInteractionRequests = useCancelInteractionPromises()
  const clickedEvent = useSelector(selectClickedEvent)
  const fishingInteractionStatus = useSelector(selectActivityInteractionStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)
  const setMapCoordinates = useSetMapCoordinates()
  const { isMapAnnotating, addMapAnnotation } = useMapAnnotation()
  const { isErrorNotificationEditing, addErrorNotification } = useMapErrorNotification()
  const { rulersEditing, onRulerMapClick } = useRulers()
  const areTilesClusterLoading = useMapClusterTilesLoading()
  // const fishingPromiseRef = useRef<any>()
  // const eventsPromiseRef = useRef<any>()

  const dispatchClickedEvent = useCallback(
    (deckEvent: InteractionEvent | null) => {
      // Cancel all pending promises
      cancelPendingInteractionRequests()

      if (deckEvent === null) {
        dispatch(setClickedEvent(null))
        return
      }
      if (isMapAnnotating) {
        addMapAnnotation([deckEvent.longitude, deckEvent.latitude])
        return
      }
      if (isErrorNotificationEditing) {
        addErrorNotification([deckEvent.longitude, deckEvent.latitude])
        return
      }
      if (rulersEditing) {
        onRulerMapClick([deckEvent.longitude, deckEvent.latitude])
        return
      }

      const event = {
        features: deckEvent.features,
        //   .map((feature) => {
        //   const { geometry, ...rest } = feature as any
        //   return rest
        // }),
        latitude: deckEvent.latitude,
        longitude: deckEvent.longitude,
        zoom: deckEvent.viewport?.zoom,
        point: { x: deckEvent.point.x, y: deckEvent.point.y },
      } as SliceInteractionEvent

      event?.features?.forEach((feature) => {
        const analyticsEvent = getAnalyticsEvent(feature)
        trackEvent(analyticsEvent as any)
      })
      const clusterFeature = event?.features?.find(
        (f) => (f as FourwingsClusterPickingObject).category === DataviewCategory.Events
      ) as FourwingsClusterPickingObject

      if (clusterFeature) {
        if (isTilesClusterLayerCluster(clusterFeature)) {
          const { expansionZoom } = clusterFeature
          const { expansionZoom: legacyExpansionZoom } = clusterFeature.properties as any
          const expansionZoomValue =
            expansionZoom || legacyExpansionZoom || FOURWINGS_MAX_ZOOM + 0.5
          if (!areTilesClusterLoading && expansionZoomValue) {
            setMapCoordinates({
              latitude: event.latitude,
              longitude: event.longitude,
              zoom: expansionZoomValue,
            })
          }
          return
        } else if (clusterFeature.clusterMode === 'country') {
          setMapCoordinates({
            latitude: event.latitude,
            longitude: event.longitude,
            zoom: (event.zoom as number) + 1,
          })
          return
        }
      }

      if (!event || !event.features) {
        if (clickedEvent) {
          dispatch(setClickedEvent(null))
        }
        return
      }

      dispatch(setClickedEvent(event))

      // get temporal grid clicked features and order them by sublayerindex
      const heatmapFeatures = (event.features as FourwingsHeatmapPickingObject[]).filter(
        (feature) => {
          if (
            feature?.sublayers?.every((sublayer) => !sublayer.visible) ||
            feature.visualizationMode === 'positions'
          ) {
            return false
          }
          return SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION.includes(
            feature.category as DataviewCategory
          )
        }
      )

      if (heatmapFeatures?.length) {
        dispatch(setHintDismissed('clickingOnAGridCellToShowVessels'))
        const heatmapProperties = heatmapFeatures.map((feature) =>
          feature.category === 'detections' ? 'detections' : 'hours'
        )
        const heatmapPromise = dispatch(
          fetchHeatmapInteractionThunk({ heatmapFeatures, heatmapProperties })
        )
        setInteractionPromises((prev) => ({ ...prev, activity: heatmapPromise as any }))
      }

      const tileClusterFeature = event.features.find(
        (f) => f.category === DataviewCategory.Events && isTilesClusterLayer(f)
      ) as SliceExtendedClusterPickingObject

      if (tileClusterFeature) {
        const bqPocQuery = !ENCOUNTER_EVENTS_SOURCES.includes(tileClusterFeature.layerId)
        // TODO:deck migrate bqPocQuery to FourwingsClusters
        const fetchFn = bqPocQuery ? fetchBQEventThunk : fetchClusterEventThunk
        // TODO:deck remove fetchLegacyEncounterEventThunk once fourwings cluster goes to pro
        const clusterFn =
          tileClusterFeature?.subcategory === DataviewType.TileCluster
            ? fetchLegacyEncounterEventThunk
            : fetchClusterEventThunk
        const eventsPromise = dispatch(clusterFn(tileClusterFeature as any) as any)
        setInteractionPromises((prev) => ({ ...prev, activity: eventsPromise as any }))
      }
    },
    [
      addErrorNotification,
      addMapAnnotation,
      areTilesClusterLoading,
      cancelPendingInteractionRequests,
      clickedEvent,
      dispatch,
      isErrorNotificationEditing,
      isMapAnnotating,
      onRulerMapClick,
      rulersEditing,
      setInteractionPromises,
      setMapCoordinates,
    ]
  )

  return useMemo(
    () => ({
      clickedEvent,
      fishingInteractionStatus,
      apiEventStatus,
      dispatchClickedEvent,
      cancelPendingInteractionRequests,
    }),
    [
      apiEventStatus,
      cancelPendingInteractionRequests,
      clickedEvent,
      dispatchClickedEvent,
      fishingInteractionStatus,
    ]
  )
}

const useGetPickingInteraction = () => {
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

export const hoverCoordinatesAtom = atom<[number, number] | undefined>()
export const useMapMouseHover = () => {
  const getPickingInteraction = useGetPickingInteraction()
  const setMapHoverFeatures = useSetMapHoverInteraction()
  const { isMapDrawing } = useMapDrawConnect()
  const { isMapAnnotating } = useMapAnnotation()
  const { isErrorNotificationEditing } = useMapErrorNotification()
  const { onRulerMapHover, rulersEditing } = useRulers()

  const [hoveredCoordinates, setHoveredCoordinates] = useAtom(hoverCoordinatesAtom)

  const onMouseMove: DeckProps['onHover'] = useMemo(
    () =>
      throttle((info: PickingInfo, event: MjolnirPointerEvent) => {
        setHoveredCoordinates(info.coordinate as [number, number])
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
      }, 50),
    [
      getPickingInteraction,
      isErrorNotificationEditing,
      isMapAnnotating,
      isMapDrawing,
      onRulerMapHover,
      rulersEditing,
      setHoveredCoordinates,
      setMapHoverFeatures,
    ]
  )

  return useMemo(
    () => ({
      onMouseMove,
      hoveredCoordinates,
    }),
    [hoveredCoordinates, onMouseMove]
  )
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
  const annotationsCursor = useAtomValue(annotationsCursorAtom)
  const areClusterTilesLoading = useMapClusterTilesLoading()
  const { isMapAnnotating } = useMapAnnotation()
  const { isErrorNotificationEditing } = useMapErrorNotification()
  const { rulersEditing } = useRulers()
  const hoverFeatures = useMapHoverInteraction()?.features
  const hoverFeaturesHash = hoverFeatures?.map((f) => f.id).join()

  const getCursor = useCallback(
    ({ isDragging }: { isDragging: boolean }) => {
      if (annotationsCursor) {
        return annotationsCursor
      }
      if (hoverFeatures?.some(isRulerLayerPoint)) {
        return 'move'
      }
      if (hoverFeatures?.some(isTilesClusterLayer)) {
        const isCluster = (hoverFeatures as FourwingsClusterPickingObject[]).some((f) =>
          isTilesClusterLayerCluster(f)
        )
        const isCountryClusterMode = (hoverFeatures as FourwingsClusterPickingObject[]).some(
          (f) => f.clusterMode === 'country'
        )
        if (!isCluster && !isCountryClusterMode) {
          return 'pointer'
        }
        return areClusterTilesLoading ? 'wait' : 'zoom-in'
      }
      if (isMapAnnotating || isErrorNotificationEditing || rulersEditing) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      annotationsCursor,
      hoverFeaturesHash,
      isMapAnnotating,
      isErrorNotificationEditing,
      rulersEditing,
      areClusterTilesLoading,
    ]
  )

  return getCursor
}

export const useMapDrag = () => {
  const { onRulerDrag, onRulerDragStart, onRulerDragEnd } = useMapRulersDrag()

  const onMapDragStart = useCallback(
    (info: PickingInfo, event: any) => {
      if (!info.coordinate || !info.object) return
      const isRulerPoint = isRulerLayerPoint(info.object)
      if (isRulerPoint) {
        onRulerDragStart(info)
        event.stopPropagation()
      }
    },
    [onRulerDragStart]
  )

  const onMapDrag = useCallback(
    (info: PickingInfo<DeckLayerPickingObject>, event: any) => {
      if (!info.coordinate || !info.object) return
      const isRulerPoint = isRulerLayerPoint(info.object)
      if (isRulerPoint) {
        onRulerDrag(info)
        event.stopPropagation()
      }
    },
    [onRulerDrag]
  )

  const onMapDragEnd = useCallback(
    (info: PickingInfo, event: any) => {
      if (!info.coordinate || !info.object) return
      const isRulerPoint = isRulerLayerPoint(info.object)
      if (isRulerPoint) {
        onRulerDragEnd()
      }
    },
    [onRulerDragEnd]
  )
  return useMemo(
    () => ({ onMapDrag, onMapDragStart, onMapDragEnd }),
    [onMapDrag, onMapDragEnd, onMapDragStart]
  )
}

export const useDebouncedDispatchHighlightedEvent = () => {
  const dispatch = useAppDispatch()

  return useMemo(
    () =>
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
