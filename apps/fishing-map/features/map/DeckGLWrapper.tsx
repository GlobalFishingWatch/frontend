import { useCallback, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { FilterContext } from '@deck.gl/core'
import type { DeckGLRef } from '@deck.gl/react'
import DeckGL from '@deck.gl/react'
import type { MapCoordinates } from 'types'

import { useSetDeckLayerLoadedState } from '@globalfishingwatch/deck-layer-composer'

import { useAppDispatch } from 'features/app/app.hooks'
import { MAP_CANVAS_ID } from 'features/map/map.config'
import { setMapLoaded } from 'features/map/map.slice'
import { useSetMapInstance } from 'features/map/map-context.hooks'
import {
  useMapCursor,
  useMapDrag,
  useMapMouseClick,
  useMapMouseHover,
} from 'features/map/map-interactions.hooks'
import { useMapLayers } from 'features/map/map-layers.hooks'
import { MAP_VIEW, useMapSetViewState, useMapViewState } from 'features/map/map-viewport.hooks'
import MapAnnotations from 'features/map/overlays/annotations/Annotations'
import { useHasReportTimeseries } from 'features/reports/shared/activity/reports-activity-timeseries.hooks'
import { selectVGRSection } from 'features/reports/vessel-groups/vessel-group.config.selectors'
import {
  selectIsAnyAreaReportLocation,
  selectIsVesselGroupReportLocation,
} from 'routes/routes.selectors'

const mapStyles = {
  width: '100%',
  height: '100%',
  position: 'relative',
}

const DeckGLWrapper = () => {
  const deckRef = useRef<DeckGLRef>(null)
  useSetMapInstance(deckRef)
  const setViewState = useMapSetViewState()
  const dispatch = useAppDispatch()
  const viewState = useMapViewState()
  const hasReportTimeseries = useHasReportTimeseries()
  const onViewStateChange = useCallback(
    (params: any) => {
      // add transitionDuration: 0 to avoid unresponsive zoom
      // https://github.com/visgl/deck.gl/issues/7158#issuecomment-1329722960
      setViewState({ ...(params.viewState as MapCoordinates), transitionDuration: 0 })
    },
    [setViewState]
  )
  const onMapClick = useMapMouseClick()
  const { onMouseMove } = useMapMouseHover()
  const getCursor = useMapCursor()
  const { onMapDrag, onMapDragStart, onMapDragEnd } = useMapDrag()
  const layers = useMapLayers()
  const isVGRReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const vesselGroupSection = useSelector(selectVGRSection)

  const onMapLoad = useCallback(() => {
    dispatch(setMapLoaded(true))
  }, [dispatch])

  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)

  const isLoadingReport = useMemo(
    () =>
      (isAreaReportLocation || (isVGRReportLocation && vesselGroupSection === 'activity')) &&
      !hasReportTimeseries,
    [hasReportTimeseries, isAreaReportLocation, isVGRReportLocation, vesselGroupSection]
  )

  const setDeckLayerLoadedState = useSetDeckLayerLoadedState()
  const onAfterRenderHandler = useCallback(() => {
    setDeckLayerLoadedState(layers)
  }, [layers, setDeckLayerLoadedState])
  const layerFilterHandler = useCallback(({ renderPass }: FilterContext) => {
    // This avoids performing the default picking
    // since we are handling it through pickMultipleObjects
    // discussion for reference https://github.com/visgl/deck.gl/discussions/5793
    if (renderPass === 'picking:hover') {
      // if (!loadedLayers.includes(layer.id) || renderPass === 'picking:hover') {
      return false
    }
    return true
  }, [])

  return (
    <DeckGL
      id={MAP_CANVAS_ID}
      ref={deckRef}
      views={MAP_VIEW}
      layers={deckRef ? layers : []}
      onAfterRender={onAfterRenderHandler}
      style={mapStyles}
      getCursor={getCursor}
      layerFilter={layerFilterHandler}
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
  )
}

export default DeckGLWrapper
