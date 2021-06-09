import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { InteractiveMap } from '@globalfishingwatch/react-map-gl'
import { useLayerComposer } from '@globalfishingwatch/react-hooks'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { useGeneratorsConnect } from './map.hooks'
import useViewport from './map-viewport.hooks'
import MapControls from './controls/MapControls'
import styles from './Map.module.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const Map = (): ReactElement => {
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  const { viewport, onViewportChange } = useViewport()
  const resourcesLoading = useSelector(selectResourcesLoading) ?? false

  const { style, loading: layerComposerLoading } = useLayerComposer(generatorsConfig, globalConfig)
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
      <MapControls mapLoading={layerComposerLoading || resourcesLoading}></MapControls>
    </div>
  )
}

export default Map
