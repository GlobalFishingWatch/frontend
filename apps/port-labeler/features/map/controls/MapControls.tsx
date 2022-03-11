import React, { useState } from 'react'
import cx from 'classnames'
import formatcoords from 'formatcoords'
import { useDispatch, useSelector } from 'react-redux'
import MiniGlobe, { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist/miniglobe'
import { IconButton } from '@globalfishingwatch/ui-components'
import { BasemapType } from '@globalfishingwatch/layer-composer'
import { updateQueryParams } from 'routes/routes.actions'
import { selectSatellite } from 'routes/routes.selectors'
import { useViewport } from '../map-viewport.hooks'
import styles from './MapControls.module.css'

const MapControls = ({ bounds }: { bounds: MiniglobeBounds | null }) => {
  const { viewport, onViewportChange } = useViewport()
  const dispatch = useDispatch()

  const [showCoords, setShowCoords] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [showDMS, setShowDMS] = useState(false)
  const isSatellite = useSelector(selectSatellite)
  const currentBasemap = isSatellite
    ? BasemapType.Satellite
    : BasemapType.Default
  const switchBasemap = () => {
    dispatch(updateQueryParams({ satellite: !isSatellite }))
  }

  return (
    <div className={styles.mapControls}>
      <div
        className={styles.miniglobe}
        onMouseEnter={() => setShowCoords(true)}
        onMouseLeave={() => setShowCoords(false)}
        onClick={() => setPinned(!pinned)}
      >
        <MiniGlobe
          center={{ latitude: viewport.latitude, longitude: viewport.longitude }}
          size={60}
          bounds={bounds} />
      </div>
      <IconButton
        icon="plus"
        type="map-tool"
        data-tip-pos="left"
        tooltip="Increase zoom"
        onClick={() => {
          onViewportChange({ ...viewport, zoom: viewport.zoom + 1 })
        }}
      />
      <IconButton
        icon="minus"
        type="map-tool"
        data-tip-pos="left"
        tooltip="Decrease zoom"
        onClick={() => {
          onViewportChange({ ...viewport, zoom: viewport.zoom - 1 })
        }}
      />
      <button
        className={cx(styles.basemapSwitcher, styles[currentBasemap])}
        onClick={switchBasemap}
      ></button>

      {(pinned || showCoords) && (
        <div
          className={cx(styles.coords, { [styles._pinned]: pinned })}
          onClick={() => setShowDMS(!showDMS)}
        >
          {showDMS
            ? formatcoords(viewport.latitude, viewport.longitude).format('DDMMssX', {
              latLonSeparator: '',
              decimalPlaces: 2,
            })
            : `${viewport.latitude},${viewport.longitude}`}
        </div>
      )}
    </div>
  )
}

export default MapControls
