import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import formatcoords from 'formatcoords'

import type { MiniglobeBounds} from '@globalfishingwatch/ui-components';
import { IconButton,MiniGlobe } from '@globalfishingwatch/ui-components'

import { useViewport } from '../map-viewport.hooks'

import styles from './MapControls.module.css'

const MapControls = ({ bounds }: { bounds: MiniglobeBounds | null }) => {
  const { viewport, setMapCoordinates } = useViewport()
  const { t } = useTranslation()

  const [showCoords, setShowCoords] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [showDMS, setShowDMS] = useState(false)

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
          bounds={bounds}
        />
      </div>
      <IconButton
        icon="plus"
        type="map-tool"
        data-tip-pos="left"
        tooltip={t('common.zoom_more', 'Increase zoom')}
        onClick={() => {
          setMapCoordinates({ ...viewport, zoom: viewport.zoom + 1 })
        }}
      />
      <IconButton
        icon="minus"
        type="map-tool"
        data-tip-pos="left"
        tooltip={t('common.zoom_less', 'Decrease zoom')}
        onClick={() => {
          setMapCoordinates({ ...viewport, zoom: viewport.zoom - 1 })
        }}
      />

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
