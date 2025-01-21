import cx from 'classnames'
import { DateTime } from 'luxon'

import { Locale } from '@globalfishingwatch/api-types'

import { FIRST_YEAR_OF_DATA } from './TransmissionsTimeline'

import styles from './TransmissionsTimeline.module.css'

type TransmissionsTimelineProps = {
  firstTransmissionDate: string
  lastTransmissionDate: string
  firstYearOfData?: number
  locale?: Locale
  onYearHover: (year?: number) => void
  showLastTimePoint?: boolean
}

export function YearlyTransmissionsTimeline({
  firstTransmissionDate,
  lastTransmissionDate,
  firstYearOfData = FIRST_YEAR_OF_DATA,
  locale = Locale.en,
  onYearHover,
  showLastTimePoint = false,
}: TransmissionsTimelineProps) {
  const start = DateTime.fromISO(firstYearOfData.toString(), { zone: 'utc' })
  const startTransmission = DateTime.fromISO(firstTransmissionDate, { zone: 'utc' }).setLocale(
    locale
  )
  const endTransmission = DateTime.fromISO(lastTransmissionDate, { zone: 'utc' }).setLocale(locale)
  const end = DateTime.now().toUTC()
  const years = new Array(Math.ceil(end.diff(start, 'years').years))
    .fill(undefined)
    .map((_, index) => start.year + index)

  return (
    <div className={cx(styles.timelineContainer, styles.flex)}>
      {years.map((year, index) => {
        const highlighted = startTransmission.year <= year && endTransmission.year >= year
        return highlighted ? (
          <div
            className={cx(styles.year, styles.highlighted)}
            key={index}
            onFocus={() => onYearHover && onYearHover(year)}
            onBlur={() => onYearHover && onYearHover(undefined)}
            onMouseOver={() => onYearHover && onYearHover(year)}
            onMouseOut={() => onYearHover && onYearHover(undefined)}
          >
            {highlighted && year}
            {showLastTimePoint && endTransmission.year === year && <div className={styles.last} />}
          </div>
        ) : (
          <div className={styles.year} key={index} />
        )
      })}
    </div>
  )
}
