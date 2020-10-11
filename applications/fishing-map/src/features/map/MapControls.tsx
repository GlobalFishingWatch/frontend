import React, { useCallback, useEffect } from 'react'
import { MiniGlobe, IconButton } from '@globalfishingwatch/ui-components/dist'
import useViewport, { useMapBounds } from './map-viewport.hooks'
import styles from './MapControls.module.css'

const MapControls = (): React.ReactElement => {
  const { viewport, setMapCoordinates } = useViewport()
  const { latitude, longitude, zoom } = viewport
  const { bounds, setMapBounds } = useMapBounds()

  useEffect(() => {
    setMapBounds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, latitude, longitude])

  const onZoomInClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: zoom + 1 })
  }, [latitude, longitude, setMapCoordinates, zoom])
  const onZoomOutClick = useCallback(() => {
    setMapCoordinates({ latitude, longitude, zoom: Math.max(1, zoom - 1) })
  }, [latitude, longitude, setMapCoordinates, zoom])

  return (
    <div className={styles.mapControls}>
      <MiniGlobe size={60} bounds={bounds} center={{ latitude, longitude }} />
      <IconButton icon="plus" type="map-tool" tooltip="Zoom in" onClick={onZoomInClick} />
      <IconButton icon="minus" type="map-tool" tooltip="Zoom out" onClick={onZoomOutClick} />
      <IconButton icon="ruler" type="map-tool" tooltip="Ruler (Coming soon)" />
      <IconButton icon="camera" type="map-tool" tooltip="Capture (Coming soon)" />
    </div>
  )
}

export default MapControls
