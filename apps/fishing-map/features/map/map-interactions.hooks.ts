import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { DeckProps, PickingInfo, Position, Deck } from '@deck.gl/core'
import {
  InteractionEventCallback,
  useFeatureState,
  useMapClick,
  useMapHover,
  useSimpleMapHover,
} from '@globalfishingwatch/react-hooks'
import { ExtendedStyle, ExtendedStyleMeta } from '@globalfishingwatch/layer-composer'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import {
  useMapHoverInteraction,
  useSetMapHoverInteraction,
  useMapClickInteraction,
  useSetMapClickInteraction,
} from '@globalfishingwatch/deck-layer-composer'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { useMapAnnotation } from 'features/map/overlays/annotations/annotations.hooks'
import {
  TooltipEventFeature,
  parseMapTooltipEvent,
  useClickedEventConnect,
  useMapHighlightedEvent,
} from 'features/map/map.hooks'
import useRulers from 'features/map/overlays/rulers/rulers.hooks'
import useMapInstance, { useDeckMap } from 'features/map/map-context.hooks'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getEventLabel } from 'utils/analytics'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import { selectIsMarineManagerLocation } from 'routes/routes.selectors'
import { useMapClusterTilesLoaded } from 'features/map/map-sources.hooks'
import {
  ANNOTATIONS_GENERATOR_ID,
  RULERS_LAYER_ID,
  WORKSPACES_POINTS_TYPE,
} from 'features/map/map.config'
import { useMapErrorNotification } from 'features/map/overlays/error-notification/error-notification.hooks'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { selectCurrentDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { SliceInteractionEvent } from './map.slice'
import { isRulerLayerPoint } from './map-interaction.utils'
import { useMapRulersDrag } from './overlays/rulers/rulers-drag.hooks'

const defaultEmptyFeatures = [] as PickingInfo[]
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
        })
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

export const useMapMouseClick = (style?: ExtendedStyle) => {
  // const map = useMapInstance()
  const map = useDeckMap()
  const { isMapDrawing } = useMapDrawConnect()
  const setMapClickFeatures = useSetMapClickInteraction()
  const { isMapAnnotating, addMapAnnotation } = useMapAnnotation()
  const { isErrorNotificationEditing, addErrorNotification } = useMapErrorNotification()
  const isMarineManagerLocation = useSelector(selectIsMarineManagerLocation)
  const dataviews = useSelector(selectCurrentDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const { onRulerMapClick, rulersEditing } = useRulers()
  const { clickedEvent, dispatchClickedEvent } = useClickedEventConnect()

  // const onClick = useMapClick(dispatchClickedEvent, style?.metadata as ExtendedStyleMeta, map)

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
      // const features = deckRef?.current?.pickMultipleObjects({
      //   x: info.x,
      //   y: info.y,
      // })
      trackEvent({
        category: TrackCategory.EnvironmentalData,
        action: `Click in grid cell`,
        label: getEventLabel(clickedCellLayers ?? []),
      })
      // const hasWorkspacesFeatures =
      //   event?.features?.find(
      //     (feature: any) => feature.properties.type === WORKSPACES_POINTS_TYPE
      //   ) !== undefined
      // if (isMapDrawing || (isMarineManagerLocation && !hasWorkspacesFeatures)) {
      //   return undefined
      // }

      // const hasRulerFeature =
      //   event.features?.find((f) => f.source === RULERS_LAYER_ID) !== undefined
      // if (rulersEditing && !hasRulerFeature) {
      //   return onRulerMapClick(event)
      // }
      let features = defaultEmptyFeatures
      try {
        features = map?.pickMultipleObjects({
          x: info.x,
          y: info.y,
          radius: 0,
        })
      } catch (e) {
        console.warn(e)
      }
      setMapClickFeatures({ longitude: info.coordinate[0], latitude: info.coordinate[1], features })
      const fourWingsValues = features?.map(
        (f: PickingInfo) =>
          f.sourceLayer?.getPickingInfo({ info, mode: 'click', sourceLayer: f.sourceLayer }).object
            ?.values
      )[0]
      if (fourWingsValues) {
        console.log('fourWingsValues', fourWingsValues)
      }

      if (isMapAnnotating) {
        return addMapAnnotation(info.coordinate as Position)
      }
      if (isErrorNotificationEditing) {
        return addErrorNotification(info.coordinate as Position)
      }
      if (rulersEditing) {
        return onRulerMapClick(info)
      }
      // onClick(event)
    },
    [
      clickedCellLayers,
      map,
      isMapAnnotating,
      isErrorNotificationEditing,
      rulersEditing,
      addMapAnnotation,
      addErrorNotification,
      setMapClickFeatures,
      onRulerMapClick,
    ]
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
