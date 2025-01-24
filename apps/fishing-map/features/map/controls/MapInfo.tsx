import { useSelector } from 'react-redux'
import cx from 'classnames'
import formatcoords from 'formatcoords'

import { selectShowTimeComparison } from 'features/reports/areas/area-reports.selectors'
import { toFixed } from 'utils/shared'

import MapScaleControl from './MapScaleControl'
import TimelineDatesRange from './TimelineDatesRange'

import styles from './MapInfo.module.css'

export default function MapInfo({ center }: { center?: number[] }) {
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const [x, y] = center || []
  return (
    <div className={styles.info}>
      <div className={styles.flex}>
        <MapScaleControl />
        {x && y && (
          <div className={cx('print-hidden', styles.mouseCoordinates)}>
            {toFixed(y, 4)} {toFixed(x, 4)}
            <br />
            {formatcoords(y, x).format('DDMMssX', {
              latLonSeparator: ' ',
              decimalPlaces: 2,
            })}
          </div>
        )}
      </div>
      {!showTimeComparison && <TimelineDatesRange />}
    </div>
  )
}
