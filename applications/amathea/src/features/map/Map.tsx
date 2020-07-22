import React, { useRef, useEffect } from 'react'
import { fitBounds } from 'viewport-mercator-project'
import ReactMapGL from 'react-map-gl'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import { useAOIConnect } from 'features/areas-of-interest/areas-of-interest.hook'
import { useGeneratorsConnect, useViewport } from './map.hooks'
import styles from './Map.module.css'

import 'mapbox-gl/dist/mapbox-gl.css'

const Map = (): React.ReactElement => {
  const mapRef = useRef<any>(null)
  const { viewport, onViewportChange, setMapCoordinates } = useViewport()
  const { currentAOI } = useAOIConnect()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig, globalConfig)

  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (map) {
      if (currentAOI && currentAOI.bbox) {
        // map.fitBounds(currentAOI.bbox, { padding: 60 })
        const [minLng, minLat, maxLng, maxLat] = currentAOI.bbox
        const { latitude, longitude, zoom } = fitBounds({
          bounds: [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          width: mapRef.current._width,
          height: mapRef.current._height,
          padding: 60,
        })
        setMapCoordinates({ latitude, longitude, zoom })
      } else {
        setMapCoordinates({ latitude: 0, longitude: 0, zoom: 0 })
      }
    }
  }, [currentAOI, setMapCoordinates])

  return (
    <div className={styles.container}>
      {style && (
        <ReactMapGL
          ref={mapRef}
          width="100%"
          height="100%"
          latitude={viewport.latitude}
          longitude={viewport.longitude}
          zoom={viewport.zoom}
          onViewportChange={onViewportChange}
          mapStyle={style}
          mapOptions={{
            customAttribution: '© Copyright Global Fishing Watch 2020',
          }}
        ></ReactMapGL>
      )}
    </div>
  )
}

export default Map
