import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Map, MapboxStyle } from 'react-map-gl'
import dynamic from 'next/dynamic'
import { useSetRecoilState } from 'recoil'
import { useAtom } from 'jotai'
import maplibregl from '@globalfishingwatch/maplibre-gl'
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
import useMapInstance from 'features/map/map-context.hooks'
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
import useViewport, { useMapBounds } from './map-viewport.hooks'
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
}

const MapWrapper = () => {
  // Used it only once here to attach the listener only once
  useSetMapIdleAtom()
  useMapSourceTilesLoadedAtom()
  useEnvironmentalBreaksUpdate()
  useMapRulersDrag()
  useMapAnnotationDrag()
  const map = useMapInstance()
  const { isMapDrawing } = useMapDrawConnect()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  const setMapReady = useSetRecoilState(mapReadyAtom)
  const [hasTimeseries] = useAtom(hasMapTimeseriesAtom)
  const dataviews = useSelector(selectCurrentDataviewInstancesResolved)
  const isMapInteractionDisabled = useSelector(selectIsMapDrawing)

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
  const { cleanFeatureState } = useFeatureState(map)

  const onLoadCallback = useCallback(() => {
    setMapReady(true)
  }, [setMapReady])

  const closePopup = useCallback(() => {
    cleanFeatureState('click')
    dispatchClickedEvent(null)
    cancelPendingInteractionRequests()
  }, [cancelPendingInteractionRequests, cleanFeatureState, dispatchClickedEvent])

  const { onMouseMove, resetHoverState, hoveredEvent, hoveredTooltipEvent, hoveredDebouncedEvent } =
    useMapMouseHover(style)
  const { onMapClick, clickedTooltipEvent } = useMapMouseClick(style)

  const { viewport, onViewportChange } = useViewport()

  const { setMapBounds } = useMapBounds()
  const cursor = useMapCursor(hoveredTooltipEvent)

  useEffect(() => {
    setMapBounds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport])

  const showTimeComparison = useSelector(selectShowTimeComparison)
  const reportLocation = useSelector(selectIsAnyReportLocation)
  const isWorkspace = useSelector(selectIsWorkspaceLocation)
  const debugOptions = useSelector(selectDebugOptions)

  const mapLegends = useMapLegend(style, dataviews, hoveredEvent)
  const portalledLegend = !showTimeComparison

  const mapLoaded = useMapLoaded()

  useEffect(() => {
    if (map) {
      map.showTileBoundaries = debugOptions.debug
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, debugOptions])

  const mapLoading = !mapLoaded || layerComposerLoading || !allSourcesLoaded
  const debouncedMapLoading = useDebounce(mapLoading, 300)

  const styleInteractiveLayerIds = useMemoCompare(style?.metadata?.interactiveLayerIds)
  const interactiveLayerIds = useMemo(() => {
    if (isMapInteractionDisabled) {
      return undefined
    }
    return styleInteractiveLayerIds
  }, [isMapInteractionDisabled, styleInteractiveLayerIds])

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
          bearing={0}
          fadeDuration={0}
          onMove={reportLocation && !hasTimeseries ? undefined : onViewportChange}
          mapStyle={style as MapboxStyle}
          transformRequest={transformRequest}
          onResize={setMapBounds}
          cursor={cursor}
          interactiveLayerIds={interactiveLayerIds}
          onClick={onMapClick}
          onMouseEnter={onMouseMove}
          onMouseMove={onMouseMove}
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
          <MapAnnotations />
          <ErrorNotification />
          {isMapDrawing && <MapDraw />}
          {mapLegends && <MapLegends legends={mapLegends} portalled={portalledLegend} />}
        </Map>
      )}
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
