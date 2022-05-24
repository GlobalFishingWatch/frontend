import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { ScaleControl } from 'react-map-gl'
import { InteractionEvent } from '@globalfishingwatch/react-hooks'
import { toFixed } from 'utils/shared'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import I18nDate from 'features/i18n/i18nDate'
import { selectShowTimeComparison } from 'features/analysis/analysis.selectors'
import styles from './MapInfo.module.css'

export const pickDateFormatByRange = (start: string, end: string): DateTimeFormatOptions => {
  const A_DAY = 1000 * 60 * 60 * 24
  const timeΔ = start && end ? new Date(end).getTime() - new Date(start).getTime() : 0
  return timeΔ <= A_DAY ? DateTime.DATETIME_MED : DateTime.DATE_MED
}

export const TimeRangeDates = ({
  start,
  end,
  format = pickDateFormatByRange(start, end),
}: {
  start: string
  end: string
  format?: DateTimeFormatOptions
}) => {
  return (
    <Fragment>
      <I18nDate date={start} format={format} /> - <I18nDate date={end} format={format} />
    </Fragment>
  )
}

export const TimelineDatesRange = () => {
  const { start, end } = useTimerangeConnect()
  if (!start || !end) return null

  return (
    <div className={styles.dateRange}>
      <TimeRangeDates start={start} end={end} />
    </div>
  )
}

const MapInfo = ({ center }: { center: InteractionEvent | null }) => {
  const showTimeComparison = useSelector(selectShowTimeComparison)
  return (
    <div className={styles.info}>
      <div className={styles.flex}>
        <ScaleControl maxWidth={100} unit="nautical" />
        {center && (
          <div className={cx('print-hidden', styles.mouseCoordinates)}>
            {toFixed(center.latitude, 4)} {toFixed(center.longitude, 4)}
          </div>
        )}
      </div>
      {!showTimeComparison && <TimelineDatesRange />}
    </div>
  )
}

export default MapInfo
