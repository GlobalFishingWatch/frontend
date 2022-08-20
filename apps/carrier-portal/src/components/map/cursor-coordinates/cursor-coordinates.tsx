import React, { useState, useCallback } from 'react'
import cx from 'classnames'
import formatCoords from 'formatcoords'
import { CoordinatePosition } from 'types/app.types'
import styles from './cursor-coordinates.module.css'

interface MousePositionProps {
  coordinates?: CoordinatePosition | null
  floating?: boolean
}

type format = 'latLng' | 'f'

const MousePosition: React.FC<MousePositionProps> = ({ coordinates = null, floating = false }) => {
  const [format, setFormat] = useState<format>('latLng')
  const handleClick = useCallback(() => {
    setFormat((format) => (format === 'f' ? 'latLng' : 'f'))
  }, [])

  return (
    <div className={cx(styles.container, { [styles.containerFloat]: floating })}>
      {coordinates && (
        <button className={styles.coordinates} onClick={handleClick}>
          {format === 'latLng' ? (
            <span>
              {coordinates.latitude?.toFixed(4)}&nbsp;&nbsp;&nbsp;
              {coordinates.longitude?.toFixed(4)}
            </span>
          ) : (
            formatCoords({ lat: coordinates.latitude, lng: coordinates.longitude }).format(format, {
              decimalPlaces: 2,
            })
          )}
        </button>
      )}
    </div>
  )
}

export default MousePosition
