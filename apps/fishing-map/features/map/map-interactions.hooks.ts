import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { DeckProps, PickingInfo, Position } from '@deck.gl/core/typed'
import {
  InteractionEventCallback,
  useFeatureState,
  useMapClick,
  useMapHover,
  useSimpleMapHover,
} from '@globalfishingwatch/react-hooks'
import { ExtendedStyle, ExtendedStyleMeta, GeneratorType } from '@globalfishingwatch/layer-composer'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { MapLayerMouseEvent } from '@globalfishingwatch/maplibre-gl'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { useMapAnnotation } from 'features/map/overlays/annotations/annotations.hooks'
import {
  TooltipEventFeature,
  parseMapTooltipEvent,
  useClickedEventConnect,
  useMapHighlightedEvent,
} from 'features/map/map.hooks'
import useRulers from 'features/map/overlays/rulers/rulers.hooks'
import useMapInstance from 'features/map/map-context.hooks'
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

export const useMapMouseHover = (style?: ExtendedStyle) => {
  const map = useMapInstance()
  const { isMapDrawing } = useMapDrawConnect()
  const { isMapAnnotating } = useMapAnnotation()
  const { onRulerMapHover, rulersEditing } = useRulers()
  const dataviews = useSelector(selectCurrentDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const { cleanFeatureState } = useFeatureState(map)

  const [hoveredEvent, setHoveredEvent] = useState<SliceInteractionEvent | null>(null)
  const [hoveredDebouncedEvent, setHoveredDebouncedEvent] = useState<SliceInteractionEvent | null>(
    null
  )

  const onSimpleMapHover = useSimpleMapHover(setHoveredEvent as InteractionEventCallback)
  const onMapHover = useMapHover(
    setHoveredEvent as InteractionEventCallback,
    setHoveredDebouncedEvent as InteractionEventCallback,
    map,
    style?.metadata
  )

  const onMouseMove: any = useCallback(
    (event: MapLayerMouseEvent) => {
      if (isMapDrawing || isMapAnnotating) {
        return onSimpleMapHover(event)
      }
      if (rulersEditing) {
        return onMapHover(onRulerMapHover(event))
      }
      return onMapHover(event)
    },
    [isMapAnnotating, isMapDrawing, onMapHover, onRulerMapHover, onSimpleMapHover, rulersEditing]
  )

  const hoveredTooltipEvent = parseMapTooltipEvent(hoveredEvent, dataviews, temporalgridDataviews)
  useMapHighlightedEvent(hoveredTooltipEvent?.features)

  const resetHoverState = useCallback(() => {
    setHoveredEvent(null)
    setHoveredDebouncedEvent(null)
    cleanFeatureState('hover')
  }, [cleanFeatureState])

  return {
    onMouseMove,
    resetHoverState,
    hoveredEvent,
    hoveredDebouncedEvent,
    hoveredTooltipEvent,
  }
}

export const useMapMouseClick = (style?: ExtendedStyle) => {
  const map = useMapInstance()
  const { isMapDrawing } = useMapDrawConnect()
  const { isMapAnnotating, addMapAnnotation } = useMapAnnotation()
  const { isErrorNotificationEditing, addErrorNotification } = useMapErrorNotification()
  const isMarineManagerLocation = useSelector(selectIsMarineManagerLocation)
  const dataviews = useSelector(selectCurrentDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const { onRulerMapClick, rulersEditing } = useRulers()
  const { clickedEvent, dispatchClickedEvent } = useClickedEventConnect()

  const onClick = useMapClick(dispatchClickedEvent, style?.metadata as ExtendedStyleMeta, map)

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
        {}
      )

    return Object.entries(layersByCategory).map(
      ([featureCategory, features]) =>
        `${featureCategory}: ${features.map((f) => f.layerId).join(',')}`
    )
  }, [clickedEvent, clickedTooltipEvent])

  const onMapClick: DeckProps['onClick'] = useCallback(
    (info: PickingInfo, event: any) => {
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

      if (isMapAnnotating) {
        return addMapAnnotation(info.coordinate as Position)
      }
      if (isErrorNotificationEditing) {
        return addErrorNotification(info.coordinate as Position)
      }
      // onClick(event)
    },
    [
      clickedCellLayers,
      isMapAnnotating,
      isErrorNotificationEditing,
      addMapAnnotation,
      addErrorNotification,
    ]
  )

  return { onMapClick, clickedTooltipEvent }
}

const hasTooltipEventFeature = (
  hoveredTooltipEvent: ReturnType<typeof parseMapTooltipEvent>,
  type: GeneratorType
) => {
  return hoveredTooltipEvent?.features.find((f) => f.type === type) !== undefined
}

const hasToolFeature = (hoveredTooltipEvent?: ReturnType<typeof parseMapTooltipEvent>) => {
  if (!hoveredTooltipEvent) return false
  return (
    hasTooltipEventFeature(hoveredTooltipEvent, GeneratorType.Annotation) ||
    hasTooltipEventFeature(hoveredTooltipEvent, GeneratorType.Rulers)
  )
}

export const useMapCursor = (hoveredTooltipEvent?: ReturnType<typeof parseMapTooltipEvent>) => {
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
      if (hasTooltipEventFeature(hoveredTooltipEvent, GeneratorType.Annotation) && !gfwUser) {
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
      const clusterConfig = dataviews.find((d) => d.config?.type === GeneratorType.TileCluster)
      const eventsCount = clusterConfig?.config?.duplicatedEventsWorkaround ? 2 : 1

      const clusterFeature = hoveredTooltipEvent.features.find(
        (f) => f.type === GeneratorType.TileCluster && parseInt(f.properties.count) > eventsCount
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
