import React, { Fragment, useLayoutEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { DateTime } from 'luxon'
import { Locale } from '@globalfishingwatch/api-types'
import styles from './TransmissionsTimeline.module.css'

export const FIRST_YEAR_OF_DATA = 2012

export type TransmissionDatesExtent = {
  start: string
  end: string
}

export type TransmissionsTimelineProps = {
  dates: TransmissionDatesExtent[]
  currentDateIndex?: number
  onDateClick?: (dates: TransmissionDatesExtent, index: number) => void
  firstYearOfData?: number
  locale?: Locale
}

export function TransmissionsTimeline({
  dates,
  currentDateIndex,
  firstYearOfData = FIRST_YEAR_OF_DATA,
  onDateClick,
  locale = Locale.en,
}: TransmissionsTimelineProps) {
  const [timelineWidths, setTimelineWidths] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const widths = [] as number[]
    if (containerRef?.current) {
      containerRef?.current.childNodes.forEach((n: any) => widths.push(n.offsetWidth))
    }
    if (widths.length) {
      setTimelineWidths(widths)
    }
  }, [])

  return (
    <div className={styles.timelineContainer} ref={containerRef}>
      {dates.map(({ start, end }, index) => {
        const timelineWidth = timelineWidths[index]
        const startRange = DateTime.fromISO(firstYearOfData.toString(), { zone: 'utc' })
        const startTransmission = DateTime.fromISO(start, {
          zone: 'utc',
        }).setLocale(locale)
        const endTransmission = DateTime.fromISO(end, { zone: 'utc' }).setLocale(locale)
        const endRange = DateTime.now().toUTC()
        const total = endRange.diff(startRange).milliseconds
        const beforeTransmission = startTransmission.diff(startRange).milliseconds
        const duringTransmission = endTransmission.diff(startTransmission).milliseconds
        const beforeWidth = Math.max(0, Math.floor((beforeTransmission / total) * 100))
        const duringWidth = Math.max(0, Math.floor((duringTransmission / total) * 100))
        const monthFormat = 'LLL'
        return (
          <div
            className={cx(styles.timerange, {
              [styles.highlighted]: currentDateIndex ? index === currentDateIndex : index === 0,
              [styles.interactive]: onDateClick !== undefined,
            })}
            style={{ left: `${beforeWidth}%`, width: `${duringWidth}%` }}
            onClick={() => {
              if (onDateClick) {
                onDateClick({ start, end }, index)
              }
            }}
          >
            {timelineWidths[index] > 30 && (
              <Fragment>
                <span className={styles.dates}>
                  {timelineWidth > 90 && `${startTransmission.toFormat(monthFormat)} `}
                  {timelineWidth > 50
                    ? startTransmission.toFormat('yyyy')
                    : startTransmission.toFormat('yy')}
                </span>
                <span className={styles.dates}>
                  {timelineWidth > 90 && `${endTransmission.toFormat(monthFormat)} `}
                  {timelineWidth > 50
                    ? endTransmission.toFormat('yyyy')
                    : endTransmission.toFormat('yy')}
                </span>
              </Fragment>
            )}
          </div>
        )
      })}
    </div>
  )
}
