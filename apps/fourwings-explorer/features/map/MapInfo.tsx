import cx from 'classnames'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { ScaleControl } from 'react-map-gl'
import { InteractionEvent } from '@globalfishingwatch/layer-composer'
import { useTimerange } from 'features/timebar/timebar.hooks'
import styles from './MapInfo.module.css'

export const pickDateFormatByRange = (start: string, end: string): DateTimeFormatOptions => {
  const A_DAY = 1000 * 60 * 60 * 24
  const timeΔ = start && end ? new Date(end).getTime() - new Date(start).getTime() : 0
  return timeΔ <= A_DAY ? DateTime.DATETIME_MED : DateTime.DATE_MED
}

export const TimelineDatesRange = () => {
  const [timerange] = useTimerange()
  const { start, end } = timerange
  if (!start || !end) return null
  const format = pickDateFormatByRange(start, end)
  const needsUTCSuffix = format.hour !== undefined
  return (
    <div className={styles.dateRange}>{`${DateTime.fromISO(start).toUTC().toLocaleString(format)} ${
      needsUTCSuffix ? 'UTC' : ''
    } - ${DateTime.fromISO(end).toUTC().toLocaleString(format)} ${
      needsUTCSuffix ? 'UTC' : ''
    }`}</div>
  )
}

const MapInfo = ({ center }: { center?: InteractionEvent | null }) => {
  return (
    <div className={styles.info}>
      <div className={styles.flex}>
        <ScaleControl maxWidth={100} unit="metric" />
        {center && (
          <div className={cx('print-hidden', styles.mouseCoordinates)}>
            {center.latitude.toFixed(4)} {center.longitude.toFixed(4)}
          </div>
        )}
      </div>
      <TimelineDatesRange />
    </div>
  )
}

export default MapInfo
