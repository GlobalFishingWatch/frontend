import type { MapboxStyle } from 'react-map-gl';
import { Map } from 'react-map-gl'
import { useCallback, useState } from 'react'
import type { RequestParameters } from '@globalfishingwatch/maplibre-gl';
import maplibregl from '@globalfishingwatch/maplibre-gl'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { useDebounce, useMemoCompare } from '@globalfishingwatch/react-hooks'
import { useMapHover, useMapLegend } from '@globalfishingwatch/layer-composer'
import MapControls from 'features/map/MapControls'
import MapInfo from 'features/map/MapInfo'
import { useMapLayers } from 'features/map/map-layers.hooks'
import { useMapLoaded } from 'features/map/map-state.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import {
  useAllMapSourceTilesLoaded,
  useMapSourceTilesLoadedAtom,
} from 'features/map/map-sources.hooks'
import { useDynamicBreaksUpdate } from 'features/map/dynamic-breaks.hooks'
import MapPopup from 'features/map/popups/PopupWrapper'
import MapLegends from 'features/map/MapLegends'
import { useGeoTemporalLayers } from 'features/layers/layers.hooks'
import styles from './Map.module.css'
import { useURLViewport, useViewport } from './map-viewport.hooks'

const transformRequest: (...args: any[]) => RequestParameters = (
  url: string,
  resourceType: string
) => {
  const response: RequestParameters = { url }
  if (resourceType === 'Tile' && url.includes('globalfishingwatch')) {
    response.headers = {
      Authorization: 'Bearer ' + GFWAPI.getToken(),
    }
  }
  return response
}

const handleError = async ({ error }: any) => {
  if (error?.status === 401 && error?.url.includes('globalfishingwatch')) {
    try {
      await GFWAPI.refreshAPIToken()
    } catch (e) {
      console.warn(e)
    }
  }
}

const style = {
  width: '100%',
  height: '100%',
}

const MapWrapper = (): React.ReactElement<any> => {
  useURLViewport()
  useMapSourceTilesLoadedAtom()
  useDynamicBreaksUpdate()
  const layers = useGeoTemporalLayers()
  const { viewport, onViewportChange } = useViewport()
  const { style: mapStyle, loading: layerComposerLoading } = useMapLayers()
  const mapLoaded = useMapLoaded()
  const map = useMapInstance()
  const allSourcesLoaded = useAllMapSourceTilesLoaded()
  const mapLoading = !mapLoaded || layerComposerLoading || !allSourcesLoaded
  const debouncedMapLoading = useDebounce(mapLoading, 300)
  const [hoveredEvent, setHoveredEvent] = useState<any>()
  const onMapHover: any = useMapHover(setHoveredEvent, undefined, map, mapStyle?.metadata)
  const onMouseOut = useCallback(() => setHoveredEvent(undefined), [])
  const interactiveLayerIds = useMemoCompare(mapStyle?.metadata?.interactiveLayerIds)
  const mapLegends = useMapLegend(mapStyle, layers as any, hoveredEvent)

  return (
    <div className={styles.container}>
      <MapControls mapLoading={debouncedMapLoading} />
      {mapStyle && (
        <Map
          id="map"
          style={style}
          mapLib={maplibregl as any}
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          zoom={viewport.zoom}
          mapStyle={mapStyle as MapboxStyle}
          onMove={onViewportChange}
          onMouseMove={onMapHover}
          onMouseOut={onMouseOut}
          interactiveLayerIds={interactiveLayerIds}
          transformRequest={transformRequest}
          onError={handleError}
        >
          {hoveredEvent && <MapPopup event={hoveredEvent} />}
          {mapLegends && <MapLegends legends={mapLegends} />}
          <MapInfo center={hoveredEvent} />
        </Map>
      )}
    </div>
  )
}

export default MapWrapper
