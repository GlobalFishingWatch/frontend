import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { DeckGL, DeckGLRef } from '@deck.gl/react'
import { LayersList } from '@deck.gl/core'
import dynamic from 'next/dynamic'
// import { atom, useAtom } from 'jotai'
import { RulersLayer } from '@globalfishingwatch/deck-layers'
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
import { useMapDeckLayers, useMapOverlayLayers } from 'features/map/map-layers.hooks'
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
import { useMapDrawConnect } from './map-draw.hooks'
import MapInfo from './controls/MapInfo'
import { MAP_CANVAS_ID } from './map.config'

// This avoids type checking to complain
// https://github.com/visgl/deck.gl/issues/7304#issuecomment-1277850750
const RulersLayerComponent = RulersLayer as any
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
  const layers = useMapDeckLayers()
  const overlays = useMapOverlayLayers()

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

  const currentRuler = editingRuler ? [editingRuler] : []

  return (
    <div className={styles.container}>
      <DeckGL
        id={MAP_CANVAS_ID}
        ref={deckRef}
        views={MAP_VIEW}
        layers={deckRef ? ([...layers, ...overlays] as LayersList) : []}
        onAfterRender={() => {
          setDeckLayerLoadedState(layers)
        }}
        style={mapStyles}
        getCursor={getCursor}
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
        {isMapDrawing && <DrawDialog />}
      </DeckGL>
      <MapPopups />
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
