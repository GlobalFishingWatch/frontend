import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { DeckGL, DeckGLRef } from '@deck.gl/react/typed'
import { LayersList, PickingInfo } from '@deck.gl/core/typed'
import dynamic from 'next/dynamic'
// import { atom, useAtom } from 'jotai'
import { ViewStateChangeParameters } from '@deck.gl/core/typed/controllers/controller'
import { ViewState } from 'react-map-gl'
import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  useMapLegend,
  useFeatureState,
  useLayerComposer,
  defaultStyleTransformations,
  useDebounce,
  useMemoCompare,
} from '@globalfishingwatch/react-hooks'
import { LayerComposer } from '@globalfishingwatch/layer-composer'
import type { RequestParameters } from '@globalfishingwatch/maplibre-gl'
import { AnyDeckLayer } from '@globalfishingwatch/deck-layers'
import { useSetDeckLayerLoadedState } from '@globalfishingwatch/deck-layer-composer'
import useMapInstance, { useSetMapInstance } from 'features/map/map-context.hooks'
import { useClickedEventConnect, useGeneratorsConnect } from 'features/map/map.hooks'
import MapInfo from 'features/map/controls/MapInfo'
import MapControls from 'features/map/controls/MapControls'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { selectShowTimeComparison } from 'features/reports/reports.selectors'
import {
  selectIsAnyReportLocation,
  selectIsMapDrawing,
  selectIsWorkspaceLocation,
} from 'routes/routes.selectors'
import { useMapLoaded, useSetMapIdleAtom } from 'features/map/map-state.hooks'
import { useEnvironmentalBreaksUpdate } from 'features/workspace/environmental/environmental.hooks'
import { mapReadyAtom } from 'features/map/map-state.atom'
import { useMapDrawConnect } from 'features/map/map-draw.hooks'
import { selectHighlightedTime } from 'features/timebar/timebar.slice'
import { hasMapTimeseriesAtom } from 'features/reports/reports-timeseries.hooks'
import {
  useMapCursor,
  useMapMouseClick,
  useMapMouseHover,
} from 'features/map/map-interactions.hooks'
import MapAnnotations from 'features/map/annotations/Annotations'
import { useMapRulersDrag } from 'features/map/rulers/rulers-drag.hooks'
import { useMapAnnotationDrag } from 'features/map/annotations/annotations-drag.hooks'
import ErrorNotification from 'features/map/error-notification/ErrorNotification'
import { selectCurrentDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
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
import { useAllMapSourceTilesLoaded, useMapSourceTilesLoadedAtom } from './map-sources.hooks'
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
  const { viewState, setViewState } = useViewStateAtom()
  // const [viewState, setViewState] = useState(DEFAULT_VIEWPORT)
  const onViewStateChange = useCallback(
    (params: ViewStateChangeParameters) => {
      // const { latitude, longitude, zoom } = params.viewState
      // viewState.current = { latitude, longitude, zoom }
      setViewState(params.viewState as ViewState)
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
  useUpdateViewStateUrlParams()
  ////////////////////////////////////////
  // Used it only once here to attach the listener only once
  useSetMapIdleAtom()
  useMapSourceTilesLoadedAtom()
  useEnvironmentalBreaksUpdate()
  useMapRulersDrag()
  useMapAnnotationDrag()
  // const map = useMapInstance()
  // const { isMapDrawing } = useMapDrawConnect()
  // const { generatorsConfig, globalConfig } = useGeneratorsConnect()

  // const setMapReady = useSetRecoilState(mapReadyAtom)
  // const [hasTimeseries] = useAtom(hasMapTimeseriesAtom)
  // const dataviews = useSelector(selectCurrentDataviewInstancesResolved)
  // const isMapInteractionDisabled = useSelector(selectIsMapDrawing)

  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  // const { style, loading: layerComposerLoading } = useLayerComposer(
  //   generatorsConfig,
  //   globalConfig,
  //   defaultStyleTransformations,
  //   layerComposer
  // )

  const layers = useMapDeckLayers()
  // const allSourcesLoaded = useAllMapSourceTilesLoaded()

  // const { clickedEvent, dispatchClickedEvent, cancelPendingInteractionRequests } =
  //   useClickedEventConnect()
  // const { cleanFeatureState } = useFeatureState(map)

  // const onLoadCallback = useCallback(() => {
  //   setMapReady(true)
  // }, [setMapReady])

  // const closePopup = useCallback(() => {
  //   cleanFeatureState('click')
  //   dispatchClickedEvent(null)
  //   cancelPendingInteractionRequests()
  // }, [cancelPendingInteractionRequests, cleanFeatureState, dispatchClickedEvent])

  const reportLocation = useSelector(selectIsAnyReportLocation)
  const isWorkspace = useSelector(selectIsWorkspaceLocation)

  const resetHoverState = useCallback(() => {
    // TODO in deck.gl
    // setHoveredEvent(null)
    // setHoveredDebouncedEvent(null)
    // cleanFeatureState('hover')
  }, [])
  // // const mapLoaded = useMapLoaded()

  // const [hoveredEvent, setHoveredEvent] = useState<SliceInteractionEvent | null>(null)

  // const [hoveredDebouncedEvent, setHoveredDebouncedEvent] = useState<SliceInteractionEvent | null>(
  //   null
  // )
  // const onSimpleMapHover = useSimpleMapHover(setHoveredEvent as InteractionEventCallback)
  // const onMapHover = useMapHover(
  //   setHoveredEvent as InteractionEventCallback,
  //   setHoveredDebouncedEvent as InteractionEventCallback,
  //   map,
  //   style?.metadata
  // )
  // const currentMapHoverCallback = useMemo(() => {
  //   return rulersEditing ? onMapHoverWithRuler : onMapHover
  // }, [rulersEditing, onMapHoverWithRuler, onMapHover])

  // const hoveredTooltipEvent = parseMapTooltipEvent(hoveredEvent, dataviews, temporalgridDataviews)
  // useMapHighlightedEvent(hoveredTooltipEvent?.features)

  // const showTimeComparison = useSelector(selectShowTimeComparison)
  // const debugOptions = useSelector(selectDebugOptions)

  // const mapLegends = useMapLegend(style, dataviews, hoveredEvent)
  // const portalledLegend = !showTimeComparison

  // // const mapLoaded = useMapLoaded()
  // const mapLoaded = useMapLayersLoaded()
  // const tilesClusterLoaded = useMapClusterTilesLoaded()

  // const getCursor = useCallback(() => {
  //   if (isMapDrawing || isMarineManagerLocation) {
  //     // updating cursor using css at style.css as the library sets classes depending on the state
  //     return undefined
  //   } else if (hoveredTooltipEvent) {
  //     // Workaround to fix cluster events duplicated, only working for encounters and needs
  //     // TODO if wanted to scale it to other layers
  //     const clusterConfig = dataviews.find((d) => d.config?.type === GeneratorType.TileCluster)
  //     const eventsCount = clusterConfig?.config?.duplicatedEventsWorkaround ? 2 : 1

  //     const clusterFeature = hoveredTooltipEvent.features.find(
  //       (f) => f.type === GeneratorType.TileCluster && parseInt(f.properties.count) > eventsCount
  //     )

  //     if (clusterFeature) {
  //       if (!tilesClusterLoaded) {
  //         return 'progress'
  //       }
  //       const { expansionZoom, lat, lng, lon } = clusterFeature.properties
  //       const longitude = lng || lon
  //       return expansionZoom && lat && longitude ? 'zoom-in' : 'grab'
  //     }
  //     const vesselFeatureEvents = hoveredTooltipEvent.features.filter(
  //       (f) => f.category === DataviewCategory.Vessels
  //     )
  //     if (vesselFeatureEvents.length > 1) {
  //       return 'grab'
  //     }
  //     return 'pointer'
  //   } else if (map?.isMoving()) {
  //     return 'grabbing'
  //   }
  //   return 'grab'
  // }, [
  //   isMapDrawing,
  //   isMarineManagerLocation,
  //   hoveredTooltipEvent,
  //   map,
  //   dataviews,
  //   tilesClusterLoaded,
  // ])

  // useEffect(() => {
  //   if (map) {
  //     map.showTileBoundaries = debugOptions.debug
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [map, debugOptions])

  // const styleInteractiveLayerIds = useMemoCompare(style?.metadata?.interactiveLayerIds)
  // const interactiveLayerIds = useMemo(() => {
  //   if (isMapInteractionDisabled) {
  //     return undefined
  //   }
  //   return styleInteractiveLayerIds
  // }, [isMapInteractionDisabled, styleInteractiveLayerIds])

  const onClick = useCallback((info: PickingInfo) => {
    const features = deckRef?.current?.pickMultipleObjects({
      x: info.x,
      y: info.y,
    })
    console.log('🚀 ~ values:', features?.flatMap((f) => f.object?.value || []).join(','))
  }, [])

  const onHover = useCallback((info: PickingInfo) => {
    const features = deckRef?.current?.pickMultipleObjects({
      x: info.x,
      y: info.y,
    })
    // console.log('🚀 ~ features:', features)
  }, [])

  const setDeckLayerLoadedState = useSetDeckLayerLoadedState()

  return (
    <div className={styles.container}>
      <DeckGL
        id="map"
        ref={deckRef}
        views={MAP_VIEW}
        layers={layers as LayersList}
        onAfterRender={() => {
          setDeckLayerLoadedState(layers)
        }}
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
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        onClick={onClick}
        onHover={onHover}
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
          fadeDuration={0}
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
          <MapAnnotations />
          <ErrorNotification />
          {isMapDrawing && <MapDraw />}
          {mapLegends && <MapLegends legends={mapLegends} portalled={portalledLegend} />}
        </Map>
      )} */}
      {/* TODO in deck.gl to get the mapLoading state */}
      <MapControls onMouseEnter={resetHoverState} mapLoading={false} />
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
