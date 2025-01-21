import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { DateTime } from 'luxon'

import { Locale } from '@globalfishingwatch/api-types'

import styles from './TransmissionsTimeline.module.css'

export const FIRST_YEAR_OF_DATA = 2012

type TransmissionsTimelineProps = {
  firstTransmissionDate: string
  lastTransmissionDate: string
  firstYearOfData?: number
  locale?: Locale
}

export function TransmissionsTimeline({
  firstTransmissionDate,
  lastTransmissionDate,
  firstYearOfData = FIRST_YEAR_OF_DATA,
  locale = Locale.en,
}: TransmissionsTimelineProps) {
  const [timelineWidth, setTimelineWidth] = useState<number>(0)
  const transmissionsRef = useRef<HTMLDivElement | null>(null)
  const start = DateTime.fromISO(firstYearOfData.toString(), { zone: 'utc' })
  const startTransmission = DateTime.fromISO(firstTransmissionDate, { zone: 'utc' }).setLocale(
    locale
  )
  const endTransmission = DateTime.fromISO(lastTransmissionDate, { zone: 'utc' }).setLocale(locale)
  const end = DateTime.now().toUTC()
  const total = end.diff(start).milliseconds
  const beforeTransmission = startTransmission.diff(start).milliseconds
  const duringTransmission = endTransmission.diff(startTransmission).milliseconds
  const beforeWidth = Math.max(0, Math.floor((beforeTransmission / total) * 100))
  const duringWidth = Math.max(0, Math.floor((duringTransmission / total) * 100))
  const monthFormat = 'LLL'

  useLayoutEffect(() => {
    setTimelineWidth(transmissionsRef?.current?.offsetWidth || 0)
    if (!transmissionsRef.current) return
    const ro = new ResizeObserver(() => {
      setTimelineWidth(transmissionsRef?.current?.offsetWidth || 0)
    })
    ro.observe(transmissionsRef.current)
  }, [])

  return (
    <div className={styles.timelineContainer}>
      <div
        className={styles.highlighted}
        style={{ marginLeft: `${beforeWidth}%`, width: `${duringWidth}%` }}
        ref={transmissionsRef}
      >
        {timelineWidth > 30 && (
          <Fragment>
            <span>
              {timelineWidth > 90 && `${startTransmission.toFormat(monthFormat)} `}
              {timelineWidth > 50
                ? startTransmission.toFormat('yyyy')
                : startTransmission.toFormat('yy')}
            </span>
            <span>
              {timelineWidth > 90 && `${endTransmission.toFormat(monthFormat)} `}
              {timelineWidth > 50
                ? endTransmission.toFormat('yyyy')
                : endTransmission.toFormat('yy')}
            </span>
          </Fragment>
        )}
      </div>
    </div>
  )
}
