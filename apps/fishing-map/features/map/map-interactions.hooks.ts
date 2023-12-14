import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
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
import { useMapAnnotation } from 'features/map/annotations/annotations.hooks'
import {
  TooltipEventFeature,
  parseMapTooltipEvent,
  useClickedEventConnect,
  useMapHighlightedEvent,
} from 'features/map/map.hooks'
import useRulers from 'features/map/rulers/rulers.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { selectCurrentDataviewInstancesResolved } from 'features/dataviews/dataviews.slice'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getEventLabel } from 'utils/analytics'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import { selectIsMarineManagerLocation } from 'routes/routes.selectors'
import { useMapClusterTilesLoaded } from 'features/map/map-sources.hooks'
import { ANNOTATIONS_GENERATOR_ID } from 'features/map/map.config'
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
        return onRulerMapHover(event)
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

  const onMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      trackEvent({
        category: TrackCategory.EnvironmentalData,
        action: `Click in grid cell`,
        label: getEventLabel(clickedCellLayers ?? []),
      })
      if (isMapDrawing || isMarineManagerLocation) {
        return undefined
      }
      if (rulersEditing) {
        return onRulerMapClick(event)
      }
      if (isMapAnnotating) {
        return addMapAnnotation(event)
      }
      // Filtering out features that are not annotations when clickin on one to avoid double tooltips
      const annotationFeature = event.features?.find((f) => f.source === ANNOTATIONS_GENERATOR_ID)
      onClick({
        ...event,
        features: annotationFeature ? [annotationFeature] : event.features,
      } as MapLayerMouseEvent)
    },
    [
      clickedCellLayers,
      isMapDrawing,
      isMarineManagerLocation,
      rulersEditing,
      isMapAnnotating,
      onClick,
      onRulerMapClick,
      addMapAnnotation,
    ]
    // this stops complaining between typings in mapbox-gl and maplibre-gl
  ) as (e: any) => void

  return { onMapClick, clickedTooltipEvent }
}

export const useMapCursor = (hoveredTooltipEvent?: ReturnType<typeof parseMapTooltipEvent>) => {
  const map = useMapInstance()
  const { isMapAnnotating } = useMapAnnotation()
  const { isMapDrawing } = useMapDrawConnect()
  const { rulersEditing } = useRulers()
  const isMarineManagerLocation = useSelector(selectIsMarineManagerLocation)
  const dataviews = useSelector(selectCurrentDataviewInstancesResolved)
  const tilesClusterLoaded = useMapClusterTilesLoaded()

  const getCursor = useCallback(() => {
    if (rulersEditing || isMapAnnotating) {
      return 'crosshair'
    } else if (isMapDrawing || isMarineManagerLocation) {
      // updating cursor using css at style.css as the library sets classes depending on the state
      return undefined
    } else if (hoveredTooltipEvent) {
      // Workaround to fix cluster events duplicated, only working for encounters and needs
      // TODO if wanted to scale it to other layers
      const clusterConfig = dataviews.find((d) => d.config?.type === GeneratorType.TileCluster)
      const eventsCount = clusterConfig?.config?.duplicatedEventsWorkaround ? 2 : 1

      const annotationFeature = hoveredTooltipEvent.features.find(
        (f) => f.type === GeneratorType.Annotation
      )
      if (annotationFeature) {
        return 'all-scroll'
      }

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
    rulersEditing,
    isMapAnnotating,
    isMapDrawing,
    isMarineManagerLocation,
    hoveredTooltipEvent,
    map,
    dataviews,
    tilesClusterLoaded,
  ])

  return getCursor()
}
