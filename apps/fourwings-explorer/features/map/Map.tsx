import { Map, MapboxStyle } from 'react-map-gl'
import type { RequestParameters } from '@globalfishingwatch/maplibre-gl'
import { GFWAPI } from '@globalfishingwatch/api-client'
import mapStyle from 'features/map/map-style'
import { useViewport } from './map-viewport.hooks'
import styles from './Map.module.css'

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

const mapStyles = {
  width: '100%',
  height: '100%',
}

const MapWrapper = (): React.ReactElement => {
  const { viewport, onViewportChange } = useViewport()

  return (
    <div className={styles.container}>
      <Map
        style={mapStyles}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        mapStyle={mapStyle as MapboxStyle}
        onMove={onViewportChange}
        transformRequest={transformRequest}
        onError={handleError}
      ></Map>
    </div>
  )
}

export default MapWrapper
