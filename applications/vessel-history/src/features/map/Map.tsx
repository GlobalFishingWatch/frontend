import { ReactElement, useState } from 'react'
import { useSelector } from 'react-redux'
import { InteractiveMap } from '@globalfishingwatch/react-map-gl'
import { useLayerComposer } from '@globalfishingwatch/react-hooks'
import {
  getLayerComposerLayers,
  // getMapboxPaintIcon,
  // selectDirectionPointsLayers,
  // selectLegendLabels,
} from './map.selectors'
import {
  useGeneratorsConnect,
  // useMapBounds,
  // useMapClick,
  // useMapMove,
  // useViewport,
} from './map.hooks'
import { useMapboxRef, useMapboxRefCallback } from './map.context'
import styles from './Map.module.css'

import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const Map = (): ReactElement => {
  const mapRef = useMapboxRef()

  const onRefReady = useMapboxRefCallback()
  // const { viewport, onViewportChange } = useViewport()

  const generatorConfigs = useSelector(getLayerComposerLayers)
  const { globalConfig } = useGeneratorsConnect()
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  })

  const { style } = useLayerComposer(generatorConfigs, globalConfig)

  // return (
  //   <ReactMapGL
  //     {...viewport}
  //     width="100%"
  //     height="100%"
  //     onViewportChange={(viewport) => setViewport(viewport)}
  //   />
  // )
  return (
    <div className={styles.container}>
      {style && (
        <InteractiveMap
          disableTokenWarning={true}
          ref={mapRef}
          width="100%"
          height="100%"
          {...viewport}
          // onLoad={onLoadCallback}
          onViewportChange={setViewport}
          mapStyle={style}
          // onClick={handleMapClick}
          // onHover={handleMapHover}
          // onMouseMove={onMapMove}
          mapOptions={{
            customAttribution: '© Copyright Global Fishing Watch 2020',
          }}
        ></InteractiveMap>
      )}
      {/* <div className={styles.legendContainer}>
        {legengLabels &&
          legengLabels.map((legend) => (
            <div key={legend.id} className={styles.legend}>
              <svg width="8" height="9" xmlns="http://www.w3.org/2000/svg" fill={legend.color}>
                <path
                  d="M7.68 8.86L3.88.84.03 8.88l3.83-1.35 3.82 1.33zm-3.8-5.7l1.88 3.97-1.9-.66-1.89.66 1.9-3.97z"
                  fillRule="nonzero"
                />
              </svg>
              {legend.name}
            </div>
          ))}
      </div> */}
    </div>
  )
}

export default Map
