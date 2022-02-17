import React, { useRef, useMemo, useCallback, useEffect } from 'react'
import { InteractiveMap, MapRequest } from 'react-map-gl'
import { useSelector } from 'react-redux'
import Point from '@mapbox/point-geometry';
import { GFWAPI } from '@globalfishingwatch/api-client'
import mapStyle from 'features/map/map-style'
import { useViewport } from './map-viewport.hooks'
import MapControls from './controls/MapControls'
import styles from './Map.module.css'
import { useMapBounds } from './controls/map-controls.hooks'
import { selectPortPositionLayer } from './map.selectors'
import useMapInstance from './map-context.hooks'
import { useSelectorConnect } from './map.hooks';

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

const mapOptions = {
  customAttribution: '© Copyright Global Fishing Watch 2020',
}

const Map = (): React.ReactElement => {
  const { viewport, onViewportChange } = useViewport()

  const mapRef = useRef<any>(null)
  const mapBounds = useMapBounds(mapRef ?? null)
  
  const pointsLayer = useSelector(selectPortPositionLayer)
  const style = useMemo(() => {
    return {
      ...mapStyle,
      sources: {
        ...mapStyle.sources,
        pointsLayer
      }
    }
  }, [pointsLayer])
  console.log(style)
  const { box, onMouseDown, onKeyDown, onKeyUp, onMouseMove, onMouseUp, onHover } = useSelectorConnect()
  return (
    <div className={styles.container}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}>
      <InteractiveMap
        width="100%"
        height="100%"
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        mapStyle={style}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onHover={onHover}
        onViewportChange={onViewportChange}
        transformRequest={transformRequest}
        onError={handleError}
        mapOptions={mapOptions}
      ></InteractiveMap>
      <MapControls bounds={mapBounds}></MapControls>
      {box && 
        <div 
        style={{
          width: box.width,
          height: box.height,
          transform: box.transform
        }}
        className={styles.mapSelection}></div>
      }
    </div>
  )
}

export default Map
