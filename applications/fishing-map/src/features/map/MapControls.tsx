import React, { useCallback, useEffect } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { MiniGlobe, IconButton, Tooltip } from '@globalfishingwatch/ui-components/dist'
import { Generators } from '@globalfishingwatch/layer-composer'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectDataviewInstancesResolved } from 'features/workspace/workspace.selectors'
import Rulers from 'features/map/rulers/Rulers'
import useViewport, { useMapBounds } from './map-viewport.hooks'
import styles from './MapControls.module.css'

const MapControls = (): React.ReactElement => {
  const resolvedDataviewInstances = useSelector(selectDataviewInstancesResolved)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
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

  const basemapDataviewInstance = resolvedDataviewInstances?.find(
    (d) => d.config?.type === Generators.Type.Basemap
  )
  const currentBasemap = basemapDataviewInstance?.config?.basemap ?? Generators.BasemapType.Default
  const switchBasemap = () => {
    upsertDataviewInstance({
      id: basemapDataviewInstance?.id,
      config: {
        basemap:
          currentBasemap === Generators.BasemapType.Default
            ? Generators.BasemapType.Satellite
            : Generators.BasemapType.Default,
      },
    })
  }

  return (
    <div className={styles.mapControls}>
      <MiniGlobe size={60} viewportThickness={3} bounds={bounds} center={{ latitude, longitude }} />
      <IconButton icon="plus" type="map-tool" tooltip="Zoom in" onClick={onZoomInClick} />
      <IconButton icon="minus" type="map-tool" tooltip="Zoom out" onClick={onZoomOutClick} />
      <Rulers />
      <IconButton icon="camera" type="map-tool" tooltip="Capture (Coming soon)" />
      <Tooltip
        content={`Switch to ${
          currentBasemap === Generators.BasemapType.Default ? 'satellite' : 'default'
        } basemap`}
        placement="left"
      >
        <button
          className={cx(styles.basemapSwitcher, styles[currentBasemap])}
          onClick={switchBasemap}
        ></button>
      </Tooltip>
    </div>
  )
}

export default MapControls
