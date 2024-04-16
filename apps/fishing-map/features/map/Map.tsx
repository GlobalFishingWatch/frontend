import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { DeckGL, DeckGLRef } from '@deck.gl/react'
import { LayersList } from '@deck.gl/core'
import dynamic from 'next/dynamic'
// import { atom, useAtom } from 'jotai'
import { RulersLayer, DrawLayer } from '@globalfishingwatch/deck-layers'
import {
  useIsDeckLayersLoading,
  useSetDeckLayerComposer,
  useSetDeckLayerLoadedState,
} from '@globalfishingwatch/deck-layer-composer'
import { useSetMapInstance } from 'features/map/map-context.hooks'
// import { useClickedEventConnect, useGeneratorsConnect } from 'features/map/map.hooks'
import MapControls from 'features/map/controls/MapControls'
import { selectIsAnyReportLocation, selectIsWorkspaceLocation } from 'routes/routes.selectors'
import {
  useMapCursor,
  useMapDrag,
  useMapMouseClick,
  useMapMouseHover,
} from 'features/map/map-interactions.hooks'
import { useMapRulersDrag } from 'features/map/overlays/rulers/rulers-drag.hooks'
import ErrorNotification from 'features/map/overlays/error-notification/ErrorNotification'
import { useMapDeckLayers } from 'features/map/map-layers.hooks'
import MapPopups from 'features/map/popups/MapPopups'
import { MapCoordinates } from 'types'
import {
  MAP_VIEW,
  useViewStateAtom,
  useUpdateViewStateUrlParams,
  useDisablePositionsOnZoomChanges,
} from './map-viewport.hooks'
import styles from './Map.module.css'
import MapAnnotations from './overlays/annotations/Annotations'
import MapAnnotationsDialog from './overlays/annotations/AnnotationsDialog'
import useRulers from './overlays/rulers/rulers.hooks'
import { useDrawLayer } from './overlays/draw/draw.hooks'
import { useMapDrawConnect } from './map-draw.hooks'
import MapInfo from './controls/MapInfo'

// This avoids type checking to complain
// https://github.com/visgl/deck.gl/issues/7304#issuecomment-1277850750
const RulersLayerComponent = RulersLayer as any
const DrawLayerComponent = DrawLayer as any
const DrawDialog = dynamic(
  () => import(/* webpackChunkName: "DrawDialog" */ './overlays/draw/DrawDialog')
)
const PopupWrapper = dynamic(
  () => import(/* webpackChunkName: "PopupWrapper" */ './popups/PopupWrapper')
)
const Hint = dynamic(() => import(/* webpackChunkName: "Hint" */ 'features/help/Hint'))

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
  const { viewState, setViewState } = useViewStateAtom()
  const onViewStateChange = useCallback(
    (params: any) => {
      // add transitionDuration: 0 to avoid unresponsive zoom
      // https://github.com/visgl/deck.gl/issues/7158#issuecomment-1329722960
      setViewState({ ...(params.viewState as MapCoordinates), transitionDuration: 0 })
    },
    [setViewState]
  )
  useUpdateViewStateUrlParams()
  useDisablePositionsOnZoomChanges()
  const onMapClick = useMapMouseClick()
  const { onMouseMove } = useMapMouseHover()
  const { getCursor } = useMapCursor()
  const { onMapDrag, onMapDragStart, onMapDragEnd } = useMapDrag()
  ////////////////////////////////////////
  // Used it only once here to attach the listener only once
  useMapRulersDrag()
  const { rulers, editingRuler, rulersVisible } = useRulers()
  const { isMapDrawing } = useMapDrawConnect()
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
  const setDeckLayers = useSetDeckLayerComposer()
  useEffect(() => {
    return () => {
      setDeckLayers([])
    }
  }, [setDeckLayers])

  // const { clickedEvent, dispatchClickedEvent, cancelPendingInteractionRequests } =
  //   useClickedEventConnect()

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
  const mapLoading = useIsDeckLayersLoading()

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

  const setDeckLayerLoadedState = useSetDeckLayerLoadedState()
  const { onDrawEdit, onDrawClick, drawLayerMode, drawFeaturesIndexes, drawFeatures } =
    useDrawLayer()

  const currentRuler = editingRuler ? [editingRuler] : []

  return (
    <div className={styles.container}>
      <DeckGL
        id="map"
        ref={deckRef}
        views={MAP_VIEW}
        layers={deckRef ? (layers as LayersList) : []}
        onAfterRender={() => {
          setDeckLayerLoadedState(layers)
        }}
        style={mapStyles}
        getCursor={getCursor}
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
        onClick={onMapClick}
        onHover={onMouseMove}
        onDragStart={onMapDragStart}
        onDrag={onMapDrag}
        onDragEnd={onMapDragEnd}
      >
        <MapAnnotations />
        <MapAnnotationsDialog />
        <ErrorNotification />
        {(editingRuler || rulers) && (
          <RulersLayerComponent
            rulers={[...(rulers || []), ...currentRuler]}
            visible={rulersVisible}
          />
        )}
        {isMapDrawing && (
          <DrawLayerComponent
            data={drawFeatures}
            onEdit={onDrawEdit}
            onClick={onDrawClick}
            selectedFeatureIndexes={drawFeaturesIndexes}
            mode={drawLayerMode}
          />
        )}
      </DeckGL>
      {isMapDrawing && <DrawDialog />}
      <MapPopups />
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
      <MapControls onMouseEnter={resetHoverState} mapLoading={mapLoading} />
      {isWorkspace && !reportLocation && (
        <Hint id="fishingEffortHeatmap" className={styles.helpHintLeft} />
      )}
      {isWorkspace && !reportLocation && (
        <Hint id="clickingOnAGridCellToShowVessels" className={styles.helpHintRight} />
      )}
      {/* TODO:deck pass hovered cursor coordinates */}
      <MapInfo center={null} />
    </div>
  )
}

export default MapWrapper
