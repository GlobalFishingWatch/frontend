import React, { useCallback, useMemo,useState } from 'react'
import cx from 'classnames'
import formatCoords from 'formatcoords'
import { DateTime } from 'luxon'

// import { ScaleControl } from '@globalfishingwatch/react-map-gl'
import type { CoordinatePosition } from '../../../types'
import { useTimerangeConnect } from '../../timebar/timebar.hooks'

// import { useViewport } from '../map.hooks'
import styles from './map-data.module.css'

interface MousePositionProps {
  coordinates?: CoordinatePosition | null
  floating?: boolean
}
type format = 'latLng' | 'f'
const A_DAY = 1000 * 60 * 60 * 24

const MapData: React.FC<MousePositionProps> = ({ coordinates = null, floating = false }) => {
  const { start, end } = useTimerangeConnect()
  // const { viewport } = useViewport()
  // const { zoom } = viewport
  const [format, setFormat] = useState<format>('latLng')
  const handleClick = useCallback(() => {
    setFormat((format) => (format === 'f' ? 'latLng' : 'f'))
  }, [])

  const formattedTime = useMemo(() => {
    const startDT = DateTime.fromISO(start).toUTC()
    const endDT = DateTime.fromISO(end).toUTC()
    let stFormatted = startDT.toLocaleString(DateTime.DATE_MED)
    let endFormatted = endDT.toLocaleString(DateTime.DATE_MED)
    const timeΔ = new Date(end).getTime() - new Date(start).getTime()
    if (timeΔ < A_DAY) {
      stFormatted = [startDT.toLocaleString(DateTime.DATETIME_MED), 'UTC'].join(' ')
      endFormatted = [endDT.toLocaleString(DateTime.DATETIME_MED), 'UTC'].join(' ')
    }
    return `${stFormatted} - ${endFormatted}`
  }, [start, end])

  return (
    <div className={cx(styles.container, { [styles.containerFloat]: floating })}>
      {coordinates && (
        <div>
          <div className={styles.scale}>
            {/* {zoom > 3 && <ScaleControl maxWidth={100} unit="nautical" />} */}
          </div>
          <button className={styles.coordinates} onClick={handleClick}>
            {format === 'latLng' ? (
              <span>
                {coordinates.latitude.toFixed(4)}&nbsp;&nbsp;&nbsp;
                {coordinates.longitude.toFixed(4)}
              </span>
            ) : (
              formatCoords({ lat: coordinates.latitude, lng: coordinates.longitude }).format(
                format,
                {
                  decimalPlaces: 2,
                }
              )
            )}
          </button>
          <div>{formattedTime}</div>
        </div>
      )}
    </div>
  )
}

export default MapData
