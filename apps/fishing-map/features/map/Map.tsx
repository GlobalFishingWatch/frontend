import { Fragment, useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { DeckGLRef } from '@deck.gl/react'
import { DeckGL } from '@deck.gl/react'
import dynamic from 'next/dynamic'
import type { MapCoordinates } from 'types'

// import { atom, useAtom } from 'jotai'
import type { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import {
  useIsDeckLayersLoading,
  useSetDeckLayerComposer,
  useSetDeckLayerLoadedState,
  useSetMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectHasDeprecatedDataviewInstances } from 'features/dataviews/selectors/dataviews.instances.selectors'
// import { useClickedEventConnect, useGeneratorsConnect } from 'features/map/map.hooks'
import MapControls from 'features/map/controls/MapControls'
import { useSetMapInstance } from 'features/map/map-context.hooks'
import {
  useMapCursor,
  useMapDrag,
  useMapMouseClick,
  useMapMouseHover,
} from 'features/map/map-interactions.hooks'
import { useMapLayers } from 'features/map/map-layers.hooks'
import ErrorNotificationDialog from 'features/map/overlays/error-notification/ErrorNotification'
import MapPopups from 'features/map/popups/MapPopups'
import { selectReportAreaStatus } from 'features/reports/areas/area-reports.selectors'
import { useHasReportTimeseries } from 'features/reports/shared/activity/reports-activity-timeseries.hooks'
import { selectVGRSection } from 'features/reports/vessel-groups/vessel-group.config.selectors'
import {
  selectIsAnyAreaReportLocation,
  selectIsAnyReportLocation,
  selectIsAnyVesselLocation,
  selectIsVesselGroupReportLocation,
  selectIsWorkspaceLocation,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import MapInfo from './controls/MapInfo'
import MapAnnotations from './overlays/annotations/Annotations'
import MapAnnotationsDialog from './overlays/annotations/AnnotationsDialog'
import { CoordinateEditOverlay } from './overlays/draw/CoordinateEditOverlay'
import { MAP_CANVAS_ID } from './map.config'
import { setMapLoaded } from './map.slice'
import { useMapDrawConnect } from './map-draw.hooks'
import {
  MAP_CONTAINER_ID,
  MAP_VIEW,
  useMapSetViewState,
  useMapViewState,
  useUpdateViewStateUrlParams,
} from './map-viewport.hooks'
import TimeComparisonLegend from './TimeComparisonLegend'

import styles from './Map.module.css'

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
  const dispatch = useAppDispatch()
  const viewState = useMapViewState()
  const setViewState = useMapSetViewState()
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

  const setMapHoverFeatures = useSetMapHoverInteraction()
  const onMouseLeave = useCallback(() => {
    setMapHoverFeatures({} as InteractionEvent)
  }, [setMapHoverFeatures])

  const setDeckLayers = useSetDeckLayerComposer()
  useEffect(() => {
    return () => {
      setDeckLayers([])
    }
  }, [setDeckLayers])

  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isVGRReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const vesselGroupSection = useSelector(selectVGRSection)
  const hasReportTimeseries = useHasReportTimeseries()
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const reportAreaStatus = useSelector(selectReportAreaStatus)
  const hasDeprecatedDataviewInstances = useSelector(selectHasDeprecatedDataviewInstances)

  const onMapLoad = useCallback(() => {
    dispatch(setMapLoaded(true))
  }, [dispatch])

  const mapLoading = useIsDeckLayersLoading()
  const isReportAreaLoading =
    isAreaReportLocation && reportAreaStatus === AsyncReducerStatus.Loading
  const isLoadingReport =
    (isAreaReportLocation || (isVGRReportLocation && vesselGroupSection === 'activity')) &&
    !hasReportTimeseries

  const setDeckLayerLoadedState = useSetDeckLayerLoadedState()

  return (
    <div
      id={MAP_CONTAINER_ID}
      className={styles.container}
      onMouseLeave={onMouseLeave}
      style={hasDeprecatedDataviewInstances ? { pointerEvents: 'none' } : {}}
    >
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
        // Needs to lock the ui to avoid loading other tiles until report timeseries are loaded
        onViewStateChange={isLoadingReport ? undefined : onViewStateChange}
        onClick={onMapClick}
        onHover={onMouseMove}
        onDragStart={onMapDragStart}
        onDrag={onMapDrag}
        onDragEnd={onMapDragEnd}
        onLoad={onMapLoad}
      >
        <MapAnnotations />
      </DeckGL>
      {isMapDrawing && (
        <Fragment>
          <CoordinateEditOverlay />
          <DrawDialog />
        </Fragment>
      )}
      <MapPopups />
      <ErrorNotificationDialog />
      <MapAnnotationsDialog />
      <MapControls mapLoading={mapLoading || isReportAreaLoading} />
      {isWorkspaceLocation && !isAnyReportLocation && (
        <Hint id="fishingEffortHeatmap" className={styles.helpHintLeft} />
      )}
      {isWorkspaceLocation && !isAnyReportLocation && (
        <Hint id="clickingOnAGridCellToShowVessels" className={styles.helpHintRight} />
      )}
      {(isWorkspaceLocation || isVesselLocation || isAnyReportLocation) && (
        <MapInfo center={hoveredCoordinates} />
      )}

      <TimeComparisonLegend />
    </div>
  )
}

export default MapWrapper
