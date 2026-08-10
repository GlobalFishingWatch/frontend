import React, { useMemo } from 'react'
import type { StyleSpecification } from 'react-map-gl/maplibre'
import { Map } from 'react-map-gl/maplibre'
import { useSelector } from 'react-redux'
import type { RequestParameters } from 'maplibre-gl'
import maplibregl from 'maplibre-gl'

import { GFWAPI } from '@globalfishingwatch/api-client'

import mapStyle from 'features/map/map-style'

import { useMapBounds } from './controls/map-controls.hooks'
import MapControls from './controls/MapControls'
import { useSelectorConnect } from './map.hooks'
import { selectAreaLayer, selectPortPositionLayer } from './map.selectors'
import { useViewport } from './map-viewport.hooks'

import styles from './Map.module.css'

const mapStyles = {
  width: '100%',
  height: '100%',
}

const transformRequest: (...args: any[]) => RequestParameters = (
  url: string,
  resourceType: string
) => {
  const response: RequestParameters = { url }
  if (resourceType === 'Tile' && url.includes('globalfishingwatch')) {
    response.headers = {
      Authorization: 'Bearer ' + GFWAPI.token,
    }
  }
  return response
}

const handleError = ({ error }: any) => {
  if (error?.status === 401 && error?.url.includes('globalfishingwatch')) {
    GFWAPI.refreshAPIToken()
  }
}

const MapWrapper = (): React.ReactElement<any> => {
  const { viewport, onViewportChange } = useViewport()

  const mapBounds = useMapBounds()
  const pointsLayer = useSelector(selectPortPositionLayer)
  const areaLayer = useSelector(selectAreaLayer)
  const style = useMemo(() => {
    return {
      ...mapStyle,
      sources: {
        ...mapStyle.sources,
        areaLayer,
        pointsLayer,
      },
    }
  }, [areaLayer, pointsLayer])
  const {
    boxTransform,
    boxHeight,
    boxWidth,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onHover,
    onMapclick,
  } = useSelectorConnect()

  return (
    <div className={styles.container}>
      <Map
        id="map"
        style={mapStyles}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        mapLib={maplibregl as any}
        mapStyle={style as unknown as StyleSpecification}
        onMouseDown={onMouseDown as any}
        onMouseMove={onMouseMove as any}
        onMouseUp={onMouseUp as any}
        boxZoom={false}
        onMouseEnter={onHover as any}
        onClick={onMapclick as any}
        onMove={onViewportChange}
        transformRequest={transformRequest}
        onError={handleError}
        attributionControl={{ customAttribution: '© Copyright Global Fishing Watch 2020' }}
      ></Map>
      <MapControls bounds={mapBounds}></MapControls>

      <div
        style={{
          width: boxWidth,
          height: boxHeight,
          transform: boxTransform,
        }}
        className={styles.mapSelection}
      ></div>
    </div>
  )
}

export default MapWrapper
