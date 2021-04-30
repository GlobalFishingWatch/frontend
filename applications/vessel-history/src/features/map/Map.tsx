import { ReactElement } from 'react'
import { InteractiveMap } from '@globalfishingwatch/react-map-gl'
import { useLayerComposer } from '@globalfishingwatch/react-hooks'
import { useGeneratorsConnect } from './map.hooks'
import useViewport from './map-viewport.hooks'
import styles from './Map.module.css'

import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const Map = (): ReactElement => {
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  const { viewport, onViewportChange } = useViewport()

  const { style } = useLayerComposer(generatorsConfig, globalConfig)
  const mapOptions = {
    customAttribution: '© Copyright Global Fishing Watch 2020',
  }
  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          disableTokenWarning={true}
          width="100%"
          height="100%"
          {...viewport}
          onViewportChange={onViewportChange}
          mapStyle={style}
          mapOptions={mapOptions}
        ></InteractiveMap>
      )}
    </div>
  )
}

export default Map
