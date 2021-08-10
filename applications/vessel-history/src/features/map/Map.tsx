import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { InteractiveMap } from '@globalfishingwatch/react-map-gl'
import { useLayerComposer, useMapClick } from '@globalfishingwatch/react-hooks'
import { ExtendedStyleMeta } from '@globalfishingwatch/layer-composer'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { useGeneratorsConnect } from './map.hooks'
import useMapInstance from './map-context.hooks'
import useViewport from './map-viewport.hooks'
import MapControls from './controls/MapControls'
import useMapEvents from './map-events.hooks'
import styles from './Map.module.css'
import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const Map = (): ReactElement => {
  const map = useMapInstance()
  const { selectVesselEventOnClick } = useMapEvents()

  const { generatorsConfig, globalConfig, styleTransformations } = useGeneratorsConnect()
  const { viewport, onViewportChange } = useViewport()
  const resourcesLoading = useSelector(selectResourcesLoading) ?? false

  const { style, loading: layerComposerLoading } = useLayerComposer(
    generatorsConfig,
    globalConfig,
    styleTransformations
  )
  const mapOptions = {
    customAttribution: '© Copyright Global Fishing Watch 2020',
  }

  const onMapClick = useMapClick(
    selectVesselEventOnClick,
    style?.metadata as ExtendedStyleMeta,
    map
  )

  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          disableTokenWarning={true}
          width="100%"
          height="100%"
          {...viewport}
          onViewportChange={onViewportChange}
          onClick={onMapClick}
          mapStyle={style}
          mapOptions={mapOptions}
        ></InteractiveMap>
      )}
      <MapControls mapLoading={layerComposerLoading || resourcesLoading}></MapControls>
    </div>
  )
}

export default Map
