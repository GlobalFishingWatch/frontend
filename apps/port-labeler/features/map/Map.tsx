import React, { useMemo } from 'react'
import { Map, MapboxStyle } from 'react-map-gl'
import { useSelector } from 'react-redux'
import { GFWAPI } from '@globalfishingwatch/api-client'
import maplibregl, { RequestParameters } from '@globalfishingwatch/maplibre-gl'
import mapStyle from 'features/map/map-style'
import { selectCountry } from 'features/labeler/labeler.slice'
import { selectPortPointsByCountry } from 'features/labeler/labeler.selectors'
import { useViewport } from './map-viewport.hooks'
import MapControls from './controls/MapControls'
import styles from './Map.module.css'
import { useMapBounds } from './controls/map-controls.hooks'
import { selectAreaLayer, selectPortPositionLayer } from './map.selectors'
import { useSelectorConnect } from './map.hooks'

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

const MapWrapper = (): React.ReactElement => {
  const { viewport, onViewportChange } = useViewport()
  const country = useSelector(selectCountry)

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
    box,
    dragging,
    onMouseDown,
    onKeyDown,
    onKeyUp,
    onMouseMove,
    onMouseUp,
    onHover,
    onMapclick,
  } = useSelectorConnect()

  const points = useSelector(selectPortPointsByCountry)

  return (
    <div className={styles.container} onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
      <Map
        id="map"
        style={mapStyles}
        latitude={viewport.latitude}
        longitude={viewport.longitude}
        zoom={viewport.zoom}
        mapLib={maplibregl}
        mapStyle={style as unknown as MapboxStyle}
        onMouseDown={dragging ? (onMouseDown as any) : undefined}
        onMouseMove={dragging ? (onMouseMove as any) : undefined}
        onMouseUp={dragging ? (onMouseUp as any) : undefined}
        onClick={onMapclick as any}
        onMove={onViewportChange}
        transformRequest={transformRequest}
        onError={handleError}
        customAttribution={'© Copyright Global Fishing Watch 2020'}
      ></Map>
      <MapControls bounds={mapBounds}></MapControls>
      {box && (
        <div
          style={{
            width: box.width,
            height: box.height,
            transform: box.transform,
          }}
          className={styles.mapSelection}
        ></div>
      )}
    </div>
  )
}

export default MapWrapper
