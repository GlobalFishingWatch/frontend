import React, { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { DateTime } from 'luxon'
import { Locale } from '@globalfishingwatch/api-types'
import styles from './TransmissionsTimeline.module.css'

type TransmissionsTimelineProps = {
  firstTransmissionDate: string
  lastTransmissionDate: string
  firstYearOfData: number
  locale?: Locale
}

export function TransmissionsTimeline({
  firstTransmissionDate,
  lastTransmissionDate,
  firstYearOfData,
  locale = Locale.en,
}: TransmissionsTimelineProps) {
  const [timelineWidth, setTimelineWidth] = useState<number>(0)
  const transmissionsRef = useRef<HTMLDivElement | null>(null)
  const start = DateTime.fromISO(firstYearOfData.toString(), { zone: 'utc' })
  const startTransmission = DateTime.fromISO(firstTransmissionDate, { zone: 'utc' })
  const endTransmission = DateTime.fromISO(lastTransmissionDate, { zone: 'utc' })
  const end = DateTime.now().toUTC()
  const total = end.diff(start).milliseconds
  console.log('total', total)
  const beforeTransmission = startTransmission.diff(start).milliseconds
  console.log('beforeTransmission', beforeTransmission)
  const duringTransmission = endTransmission.diff(startTransmission).milliseconds
  const beforeWidth = Math.floor((beforeTransmission / total) * 100)
  console.log('before', beforeTransmission / total)
  console.log('beforeWidth', Math.floor(beforeWidth))
  const duringWidth = Math.floor((duringTransmission / total) * 100)
  const monthFormat = 'LLL'

  useLayoutEffect(() => {
    setTimelineWidth(transmissionsRef?.current?.offsetWidth || 0)
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
              {timelineWidth > 90 &&
                `${startTransmission.setLocale(locale).toFormat(monthFormat)} `}
              {timelineWidth > 50
                ? startTransmission.setLocale(locale).toFormat('yyyy')
                : startTransmission.setLocale(locale).toFormat('yy')}
            </span>
            <span>
              {timelineWidth > 90 && `${endTransmission.setLocale(locale).toFormat(monthFormat)} `}
              {timelineWidth > 50
                ? endTransmission.setLocale(locale).toFormat('yyyy')
                : endTransmission.setLocale(locale).toFormat('yy')}
            </span>
          </Fragment>
        )}
      </div>
    </div>
  )
}
