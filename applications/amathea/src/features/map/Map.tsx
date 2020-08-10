import React, { useRef, useEffect, useState } from 'react'
import { fitBounds } from 'viewport-mercator-project'
import { InteractiveMap } from '@globalfishingwatch/react-map-gl'
import Miniglobe, { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist/miniglobe'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import useLayerComposer from '@globalfishingwatch/react-hooks/dist/use-layer-composer'
import { useAOIConnect } from 'features/areas-of-interest/areas-of-interest.hook'
import { useGeneratorsConnect, useViewport } from './map.hooks'
import styles from './Map.module.css'

import '@globalfishingwatch/mapbox-gl/dist/mapbox-gl.css'

const Map = (): React.ReactElement => {
  const mapRef = useRef<any>(null)
  const { viewport, onViewportChange, setMapCoordinates } = useViewport()
  const { latitude, longitude, zoom } = viewport
  const { currentAOI } = useAOIConnect()
  const { generatorsConfig, globalConfig } = useGeneratorsConnect()
  // useLayerComposer is a convenience hook to easily generate a Mapbox GL style (see https://docs.mapbox.com/mapbox-gl-js/style-spec/) from
  // the generatorsConfig (ie the map "layers") and the global configuration
  const { style } = useLayerComposer(generatorsConfig, globalConfig)

  const [bounds, setBounds] = useState<MiniglobeBounds | null>(null)

  useEffect(() => {
    const mapboxRef = mapRef?.current?.getMap()
    if (mapboxRef) {
      const rawBounds = mapboxRef.getBounds()
      if (rawBounds) {
        setBounds({
          north: rawBounds.getNorth() as number,
          south: rawBounds.getSouth() as number,
          west: rawBounds.getWest() as number,
          east: rawBounds.getEast() as number,
        })
      }
    }
  }, [zoom, latitude, longitude, mapRef])

  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (map) {
      if (currentAOI && currentAOI.bbox) {
        const [minLng, minLat, maxLng, maxLat] = currentAOI.bbox
        const { latitude, longitude, zoom } = fitBounds({
          bounds: [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          width: mapRef.current?._width,
          height: mapRef.current?._height,
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
        <InteractiveMap
          ref={mapRef}
          width="100%"
          height="100%"
          latitude={latitude}
          longitude={longitude}
          zoom={zoom}
          onViewportChange={onViewportChange}
          mapStyle={style}
          mapOptions={{
            customAttribution: '© Copyright Global Fishing Watch 2020',
          }}
        />
      )}
      <div className={styles.mapControls}>
        {bounds && <Miniglobe size={60} bounds={bounds} center={{ latitude, longitude }} />}
        <IconButton
          icon="plus"
          type="map-tool"
          tooltip="Zoom in"
          onClick={() => {
            setMapCoordinates({ latitude, longitude, zoom: zoom + 1 })
          }}
        />
        <IconButton
          icon="minus"
          type="map-tool"
          tooltip="Zoom out"
          onClick={() => {
            setMapCoordinates({ latitude, longitude, zoom: Math.max(1, zoom - 1) })
          }}
        />
        <IconButton icon="ruler" type="map-tool" tooltip="Open ruler tool" />
        <IconButton icon="camera" type="map-tool" tooltip="Capture the map" />
      </div>
    </div>
  )
}

export default Map
