import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { InteractiveMap, MapRequest } from '@globalfishingwatch/react-map-gl'
import GFWAPI from '@globalfishingwatch/api-client/dist/api-client'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import useViewport from 'features/map/map-viewport.hooks'
import MapControls from 'features/map/controls/MapControls'
import { useLocationConnect } from 'routes/routes.hook'
import { WORKSPACE } from 'routes/routes'
import { selectLocationCategory } from 'routes/routes.selectors'
import { selectMapWorkspacesListGenerators } from './map-workspaces-list.selectors'
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

const MapWorkspacesList = (): React.ReactElement | null => {
  const generatorsConfig = useSelector(selectMapWorkspacesListGenerators)
  const locationCategory = useSelector(selectLocationCategory)
  const { style } = useLayerComposer(generatorsConfig)
  const { dispatchLocation } = useLocationConnect()

  const { viewport, onViewportChange } = useViewport()

  const onClick = useCallback(
    (e: any) => {
      const workspace = e.features.find((feature: any) => feature.properties.type === 'workspace')
      if (workspace) {
        dispatchLocation(
          WORKSPACE,
          {
            category: locationCategory,
            workspaceId: workspace.properties.id,
          },
          true
        )
      }
    },
    [dispatchLocation, locationCategory]
  )

  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          disableTokenWarning={true}
          width="100%"
          height="100%"
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          zoom={viewport.zoom}
          onViewportChange={onViewportChange}
          mapStyle={style}
          mapOptions={mapOptions}
          transformRequest={transformRequest}
          onClick={onClick}
          onError={handleError}
          interactiveLayerIds={style?.metadata?.interactiveLayerIds}
          transitionDuration={viewport.transitionDuration}
        ></InteractiveMap>
      )}
      <MapControls />
    </div>
  )
}

export default MapWorkspacesList
