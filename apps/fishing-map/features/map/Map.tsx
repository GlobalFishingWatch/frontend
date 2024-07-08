import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { DeckGL, DeckGLRef } from '@deck.gl/react'
import dynamic from 'next/dynamic'
// import { atom, useAtom } from 'jotai'
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
import ErrorNotificationDialog from 'features/map/overlays/error-notification/ErrorNotification'
import { useMapLayers } from 'features/map/map-layers.hooks'
import MapPopups from 'features/map/popups/MapPopups'
import { MapCoordinates } from 'types'
import { MAP_VIEW, useViewStateAtom, useUpdateViewStateUrlParams } from './map-viewport.hooks'
import styles from './Map.module.css'
import MapAnnotations from './overlays/annotations/Annotations'
import MapAnnotationsDialog from './overlays/annotations/AnnotationsDialog'
import { useMapDrawConnect } from './map-draw.hooks'
import MapInfo from './controls/MapInfo'
import { MAP_CANVAS_ID } from './map.config'
import TimeComparisonLegend from './TimeComparisonLegend'
import { CoordinateEditOverlay } from './overlays/draw/CoordinateEditOverlay'

const DrawDialog = dynamic(
  () => import(/* webpackChunkName: "DrawDialog" */ './overlays/draw/DrawDialog')
)
const Hint = dynamic(() => import(/* webpackChunkName: "Hint" */ 'features/help/Hint'))

const mapStyles = {
  width: '100%',
  height: '100%',
  position: 'relative',
}

const MapWrapper = () => {
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
  const onMapClick = useMapMouseClick()
  const { onMouseMove, hoveredCoordinates } = useMapMouseHover()
  const getCursor = useMapCursor()
  const { onMapDrag, onMapDragStart, onMapDragEnd } = useMapDrag()
  const { isMapDrawing } = useMapDrawConnect()
  const layers = useMapLayers()

  const setDeckLayers = useSetDeckLayerComposer()
  useEffect(() => {
    return () => {
      setDeckLayers([])
    }
  }, [setDeckLayers])

  const reportLocation = useSelector(selectIsAnyReportLocation)
  const isWorkspace = useSelector(selectIsWorkspaceLocation)

  const resetHoverState = useCallback(() => {
    // TODO in deck.gl
    // setHoveredEvent(null)
    // setHoveredDebouncedEvent(null)
    // cleanFeatureState('hover')
  }, [])
  const mapLoading = useIsDeckLayersLoading()

  const setDeckLayerLoadedState = useSetDeckLayerLoadedState()

  return (
    <div className={styles.container}>
      <DeckGL
        id={MAP_CANVAS_ID}
        ref={deckRef}
        views={MAP_VIEW}
        layers={deckRef ? layers : []}
        onAfterRender={() => {
          setDeckLayerLoadedState(layers)
        }}
        style={mapStyles}
        getCursor={getCursor}
        layerFilter={({ renderPass }) => {
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
      </DeckGL>
      {isMapDrawing && <DrawDialog />}
      <MapPopups />
      <ErrorNotificationDialog />
      <MapAnnotationsDialog />
      <CoordinateEditOverlay />
      {/* TODO in deck.gl to get the mapLoading state */}
      <MapControls onMouseEnter={resetHoverState} mapLoading={mapLoading} />
      {isWorkspace && !reportLocation && (
        <Hint id="fishingEffortHeatmap" className={styles.helpHintLeft} />
      )}
      {isWorkspace && !reportLocation && (
        <Hint id="clickingOnAGridCellToShowVessels" className={styles.helpHintRight} />
      )}
      {isWorkspace && (
        <MapInfo
          center={hoveredCoordinates && { x: hoveredCoordinates[0], y: hoveredCoordinates[1] }}
        />
      )}

      <TimeComparisonLegend />
    </div>
  )
}

export default MapWrapper
