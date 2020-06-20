import React from 'react'
import ReactMapGL from 'react-map-gl'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import { useGeneratorsConnect, useViewport } from './map.hooks'
import 'mapbox-gl/dist/mapbox-gl.css'
import styles from './Map.module.css'

const Map = (): React.ReactElement => {
  const { viewport, onViewportChange } = useViewport()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig, globalConfig)

  return (
    <div className={styles.container}>
      {style && (
        <ReactMapGL
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
