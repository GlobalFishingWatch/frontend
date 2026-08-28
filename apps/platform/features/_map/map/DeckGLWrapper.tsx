import { useCallback, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { FilterContext, MapView, ViewStateChangeParameters } from '@deck.gl/core'
import type { DeckGLRef } from '@deck.gl/react'
import DeckGL from '@deck.gl/react'
import { _StatsWidget as StatsWidget } from '@deck.gl/widgets'
import { useSetAtom } from 'jotai'

import { useSetDeckLayerLoadedState } from '@globalfishingwatch/deck-layer-composer'
import { PICK_ONLY_LAYER_ID_SUFFIX } from '@globalfishingwatch/deck-layers/config'

import { useDatasetDrag } from 'features/_map/map/drag-dataset.hooks'
import { mapSizeAtom } from 'features/_map/map/map.atoms'
import { MAP_CANVAS_ID } from 'features/_map/map/map.config'
import { setMapLoaded } from 'features/_map/map/map.slice'
import { useSetMapInstance } from 'features/_map/map/map-context.hooks'
import {
  useMapCursor,
  useMapDrag,
  useMapMouseClick,
  useMapMouseHover,
} from 'features/_map/map/map-interactions.hooks'
import { useMapLayers } from 'features/_map/map/map-layers.hooks'
import {
  MAP_VIEW,
  useMapSetViewState,
  useMapViewState,
  useMapViewStateUrlSync,
} from 'features/_map/map/map-viewport.hooks'
import MapAnnotations from 'features/_map/map/overlays/annotations/Annotations'
import TrackCorrectionsOverlay from 'features/_map/map/overlays/track-corrections/TrackCorrectionsOverlay'
import { selectReportCategory } from 'features/_reports/reports.selectors'
import { useReportFeaturesLoading } from 'features/_reports/reports-timeseries.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { DebugOption, selectDebugOptions, setDebugOption } from 'features/debug/debug.slice'
import { selectIsAnyReportLocation } from 'router/routes.selectors'

const DeckGLWrapper = () => {
  const deckRef = useRef<DeckGLRef<MapView>>(null)
  useSetMapInstance(deckRef)
  useMapViewStateUrlSync()
  // drag-and-drop dataset upload — only while the map is mounted
  useDatasetDrag()
  const setViewState = useMapSetViewState()
  const dispatch = useAppDispatch()
  const viewState = useMapViewState()
  const showDeckStats = useSelector(selectDebugOptions)?.deckStats
  const areReportFeaturesLoading = useReportFeaturesLoading()

  const onViewStateChange = useCallback(
    (params: ViewStateChangeParameters<any>) => {
      const { longitude, latitude, zoom } = params.viewState
      if (![longitude, latitude, zoom].every(Number.isFinite)) {
        return
      }
      if (params.interactionState.isZooming || !params.interactionState.inTransition) {
        // https://github.com/visgl/deck.gl/issues/7158#issuecomment-2305388963
        // add transitionDuration: 0 to avoid unresponsive zoom
        setViewState({ ...params.viewState, transitionDuration: 0 })
      } else {
        setViewState(params.viewState)
      }
    },
    [setViewState]
  )

  const setMapSize = useSetAtom(mapSizeAtom)
  const onMapResize = useCallback(
    ({ width, height }: { width: number; height: number }) => {
      setMapSize({ width, height })
    },
    [setMapSize]
  )

  const onMapClick = useMapMouseClick()
  const { onMouseMove } = useMapMouseHover()
  const getCursor = useMapCursor()
  const { onMapDrag, onMapDragStart, onMapDragEnd } = useMapDrag()
  const layers = useMapLayers()
  const reportCategory = useSelector(selectReportCategory)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)

  const onExpandedStatsChange = useCallback(
    (expanded: boolean) => {
      if (!expanded) {
        dispatch(setDebugOption({ option: DebugOption.DeckStats, value: false }))
      }
    },
    [dispatch]
  )

  const onMapLoad = useCallback(() => {
    dispatch(setMapLoaded(true))
  }, [dispatch])

  const isFourwingsReport =
    isAnyReportLocation &&
    (reportCategory === 'activity' ||
      reportCategory === 'detections' ||
      reportCategory === 'environment')
  const isWaitingForFourwingsTiles = useMemo(
    () => isFourwingsReport && areReportFeaturesLoading,
    [isFourwingsReport, areReportFeaturesLoading]
  )

  const mapStyles = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      position: 'relative',
      ...(isWaitingForFourwingsTiles && { pointerEvents: 'none' }),
    }),
    [isWaitingForFourwingsTiles]
  )

  const setDeckLayerLoadedState = useSetDeckLayerLoadedState()

  const onAfterRenderHandler = useCallback(() => {
    setDeckLayerLoadedState(layers)
  }, [layers, setDeckLayerLoadedState])

  const layerFilterHandler = useCallback(({ layer, isPicking, renderPass }: FilterContext) => {
    // This avoids performing the default picking
    // since we are handling it through pickMultipleObjects
    // discussion for reference https://github.com/visgl/deck.gl/discussions/5793
    if (renderPass === 'picking:hover') {
      // if (!loadedLayers.includes(layer.id) || renderPass === 'picking:hover') {
      return false
    }

    if (!isPicking && layer.id.endsWith(PICK_ONLY_LAYER_ID_SUFFIX)) {
      return false
    }
    return true
  }, [])

  return (
    <DeckGL
      id={MAP_CANVAS_ID}
      ref={deckRef}
      views={MAP_VIEW}
      deviceProps={{ debug: process.env.DEBUG_DECK_LUMA === 'true' }}
      layers={deckRef ? layers : []}
      onAfterRender={onAfterRenderHandler}
      style={mapStyles}
      getCursor={getCursor}
      layerFilter={layerFilterHandler}
      viewState={viewState}
      // Needs to lock the ui to avoid loading other tiles until report timeseries are loaded
      onViewStateChange={isWaitingForFourwingsTiles ? undefined : onViewStateChange}
      onClick={onMapClick}
      onHover={onMouseMove}
      onDragStart={onMapDragStart}
      onDrag={onMapDrag}
      onDragEnd={onMapDragEnd}
      onLoad={onMapLoad}
      onResize={onMapResize}
      widgets={
        showDeckStats
          ? [
              new StatsWidget({
                title: 'Map stats',
                initialExpanded: true,
                onExpandedChange: onExpandedStatsChange,
              }),
            ]
          : []
      }
    >
      <MapAnnotations />
      <TrackCorrectionsOverlay />
    </DeckGL>
  )
}

export default DeckGLWrapper
