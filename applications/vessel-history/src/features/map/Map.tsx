import { ReactElement, useState } from 'react'
import { useSelector } from 'react-redux'
import { InteractiveMap } from '@globalfishingwatch/react-map-gl'
import { useLayerComposer } from '@globalfishingwatch/react-hooks'
import { getLayerComposerLayers } from './map.selectors'
import { useGeneratorsConnect } from './map.hooks'
import styles from './Map.module.css'

import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const Map = (): ReactElement => {
  const generatorConfigs = useSelector(getLayerComposerLayers)
  const { globalConfig } = useGeneratorsConnect()
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  })

  const { style } = useLayerComposer(generatorConfigs, globalConfig)

  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          disableTokenWarning={true}
          width="100%"
          height="100%"
          {...viewport}
          onViewportChange={setViewport}
          mapStyle={style}
          mapOptions={{
            customAttribution: '© Copyright Global Fishing Watch 2020',
          }}
        ></InteractiveMap>
      )}
    </div>
  )
}

export default Map
