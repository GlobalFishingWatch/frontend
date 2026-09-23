import { startTransition, useCallback, useEffect, useMemo } from 'react'
import { useSelector, useStore as useReduxStore } from 'react-redux'
import type { DeckProps, PickingInfo, WebMercatorViewport } from '@deck.gl/core'
import { debounce, throttle } from 'es-toolkit'
import { atom, useAtomValue, useSetAtom, useStore } from 'jotai'
import type { MjolnirPointerEvent } from 'mjolnir.js'

import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type {
  InteractionEvent,
  InteractionEventType,
} from '@globalfishingwatch/deck-layer-composer'
import {
  deckHoverInteractionAtom,
  deckLayersAtom,
  deckLayersStateAtom,
  isDeckLayersLoadingAtom,
  useSetMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'
import type {
  DeckLayerInteractionPickingInfo,
  DeckLayerPickingObject,
  FourwingsClusterPickingObject,
  FourwingsHeatmapPickingObject,
  FourwingsPositionsPickingObject,
  VesselEventPickingObject,
} from '@globalfishingwatch/deck-layers'

import { getIsBQEditorDataset } from 'features/_map/datasets/datasets.utils'
import {
  BIG_QUERY_4WINGS_PREFIX,
  isRealTimeDataview,
} from 'features/_map/dataviews/dataviews.utils'
import {
  selectActivityDataviews,
  selectEventsDataviews,
} from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { useMapFitBounds } from 'features/_map/map/map-bounds.hooks'
import { useDeckMap } from 'features/_map/map/map-context.hooks'
import { useMapDrawConnect } from 'features/_map/map/map-draw.hooks'
import type { InteractionPromise } from 'features/_map/map/map-interactions.atoms'
import {
  interactionPromisesAtom,
  useCancelInteractionPromises,
} from 'features/_map/map/map-interactions.atoms'
import { useMapAnnotation } from 'features/_map/map/overlays/annotations/annotations.hooks'
import { useMapErrorNotification } from 'features/_map/map/overlays/error-notification/error-notification.hooks'
import { overlaysCursorAtom } from 'features/_map/map/overlays/overlays-hooks'
import useRulers from 'features/_map/map/overlays/rulers/rulers.hooks'
import { setHighlightedEvents } from 'features/_map/timebar/timebar.slice'
import { useEventActivityToggle } from 'features/_vessels/vessel/activity/event/event-activity.hooks'
import { useVesselProfileScrollToEvent } from 'features/_vessels/vessel/activity/event/event-scroll.hooks'
import type { ActivityEvent } from 'features/_vessels/vessel/activity/vessels-activity.selectors'
import { trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { setHintDismissed } from 'features/hints/hints.slice'
import type { RootState } from 'reducers'
import { useAppSearch, useReplaceQueryParams } from 'router/routes.hook'

import { useMapRulersDrag } from './overlays/rulers/rulers-drag.hooks'
import type { SliceExtendedClusterPickingObject } from './map.slice'
import {
  fetchClusterEventThunk,
  fetchHeatmapInteractionThunk,
  fetchRealTimePositionsThunk,
  removeClickedEventDataview,
  selectActivityInteractionStatus,
  selectApiEventStatus,
  selectClickedEvent,
  setClickedEvent,
  setClickedEventFeatures,
} from './map.slice'
import {
  getAnalyticsEvent,
  getClickedCoordinatesParam,
  getNewClickedFeatures,
  getSliceInteractionEvent,
  getUpdatedClickedFeatures,
  isRulerLayerPoint,
  isTilesClusterLayer,
  isTilesClusterLayerCluster,
  isTrackSegment,
} from './map-interaction.utils'
import { useMapViewport, useSetMapCoordinates } from './map-viewport.hooks'

export const SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION = [
  DataviewCategory.Activity,
  DataviewCategory.Detections,
  DataviewCategory.VesselGroups,
  DataviewCategory.Events,
]

function useGetAreClusterTilesLoading() {
  const store = useStore()
  return useCallback(
    (eventsDataviews: { id: string }[] | undefined) => {
      const deckLayers = store.get(deckLayersAtom)
      const eventsLayerIds = eventsDataviews?.map((d) => d.id) || []
      return eventsLayerIds
        .flatMap((id) => deckLayers.find((l) => l.id === id) || [])
        .some((layer) => !layer.instance.isLoaded)
    },
    [store]
  )
}

// Moved to map-interactions.atoms so MainNav can cancel pending requests without loading this module.
// Re-exported for existing consumers (`export ... from` alone would not bind them locally).
export { useCancelInteractionPromises } from 'features/_map/map/map-interactions.atoms'

const useInteractionHandlers = () => {
  const dispatch = useAppDispatch()
  const activityDataviews = useSelector(selectActivityDataviews)
  const eventsDataviews = useSelector(selectEventsDataviews)
  const setInteractionPromises = useSetAtom(interactionPromisesAtom)
  const getAreClusterTilesLoading = useGetAreClusterTilesLoading()
  const scrollToEvent = useVesselProfileScrollToEvent()
  const setEventGroup = useEventActivityToggle()[1]

  const handleHeatmapInteraction = useCallback(
    (event: InteractionEvent) => {
      if (!event?.features) {
        return
      }
      // get temporal grid clicked features and order them by sublayerindex
      const heatmapFeatures = (event.features as FourwingsHeatmapPickingObject[]).filter(
        (feature) => {
          const isBigQueryFeature = feature?.layerId?.startsWith(BIG_QUERY_4WINGS_PREFIX)
          if (isBigQueryFeature) {
            const dataset = activityDataviews.find((d) => d.id === feature.layerId)?.datasets?.[0]
            const isBigQueryFeatureWithVessels = dataset?.subcategory?.includes('interactive')
            return isBigQueryFeatureWithVessels
          }

          if (
            feature?.sublayers?.every((sublayer) => !sublayer.visible) ||
            feature.visualizationMode === 'positions'
          ) {
            return false
          }
          const hasVesselInteraction = SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION.includes(
            feature.category as DataviewCategory
          )
          const isHeatmap =
            feature.subcategory === DataviewType.Heatmap ||
            feature.subcategory === DataviewType.HeatmapAnimated ||
            feature.subcategory === DataviewType.HeatmapStatic
          return hasVesselInteraction && isHeatmap
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
        setInteractionPromises((prev) => ({ ...prev, activity: heatmapPromise }))
      }
    },
    [activityDataviews, dispatch, setInteractionPromises]
  )

  const handleDetectionPositionsInteraction = useCallback(
    (event: InteractionEvent) => {
      if (!event?.features) {
        return
      }
      const positionFeatures = (event.features as FourwingsPositionsPickingObject[]).filter(
        (feature) => {
          if (feature?.sublayers?.every((sublayer) => !sublayer.visible)) {
            return false
          }
          const hasVesselInteraction = SUBLAYER_INTERACTION_TYPES_WITH_VESSEL_INTERACTION.includes(
            feature.category as DataviewCategory
          )
          const isPositions = feature.visualizationMode === 'positions'
          return hasVesselInteraction && isPositions
        }
      )
      const realTimeFeatures = positionFeatures.filter((feature) => {
        const dataview = activityDataviews.find((d) => d.id === feature.layerId)
        return dataview ? isRealTimeDataview(dataview) : false
      })
      // detection thumbnails are heavy, PositionsTooltipRow requests only the visible one
      if (realTimeFeatures?.length) {
        const realTimePositionsPromise = dispatch(fetchRealTimePositionsThunk({ realTimeFeatures }))
        setInteractionPromises((prev) => ({
          ...prev,
          realTimePositions: realTimePositionsPromise,
        }))
      }
    },
    [activityDataviews, dispatch, setInteractionPromises]
  )

  const handleTileClusterInteraction = useCallback(
    (event: InteractionEvent) => {
      if (!event?.features) {
        return
      }
      const tileClusterFeature = event.features.find(
        (f) => f.category === DataviewCategory.Events && isTilesClusterLayer(f)
      ) as SliceExtendedClusterPickingObject

      if (tileClusterFeature) {
        if (!getAreClusterTilesLoading(eventsDataviews)) {
          const dataset = eventsDataviews?.find((d) => d.id === tileClusterFeature?.layerId)
            ?.datasets?.[0]
          if (!getIsBQEditorDataset(dataset!)) {
            const eventsPromise = dispatch(fetchClusterEventThunk(tileClusterFeature as any))
            setInteractionPromises((prev) => ({
              ...prev,
              events: eventsPromise as InteractionPromise,
            }))
          }
        }
      }
    },
    [dispatch, eventsDataviews, setInteractionPromises, getAreClusterTilesLoading]
  )

  const handleVesselEventInteraction = useCallback(
    (event: InteractionEvent) => {
      if (!event?.features) {
        return
      }
      const vesselEventFeature = event.features.find(
        (f) =>
          f.category === DataviewCategory.Vessels && f.subcategory === DataviewType.VesselEvents
      ) as VesselEventPickingObject

      if (vesselEventFeature) {
        const eventType = setEventGroup({
          id: vesselEventFeature.id,
          type: vesselEventFeature.type,
        } as ActivityEvent)
        startTransition(() => {
          scrollToEvent({ eventId: vesselEventFeature.id, eventType })
        })
      }
    },
    [setEventGroup, scrollToEvent]
  )

  return {
    handleHeatmapInteraction,
    handleDetectionPositionsInteraction,
    handleTileClusterInteraction,
    handleVesselEventInteraction,
  }
}

export const useClickedEventConnect = () => {
  const dispatch = useAppDispatch()
  const eventsDataviews = useSelector(selectEventsDataviews)
  const cancelPendingInteractionRequests = useCancelInteractionPromises()
  const clickedEvent = useSelector(selectClickedEvent)
  const fishingInteractionStatus = useSelector(selectActivityInteractionStatus)
  const apiEventStatus = useSelector(selectApiEventStatus)
  const setMapCoordinates = useSetMapCoordinates()
  const fitMapBounds = useMapFitBounds()
  const { isMapAnnotating, addMapAnnotation } = useMapAnnotation()
  const { isErrorNotificationEditing, addErrorNotification } = useMapErrorNotification()
  const { rulersEditing, onRulerMapClick } = useRulers()
  const getAreClusterTilesLoading = useGetAreClusterTilesLoading()
  const { replaceQueryParams } = useReplaceQueryParams()
  const {
    handleHeatmapInteraction,
    handleDetectionPositionsInteraction,
    handleTileClusterInteraction,
    handleVesselEventInteraction,
  } = useInteractionHandlers()

  const dispatchClickedEvent = useCallback(
    (deckEvent: InteractionEvent | null) => {
      // Cancel all pending promises
      cancelPendingInteractionRequests()

      if (deckEvent === null) {
        dispatch(setClickedEvent(null))
        replaceQueryParams({ clickedCoordinates: undefined })
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
      // TODO: identify if clicked on a track correction overlay and return to stop propagation from opening events popup
      const event = getSliceInteractionEvent(deckEvent)

      event?.features?.forEach((feature) => {
        const analyticsEvent = getAnalyticsEvent(feature)
        trackEvent(analyticsEvent as any)
      })
      const clusterFeature = event?.features?.find(
        (f) => (f as FourwingsClusterPickingObject).category === DataviewCategory.Events
      ) as FourwingsClusterPickingObject

      if (clusterFeature) {
        if (getAreClusterTilesLoading(eventsDataviews)) {
          return
        }
        if (clusterFeature.clusterMode === 'country') {
          const dataview = eventsDataviews?.find((d) => d.id === clusterFeature.layerId)
          const maxZoomLevel = dataview?.config?.clusterMaxZoomLevels?.country || event.zoom!
          setMapCoordinates({
            latitude: event.latitude,
            longitude: event.longitude,
            zoom: maxZoomLevel + 1,
          })
          return
        } else if (isTilesClusterLayerCluster(clusterFeature)) {
          const { expansionZoom, expansionBounds } = clusterFeature
          if (expansionBounds?.length) {
            fitMapBounds(expansionBounds, {
              fitZoom: true,
              flyTo: true,
            })
            return
          } else {
            const { expansionZoom: legacyExpansionZoom } = clusterFeature.properties as any
            const expansionZoomValue = expansionZoom || legacyExpansionZoom
            if (expansionZoomValue) {
              setMapCoordinates({
                latitude: event.latitude,
                longitude: event.longitude,
                zoom: expansionZoomValue,
              })
              return
            }
          }
        }
      }

      if (!event || !event.features) {
        if (clickedEvent) {
          dispatch(setClickedEvent(null))
          replaceQueryParams({ clickedCoordinates: undefined })
        }
        return
      }

      dispatch(setClickedEvent(event))
      replaceQueryParams({
        clickedCoordinates: getClickedCoordinatesParam(event.longitude, event.latitude),
      })

      handleHeatmapInteraction(event)
      handleDetectionPositionsInteraction(event)
      handleTileClusterInteraction(event)
      handleVesselEventInteraction(event)
    },
    [
      cancelPendingInteractionRequests,
      isMapAnnotating,
      isErrorNotificationEditing,
      rulersEditing,
      dispatch,
      handleHeatmapInteraction,
      handleDetectionPositionsInteraction,
      handleTileClusterInteraction,
      handleVesselEventInteraction,
      addMapAnnotation,
      addErrorNotification,
      onRulerMapClick,
      getAreClusterTilesLoading,
      eventsDataviews,
      setMapCoordinates,
      fitMapBounds,
      clickedEvent,
      replaceQueryParams,
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
          const featureId = `${f.object.id}-${f.layer.id}`
          if (!uniqFeatureIds.includes(featureId)) {
            uniqFeatureIds.push(featureId)
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

// Only the last refresh requested is applied, as the previous ones are outdated
let lastRefreshId = 0

const isDataviewLayerLoaded = (store: ReturnType<typeof useStore>, dataviewId: string) =>
  Object.entries(store.get(deckLayersStateAtom)).some(
    // fourwings dataviews are merged in a single layer with their ids joined
    ([layerId, layer]) => layer.loaded && layerId.split(',').includes(dataviewId)
  )

// A pick fabricated from coordinates instead of a pointer event: used to rebuild the clicked popup
// when the layers change or when it is restored from the URL. `viewport` is needed because
// getSliceInteractionEvent reads the zoom off it.
const getSyntheticPickingInfo = (
  coordinate: [number, number],
  viewport: WebMercatorViewport
): PickingInfo => {
  const [x, y] = viewport.project(coordinate)
  return { x, y, coordinate, viewport } as unknown as PickingInfo
}

const waitForLayersUpdate = ({
  store,
  isUpdated,
  isOutdated,
  timeout,
}: {
  store: ReturnType<typeof useStore>
  isUpdated: () => boolean
  isOutdated: () => boolean
  // resolves false when the layers don't settle in time, for callers that aren't triggered by a
  // layer change themselves and so have no guarantee the atom will ever emit again
  timeout?: number
}) =>
  new Promise<boolean>((resolve) => {
    let settled = false
    let unsubscribe: () => void = () => {}
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const finish = (updated: boolean) => {
      if (settled) {
        return
      }
      settled = true
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      unsubscribe()
      resolve(updated)
    }
    const check = () => {
      if (isOutdated()) {
        finish(false)
      } else if (!store.get(isDeckLayersLoadingAtom) && isUpdated()) {
        finish(true)
      }
    }
    if (timeout) {
      timeoutId = setTimeout(() => finish(false), timeout)
    }
    unsubscribe = store.sub(deckLayersStateAtom, check)
    // the layers may already be settled, in which case the atom never emits again
    check()
  })

export const useRefreshClickedEvent = () => {
  const dispatch = useAppDispatch()
  const store = useStore()
  const reduxStore = useReduxStore()
  const mapViewport = useMapViewport()
  const getPickingInteraction = useGetPickingInteraction()
  const cancelPendingInteractionRequests = useCancelInteractionPromises()
  const {
    handleHeatmapInteraction,
    handleDetectionPositionsInteraction,
    handleTileClusterInteraction,
  } = useInteractionHandlers()

  return useCallback(
    async (dataviewId: string, visible: boolean) => {
      // read on demand so consumers don't rerender on every popup change
      const clicked = selectClickedEvent(reduxStore.getState() as RootState)
      const refreshId = ++lastRefreshId
      if (!mapViewport || !clicked) {
        return
      }
      if (!visible) {
        dispatch(removeClickedEventDataview(dataviewId))
        return
      }

      const isOutdated = () => {
        const currentClicked = selectClickedEvent(reduxStore.getState() as RootState)
        return (
          refreshId !== lastRefreshId ||
          currentClicked?.longitude !== clicked.longitude ||
          currentClicked?.latitude !== clicked.latitude
        )
      }
      const pickFeatures = () => {
        const interaction = getPickingInteraction(
          getSyntheticPickingInfo([clicked.longitude, clicked.latitude], mapViewport),
          'click'
        )
        return interaction ? getSliceInteractionEvent(interaction).features : []
      }

      const updated = await waitForLayersUpdate({
        store,
        isUpdated: () => isDataviewLayerLoaded(store, dataviewId),
        isOutdated,
      })
      if (!updated) {
        return
      }
      // read again as a previous refresh could have updated the popup while waiting
      const previousFeatures =
        selectClickedEvent(reduxStore.getState() as RootState)?.features || clicked.features
      const features = pickFeatures()
      dispatch(setClickedEventFeatures(getUpdatedClickedFeatures(features, previousFeatures)))
      // only the new features are requested, the rest keep the data already fetched for them
      const newFeatures = getNewClickedFeatures(features, previousFeatures)
      if (!newFeatures.length) {
        return
      }
      // a pending request of a previous refresh would overwrite the data of this one
      cancelPendingInteractionRequests()
      const newEvent = { ...clicked, features: newFeatures } as InteractionEvent
      handleHeatmapInteraction(newEvent)
      handleDetectionPositionsInteraction(newEvent)
      handleTileClusterInteraction(newEvent)
    },
    [
      cancelPendingInteractionRequests,
      dispatch,
      getPickingInteraction,
      handleDetectionPositionsInteraction,
      handleHeatmapInteraction,
      handleTileClusterInteraction,
      mapViewport,
      reduxStore,
      store,
    ]
  )
}

// Long enough for a cold tile load on a slow connection. On timeout we give up rather than pick
// into half-loaded layers, which would show a partial popup the sharer never saw.
const RESTORE_PICK_TIMEOUT = 10000

/**
 * Rebuilds the clicked popup from the coordinates in the URL, so a clicked cell survives a reload
 * and can be shared. Features are re-picked from deck rather than serialized: the URL never carries
 * anything about the layers themselves, so a link cannot leak a private dataset's content.
 */
export const useClickedEventUrlSync = () => {
  const dispatch = useAppDispatch()
  const store = useStore()
  const reduxStore = useReduxStore()
  const deckMap = useDeckMap()
  const mapViewport = useMapViewport()
  const getPickingInteraction = useGetPickingInteraction()
  const { clickedCoordinates } = useAppSearch()
  const {
    handleHeatmapInteraction,
    handleDetectionPositionsInteraction,
    handleTileClusterInteraction,
  } = useInteractionHandlers()

  // primitive so the effect doesn't rerun on every parse of the same coordinates
  const coordinatesKey = clickedCoordinates?.join(',')

  useEffect(() => {
    if (!clickedCoordinates?.length || !deckMap || !mapViewport) {
      return
    }
    // read on demand so this doesn't rerender on every popup change
    const clicked = selectClickedEvent(reduxStore.getState() as RootState)
    // the click that wrote this param already built the popup, nothing to restore
    if (
      getClickedCoordinatesParam(clicked?.longitude, clicked?.latitude)?.join(',') ===
      coordinatesKey
    ) {
      return
    }

    let cancelled = false
    const restore = async () => {
      const settled = await waitForLayersUpdate({
        store,
        isUpdated: () => Object.keys(store.get(deckLayersStateAtom)).length > 0,
        isOutdated: () => cancelled,
        timeout: RESTORE_PICK_TIMEOUT,
      })
      if (!settled || cancelled) {
        return
      }
      const [longitude, latitude] = clickedCoordinates
      const interaction = getPickingInteraction(
        getSyntheticPickingInfo([longitude, latitude], mapViewport),
        'click'
      )
      const event = interaction ? getSliceInteractionEvent(interaction) : undefined
      if (!event?.features?.length) {
        // leave the param alone: a reload retries, and rewriting the URL under the user is worse
        return
      }
      dispatch(setClickedEvent(event))
      // only the pure-fetch handlers: handleVesselEventInteraction navigates the sidebar and
      // scrolls the activity list, which opening a link must not do
      handleHeatmapInteraction(event as InteractionEvent)
      handleDetectionPositionsInteraction(event as InteractionEvent)
      handleTileClusterInteraction(event as InteractionEvent)
    }
    restore()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinatesKey, deckMap, mapViewport])
}

const EMPTY_INTERACTION_EVENT = {} as InteractionEvent

export const hoverCoordinatesAtom = atom<[number, number] | undefined>()
export const useMapMouseHover = () => {
  const getPickingInteraction = useGetPickingInteraction()
  const setMapHoverFeatures = useSetMapHoverInteraction()
  const { isMapDrawing } = useMapDrawConnect()
  const { isMapAnnotating } = useMapAnnotation()
  const { isErrorNotificationEditing } = useMapErrorNotification()
  const { onRulerMapHover, rulersEditing } = useRulers()

  const setHoveredCoordinates = useSetAtom(hoverCoordinatesAtom)

  const onMouseMove: DeckProps['onHover'] = useMemo(
    () =>
      throttle<any>((info: PickingInfo, event: MjolnirPointerEvent) => {
        setHoveredCoordinates(info.coordinate as [number, number])
        if (
          event.type === 'pointerleave' ||
          isMapAnnotating ||
          isMapDrawing ||
          isErrorNotificationEditing
        ) {
          setMapHoverFeatures(EMPTY_INTERACTION_EVENT)
          return
        }
        if (rulersEditing) {
          onRulerMapHover(info)
          return
        }
        const hoverInteraction = getPickingInteraction(info, 'hover')
        if (hoverInteraction) {
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

  return useMemo(() => ({ onMouseMove }), [onMouseMove])
}

export const useMapHoverCoordinates = () => {
  const hoverCoordinates = useAtomValue(hoverCoordinatesAtom)
  return useMemo(() => hoverCoordinates, [hoverCoordinates])
}

export const useMapMouseClick = () => {
  const getPickingInteraction = useGetPickingInteraction()
  const { isMapDrawing } = useMapDrawConnect()
  const { dispatchClickedEvent } = useClickedEventConnect()

  const onMapClick: DeckProps['onClick'] = useCallback(
    (info: PickingInfo, event: any) => {
      if (!info.coordinate) return
      if (event.srcEvent.defaultPrevented) {
        // this is needed to allow interacting with overlay elements content
        return true
      }
      if (isMapDrawing) {
        return false
      }
      const clickInteraction = getPickingInteraction(info, 'click')
      if (clickInteraction?.features?.length === 1 && info.object?.interactionType === 'segment') {
        return
      }
      if (clickInteraction) {
        dispatchClickedEvent(clickInteraction)
      }
    },
    [dispatchClickedEvent, getPickingInteraction, isMapDrawing]
  )

  return onMapClick
}

export const useMapCursor = () => {
  const store = useStore()
  const overlaysCursor = useAtomValue(overlaysCursorAtom)
  const eventsDataviews = useSelector(selectEventsDataviews)
  const getAreClusterTilesLoading = useGetAreClusterTilesLoading()
  const { isMapAnnotating } = useMapAnnotation()
  const { isErrorNotificationEditing } = useMapErrorNotification()
  const { rulersEditing } = useRulers()

  const getCursor = useCallback(
    ({ isDragging }: { isDragging: boolean }) => {
      // Read hover features and loading state on-demand — no render subscriptions
      const features = store.get(deckHoverInteractionAtom)?.features
      if (overlaysCursor) {
        return overlaysCursor
      }
      if (features?.some(isRulerLayerPoint)) {
        return 'move'
      }
      if (features?.some(isTilesClusterLayer)) {
        const isCluster = (features as FourwingsClusterPickingObject[]).some(
          (f) =>
            isTilesClusterLayerCluster(f) &&
            (f.expansionBounds !== undefined || f.expansionZoom !== undefined)
        )
        const isCountryClusterMode = (features as FourwingsClusterPickingObject[]).some(
          (f) => f.clusterMode === 'country'
        )
        if (getAreClusterTilesLoading(eventsDataviews)) {
          return 'wait'
        }
        return !isCluster && !isCountryClusterMode ? 'pointer' : 'zoom-in'
      }
      if (isMapAnnotating || isErrorNotificationEditing || rulersEditing) {
        return 'crosshair'
      }
      if (isDragging) {
        return 'grabbing'
      }
      if (features?.length) {
        if (features?.some((f) => !isTrackSegment(f))) {
          return 'pointer'
        }
        return 'grab'
      }
      return 'grab'
    },
    [
      store,
      eventsDataviews,
      getAreClusterTilesLoading,
      overlaysCursor,
      isMapAnnotating,
      isErrorNotificationEditing,
      rulersEditing,
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
    (info: PickingInfo) => {
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
    [dispatch]
  )
}
