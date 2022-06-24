import { useCallback, useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { Map, MapboxStyle } from 'react-map-gl'
import dynamic from 'next/dynamic'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import maplibregl from '@globalfishingwatch/maplibre-gl'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import {
  useMapClick,
  useMapHover,
  useMapLegend,
  useFeatureState,
  useSimpleMapHover,
  InteractionEventCallback,
  useLayerComposer,
  defaultStyleTransformations,
  useDebounce,
  useMemoCompare,
} from '@globalfishingwatch/react-hooks'
import { ExtendedStyleMeta, GeneratorType, LayerComposer } from '@globalfishingwatch/layer-composer'
import type { RequestParameters } from '@globalfishingwatch/maplibre-gl'
import { POPUP_CATEGORY_ORDER } from 'data/config'
import useMapInstance from 'features/map/map-context.hooks'
import {
  useClickedEventConnect,
  useMapHighlightedEvent,
  parseMapTooltipEvent,
  useGeneratorsConnect,
  TooltipEventFeature,
} from 'features/map/map.hooks'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import MapInfo from 'features/map/controls/MapInfo'
import MapControls from 'features/map/controls/MapControls'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { getEventLabel } from 'utils/analytics'
import { selectIsAnalyzing, selectShowTimeComparison } from 'features/analysis/analysis.selectors'
import { isWorkspaceLocation } from 'routes/routes.selectors'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.slice'
import { useMapLoaded, useSetMapIdleAtom } from 'features/map/map-state.hooks'
import { useEnvironmentalBreaksUpdate } from 'features/workspace/environmental/environmental.hooks'
import { mapReadyAtom } from 'features/map/map-state.atom'
import { selectMapTimeseries } from 'features/analysis/analysis.hooks'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import useViewport, { useMapBounds } from './map-viewport.hooks'
import styles from './Map.module.css'
import useRulers from './rulers/rulers.hooks'
import {
  useAllMapSourceTilesLoaded,
  useMapClusterTilesLoaded,
  useMapSourceTilesLoadedAtom,
} from './map-sources.hooks'
import { SliceInteractionEvent } from './map.slice'
import MapLegends from './MapLegends'

const MapDraw = dynamic(() => import(/* webpackChunkName: "MapDraw" */ './MapDraw'))
const PopupWrapper = dynamic(
  () => import(/* webpackChunkName: "PopupWrapper" */ './popups/PopupWrapper')
)
const Hint = dynamic(() => import(/* webpackChunkName: "Hint" */ 'features/help/hints/Hint'))

// TODO: Abstract this away
const transformRequest: (...args: any[]) => RequestParameters = (url: string) => {
  const response: RequestParameters = { url }
  if (url.includes('globalfishingwatch')) {
    response.headers = {
      Authorization: 'Bearer ' + GFWAPI.getToken(),
    }
  }
  return response
}

const handleError = async ({ error }: any) => {
  if (
    (error?.status === 401 || error?.status === 403) &&
    error?.url.includes('globalfishingwatch')
  ) {
    try {
      await GFWAPI.refreshAPIToken()
    } catch (e) {
      console.warn(e)
    }
  }
}

const layerComposer = new LayerComposer({
  sprite:
    'https://raw.githubusercontent.com/GlobalFishingWatch/map-gl-sprites/master/out/sprites-map',
})

const mapStyles = {
  width: '100%',
  height: '100%',
}

const MapWrapper = () => {
  // Used it only once here to attach the listener only once
  useSetMapIdleAtom()
  useMapSourceTilesLoadedAtom()
  useEnvironmentalBreaksUpdate()
  const map = useMapInstance()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  const setMapReady = useSetRecoilState(mapReadyAtom)
  const hasTimeseries = useRecoilValue(selectMapTimeseries)
  const { isMapDrawing } = useMapDrawConnect()
  const dataviews = useSelector(selectDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style, loading: layerComposerLoading } = useLayerComposer(
    generatorsConfig,
    globalConfig,
    defaultStyleTransformations,
    layerComposer
  )
  const allSourcesLoaded = useAllMapSourceTilesLoaded()

  const { clickedEvent, dispatchClickedEvent, cancelPendingInteractionRequests } =
    useClickedEventConnect()
  const clickedTooltipEvent = parseMapTooltipEvent(clickedEvent, dataviews, temporalgridDataviews)
  const { cleanFeatureState } = useFeatureState(map)
  const { rulesCursor, onMapHoverWithRuler, onMapClickWithRuler, rulersEditing } = useRulers()

  const onMapClick = useMapClick(dispatchClickedEvent, style?.metadata as ExtendedStyleMeta, map)

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

  const currentClickCallback = useMemo(() => {
    const clickEvent = (event: any) => {
      uaEvent({
        category: 'Environmental data',
        action: `Click in grid cell`,
        label: getEventLabel(clickedCellLayers ?? []),
      })
      return rulersEditing ? onMapClickWithRuler(event) : onMapClick(event)
    }
    return clickEvent
  }, [clickedCellLayers, rulersEditing, onMapClickWithRuler, onMapClick])

  const onLoadCallback = useCallback(() => {
    setMapReady(true)
  }, [setMapReady])

  const closePopup = useCallback(() => {
    cleanFeatureState('click')
    dispatchClickedEvent(null)
    cancelPendingInteractionRequests()
  }, [cancelPendingInteractionRequests, cleanFeatureState, dispatchClickedEvent])

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
  const currentMapHoverCallback = useMemo(() => {
    return rulersEditing ? onMapHoverWithRuler : onMapHover
  }, [rulersEditing, onMapHoverWithRuler, onMapHover])

  const hoveredTooltipEvent = parseMapTooltipEvent(hoveredEvent, dataviews, temporalgridDataviews)
  useMapHighlightedEvent(hoveredTooltipEvent?.features)

  const resetHoverState = useCallback(() => {
    setHoveredEvent(null)
    setHoveredDebouncedEvent(null)
    cleanFeatureState('hover')
  }, [cleanFeatureState])

  const { viewport, onViewportChange } = useViewport()

  const { setMapBounds } = useMapBounds()
  useEffect(() => {
    setMapBounds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport])

  const showTimeComparison = useSelector(selectShowTimeComparison)
  const isAnalyzing = useSelector(selectIsAnalyzing)
  const isWorkspace = useSelector(isWorkspaceLocation)
  const debugOptions = useSelector(selectDebugOptions)

  const mapLegends = useMapLegend(style, dataviews, hoveredEvent)
  const portalledLegend = !showTimeComparison

  const mapLoaded = useMapLoaded()
  const tilesClusterLoaded = useMapClusterTilesLoaded()

  const getCursor = useCallback(() => {
    if (isMapDrawing) {
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
  }, [isMapDrawing, hoveredTooltipEvent, dataviews, tilesClusterLoaded])

  useEffect(() => {
    if (map) {
      map.showTileBoundaries = debugOptions.debug
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, debugOptions])

  useEffect(() => {
    if (map) {
      map.showTileBoundaries = debugOptions.debug
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, debugOptions])

  const mapLoading = !mapLoaded || layerComposerLoading || !allSourcesLoaded
  const debouncedMapLoading = useDebounce(mapLoading, 300)

  const onMouseMove: any = useMemo(() => {
    return isMapDrawing ? onSimpleMapHover : currentMapHoverCallback
  }, [currentMapHoverCallback, isMapDrawing, onSimpleMapHover])

  const styleInteractiveLayerIds = useMemoCompare(style?.metadata?.interactiveLayerIds)
  const interactiveLayerIds = useMemo(() => {
    if (rulersEditing || isMapDrawing) {
      return undefined
    }
    return styleInteractiveLayerIds
  }, [isMapDrawing, rulersEditing, styleInteractiveLayerIds])

  return (
    <div className={styles.container}>
      {style && (
        <Map
          id="map"
          style={mapStyles}
          keyboard={!isMapDrawing}
          zoom={viewport.zoom}
          mapLib={maplibregl}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          pitch={debugOptions.extruded ? 40 : 0}
          onMove={isAnalyzing && !hasTimeseries ? undefined : onViewportChange}
          mapStyle={style as MapboxStyle}
          transformRequest={transformRequest}
          onResize={setMapBounds}
          cursor={rulersEditing ? rulesCursor : getCursor()}
          interactiveLayerIds={interactiveLayerIds}
          onClick={isMapDrawing ? undefined : currentClickCallback}
          onMouseEnter={onMouseMove}
          onMouseMove={onMouseMove}
          onMouseLeave={resetHoverState}
          onLoad={onLoadCallback}
          onError={handleError}
          onMouseOut={resetHoverState}
        >
          {clickedEvent && (
            <PopupWrapper
              type="click"
              event={clickedTooltipEvent}
              onClose={closePopup}
              closeOnClick={false}
              closeButton
            />
          )}
          {hoveredTooltipEvent &&
            !clickedEvent &&
            hoveredEvent?.latitude === hoveredDebouncedEvent?.latitude &&
            hoveredEvent?.longitude === hoveredDebouncedEvent?.longitude && (
              <PopupWrapper type="hover" event={hoveredTooltipEvent} anchor="top-left" />
            )}
          <MapInfo center={hoveredEvent} />
          {isMapDrawing && <MapDraw />}
          {mapLegends && <MapLegends legends={mapLegends} portalled={portalledLegend} />}
        </Map>
      )}
      <MapControls onMouseEnter={resetHoverState} mapLoading={debouncedMapLoading} />
      {isWorkspace && !isAnalyzing && (
        <Hint id="fishingEffortHeatmap" className={styles.helpHintLeft} />
      )}
      {isWorkspace && !isAnalyzing && (
        <Hint id="clickingOnAGridCellToShowVessels" className={styles.helpHintRight} />
      )}
    </div>
  )
}

export default MapWrapper
