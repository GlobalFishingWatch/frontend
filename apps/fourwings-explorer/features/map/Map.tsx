import { Map, MapboxStyle } from 'react-map-gl'
import type { RequestParameters } from '@globalfishingwatch/maplibre-gl'
import { GFWAPI } from '@globalfishingwatch/api-client'
import maplibregl from '@globalfishingwatch/maplibre-gl'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import MapControls from 'features/map/MapControls'
import MapInfo from 'features/map/MapInfo'
import { useMapLayers } from 'features/map/map-layers.hooks'
import { useMapLoaded } from 'features/map/map-state.hooks'
import {
  useAllMapSourceTilesLoaded,
  useMapSourceTilesLoadedAtom,
} from 'features/map/map-sources.hooks'
import { useDynamicBreaksUpdate } from 'features/map/dynamic-breaks.hooks'
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

const MapWrapper = (): React.ReactElement => {
  useURLViewport()
  useMapSourceTilesLoadedAtom()
  useDynamicBreaksUpdate()
  const { viewport, onViewportChange } = useViewport()
  const { style: mapStyle, loading: layerComposerLoading } = useMapLayers()
  const mapLoaded = useMapLoaded()
  const allSourcesLoaded = useAllMapSourceTilesLoaded()
  const mapLoading = !mapLoaded || layerComposerLoading || !allSourcesLoaded
  const debouncedMapLoading = useDebounce(mapLoading, 300)

  return (
    <div className={styles.container}>
      <MapControls mapLoading={debouncedMapLoading} />
      <Map
        id="map"
        style={style}
        mapLib={maplibregl}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        mapStyle={mapStyle as MapboxStyle}
        onMove={onViewportChange}
        transformRequest={transformRequest}
        onError={handleError}
      >
        {/* <MapInfo center={hoveredEvent} /> */}
        <MapInfo />
      </Map>
    </div>
  )
}

export default MapWrapper
