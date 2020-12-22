import React from 'react'
import { InteractiveMap, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client/dist/api-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import { useMapboxRef } from 'features/map/map.context'
import useViewport from 'features/map/map-viewport.hooks'
import MapControls from 'features/map/controls/MapControls'
import styles from './MapWorkspacesList.module.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const mapOptions = {
  customAttribution: 'Global Fishing Watch 2020',
}

// TODO: Abstract this away
const transformRequest: (...args: any[]) => MapRequest = (url: string, resourceType: string) => {
  const response: MapRequest = { url }
  if (resourceType === 'Tile' && url.includes('globalfishingwatch')) {
    response.headers = {
      Authorization: 'Bearer ' + GFWAPI.getToken(),
    }
  }
  return response
}

const handleError = ({ error }: any) => {
  if (error?.status === 401 && error?.url.includes('globalfishingwatch')) {
    GFWAPI.refreshAPIToken()
  }
}
const basemap: Generators.BasemapGeneratorConfig = {
  id: 'landmass',
  type: Generators.Type.Basemap,
  basemap: Generators.BasemapType.Default,
}

const generatorsConfig = [basemap]

const MapWorkspacesList = (): React.ReactElement | null => {
  const mapRef = useMapboxRef()
  const { style } = useLayerComposer(generatorsConfig)

  const { viewport, onViewportChange } = useViewport()

  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          disableTokenWarning={true}
          ref={mapRef}
          width="100%"
          height="100%"
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          zoom={viewport.zoom}
          onViewportChange={onViewportChange}
          mapStyle={style}
          mapOptions={mapOptions}
          transformRequest={transformRequest}
          // onClick={onMapClick}
          onError={handleError}
          transitionDuration={viewport.transitionDuration}
        ></InteractiveMap>
      )}
      <MapControls />
    </div>
  )
}

export default MapWorkspacesList
