import React from 'react'
import { InteractiveMap, MapRequest } from 'react-map-gl'
import { GFWAPI } from '@globalfishingwatch/api-client'
import mapStyle from 'features/map/map-style'
import { useViewport } from './map-viewport.hooks'
import styles from './Map.module.css'

const transformRequest: (...args: any[]) => MapRequest = (url: string, resourceType: string) => {
  const response: MapRequest = { url }
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

const mapOptions = {
  customAttribution: '© Copyright Global Fishing Watch 2020',
}

const Map = (): React.ReactElement => {
  const { viewport, onViewportChange } = useViewport()

  return (
    <div className={styles.container}>
      <InteractiveMap
        width="100%"
        height="100%"
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        mapStyle={mapStyle}
        onViewportChange={onViewportChange}
        transformRequest={transformRequest}
        onError={handleError}
        mapOptions={mapOptions}
      ></InteractiveMap>
    </div>
  )
}

export default Map
