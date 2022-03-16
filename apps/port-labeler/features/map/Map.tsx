import React, { useMemo } from 'react'
import { InteractiveMap, MapRequest } from 'react-map-gl'
import { useSelector } from 'react-redux'
import { GFWAPI } from '@globalfishingwatch/api-client'
import mapStyle from 'features/map/map-style'
import { selectCountry } from 'features/labeler/labeler.slice';
import { selectPortPointsByCountry } from 'features/labeler/labeler.selectors'
import { useViewport } from './map-viewport.hooks'
import MapControls from './controls/MapControls'
import styles from './Map.module.css'
import { useMapBounds } from './controls/map-controls.hooks'
import { selectAreaLayer, selectPortPositionLayer } from './map.selectors'
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
      }
    }
  }, [areaLayer, pointsLayer])
  const { box, onMouseDown, onKeyDown, onKeyUp, onMouseMove, onMouseUp, onHover, onMapclick } = useSelectorConnect()

  const points = useSelector(selectPortPointsByCountry)

  /*useEffect(() => {
    if (points.length) {
      onViewportChange({
        latitude: parseFloat((points[0].lat.toString())),
        longitude: parseFloat((points[0].lon.toString())),
        zoom: 12
      })
    }
  }, [onViewportChange, country])*/

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
        onClick={onMapclick}
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
