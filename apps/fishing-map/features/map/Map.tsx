import { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { DeckGL, DeckGLRef } from '@deck.gl/react/typed'
import { LayersList } from '@deck.gl/core/typed'
import dynamic from 'next/dynamic'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { ViewStateChangeParameters } from '@deck.gl/core/typed/controllers/controller'
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
import { DEFAULT_VIEWPORT, POPUP_CATEGORY_ORDER } from 'data/config'
import useMapInstance, { useSetMapInstance } from 'features/map/map-context.hooks'
import {
  useClickedEventConnect,
  useMapHighlightedEvent,
  parseMapTooltipEvent,
  useGeneratorsConnect,
  TooltipEventFeature,
} from 'features/map/map.hooks'
import { selectActiveTemporalgridDataviews } from 'features/dataviews/dataviews.selectors'
import MapControls from 'features/map/controls/MapControls'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { getEventLabel } from 'utils/analytics'
import { selectShowTimeComparison } from 'features/reports/reports.selectors'
import {
  selectIsMarineManagerLocation,
  selectIsReportLocation,
  selectIsWorkspaceLocation,
} from 'routes/routes.selectors'
import { selectCurrentDataviewInstancesResolved } from 'features/dataviews/dataviews.slice'
import { useMapLoaded, useSetMapIdleAtom } from 'features/map/map-state.hooks'
import { useEnvironmentalBreaksUpdate } from 'features/workspace/environmental/environmental.hooks'
import { mapReadyAtom } from 'features/map/map-state.atom'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { selectHighlightedTime } from 'features/timebar/timebar.slice'
import { selectMapTimeseries } from 'features/reports/reports-timeseries.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useMapDeckLayers, useMapLayersLoaded } from 'features/map/map-layers.hooks'
import { MapCoordinates } from 'types'
import {
  MAP_VIEW,
  useViewStateAtom,
  useUpdateViewStateUrlParams,
  useSetViewState,
  useViewState,
} from './map-viewport.hooks'
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
const Hint = dynamic(() => import(/* webpackChunkName: "Hint" */ 'features/help/Hint'))

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
  position: 'relative',
}

const MapWrapper = () => {
  ///////////////////////////////////////
  // DECK related code
  const deckRef = useRef<DeckGLRef>(null)
  useSetMapInstance(deckRef)

  // const [viewState, setViewState] = useState<any>(DEFAULT_VIEWPORT)
  // const viewState = useRef<any>(DEFAULT_VIEWPORT)
  const setViewState = useSetViewState()
  // const [viewState, setViewState] = useState(DEFAULT_VIEWPORT)
  const onViewStateChange = useCallback(
    (params: ViewStateChangeParameters) => {
      // const { latitude, longitude, zoom } = params.viewState
      // viewState.current = { latitude, longitude, zoom }
      setViewState(params.viewState)
    },
    [setViewState]
  )
  // const onViewStateChange = useCallback(
  //   (params: ViewStateChangeParameters) => {
  //     console.log(params)
  //     setViewState(params.viewState as MapCoordinates)
  //   },
  //   [setViewState]
  // )
  // useUpdateViewStateUrlParams()
  ////////////////////////////////////////
  // Used it only once here to attach the listener only once
  useSetMapIdleAtom()
  useMapSourceTilesLoadedAtom()
  useEnvironmentalBreaksUpdate()
  const map = useMapInstance()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()

  const setMapReady = useSetRecoilState(mapReadyAtom)
  const hasTimeseries = useRecoilValue(selectMapTimeseries)
  const { isMapDrawing } = useMapDrawConnect()
  const dataviews = useSelector(selectCurrentDataviewInstancesResolved)
  const temporalgridDataviews = useSelector(selectActiveTemporalgridDataviews)
  const isMarineManagerLocation = useSelector(selectIsMarineManagerLocation)

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style, loading: layerComposerLoading } = useLayerComposer(
    generatorsConfig,
    globalConfig,
    defaultStyleTransformations,
    layerComposer
  )

  const layers: LayersList = useMapDeckLayers()
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
      trackEvent({
        category: TrackCategory.EnvironmentalData,
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

  const showTimeComparison = useSelector(selectShowTimeComparison)
  const reportLocation = useSelector(selectIsReportLocation)
  const isWorkspace = useSelector(selectIsWorkspaceLocation)
  const debugOptions = useSelector(selectDebugOptions)

  const mapLegends = useMapLegend(style, dataviews, hoveredEvent)
  const portalledLegend = !showTimeComparison

  // const mapLoaded = useMapLoaded()
  const mapLoaded = useMapLayersLoaded()
  const tilesClusterLoaded = useMapClusterTilesLoaded()

  const getCursor = useCallback(() => {
    if (isMapDrawing || isMarineManagerLocation) {
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
    isMapDrawing,
    isMarineManagerLocation,
    hoveredTooltipEvent,
    map,
    dataviews,
    tilesClusterLoaded,
  ])

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
      <DeckGL
        id="map"
        ref={deckRef}
        views={MAP_VIEW}
        layers={layers}
        style={mapStyles}
        // more info about preserveDrawingBuffer
        // https://github.com/visgl/deck.gl/issues/4436#issuecomment-610472868
        glOptions={{ preserveDrawingBuffer: true }}
        layerFilter={({ renderPass, layer }) => {
          // This avoids performing the default picking
          // since we are handling it through pickMultipleObjects
          // discussion for reference https://github.com/visgl/deck.gl/discussions/5793
          if (renderPass === 'picking:hover') {
            // if (!loadedLayers.includes(layer.id) || renderPass === 'picking:hover') {
            return false
          }
          return true
        }}
        // viewState={viewState}
        initialViewState={DEFAULT_VIEWPORT}
        onViewStateChange={onViewStateChange}
        // viewState={viewState}
        // onViewStateChange={onViewStateChange}
        controller={true}
        // onClick={onClick}
        // onHover={onHover}
      />
      {/* {style && (
        <Map
          id="map"
          style={{ ...mapStyles, display: 'none', pointerEvents: 'none' }}
          keyboard={!isMapDrawing}
          zoom={viewport.zoom}
          mapLib={maplibregl}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          pitch={debugOptions.extruded ? 40 : 0}
          bearing={0}
          // onMove={isAnalyzing && !hasTimeseries ? undefined : onViewportChange}
          mapStyle={style as MapboxStyle}
          transformRequest={transformRequest}
          onResize={setMapBounds}
          // cursor={rulersEditing ? rulesCursor : getCursor()}
          interactiveLayerIds={interactiveLayerIds}
          // onClick={isMapDrawing || isMarineManagerLocation ? undefined : currentClickCallback}
          // onMouseEnter={onMouseMove}
          // onMouseMove={onMouseMove}
          // onMouseLeave={resetHoverState}
          // onLoad={onLoadCallback}
          // onError={handleError}
          // onMouseOut={resetHoverState}
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
      )} */}
      <MapControls onMouseEnter={resetHoverState} mapLoading={debouncedMapLoading} />
      {isWorkspace && !reportLocation && (
        <Hint id="fishingEffortHeatmap" className={styles.helpHintLeft} />
      )}
      {isWorkspace && !reportLocation && (
        <Hint id="clickingOnAGridCellToShowVessels" className={styles.helpHintRight} />
      )}
    </div>
  )
}

export default MapWrapper
