import { useCallback } from 'react'
import cx from 'classnames'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { CONFIG_BY_INTERVAL, LIMITS_BY_INTERVAL } from '@globalfishingwatch/deck-loaders'

import { EVENT_INTERVAL_SOURCE } from '../constants'
import { useTimebar } from '../timebar-context'
import { getTime } from '../utils'

import styles from './interval-selector.module.css'

export function TimebarIntervalSelector() {
  const {
    intervals,
    getCurrentInterval,
    labels,
    notifyChange,
    start,
    end,
    absoluteStart,
    absoluteEnd,
    latestAvailableDataDate,
  } = useTimebar()

  const onIntervalClick = useCallback(
    (interval: FourwingsInterval) => {
      const intervalConfig = CONFIG_BY_INTERVAL[interval]
      if (!intervalConfig) return
      const intervalLimit = LIMITS_BY_INTERVAL[interval]
      if (intervalLimit) {
        let newStart
        let newEnd
        if (
          latestAvailableDataDate &&
          latestAvailableDataDate.slice(0, start.length) >= start &&
          latestAvailableDataDate.slice(0, start.length) <= end
        ) {
          newEnd = DateTime.fromISO(latestAvailableDataDate, { zone: 'utc' })
            .endOf(interval as DateTimeUnit)
            .plus({ millisecond: 1 })
          newStart = newEnd.minus({ [intervalLimit.unit]: 1 })
        } else {
          // if present day is out of range we choose the middle point in the timebar
          newStart = DateTime.fromMillis(getTime(start) + (getTime(end) - getTime(start)) / 2, {
            zone: 'utc',
          }).startOf(intervalLimit.unit as DateTimeUnit)
          newEnd = newStart.plus({ [intervalLimit.unit]: 1 })
        }
        notifyChange(
          newStart.toISO() as string,
          newEnd.toISO() as string,
          EVENT_INTERVAL_SOURCE[interval] as string
        )
      } else {
        notifyChange(absoluteStart, absoluteEnd, EVENT_INTERVAL_SOURCE[interval] as string)
      }
    },
    [notifyChange, start, end, absoluteStart, absoluteEnd, latestAvailableDataDate]
  )

  if (!intervals || !getCurrentInterval) {
    return null
  }

  const currentInterval = getCurrentInterval(start, end, intervals)
  const intervalsSorted = [...intervals].reverse()
  return (
    <ul className={styles.intervalContainer}>
      {intervalsSorted.map((interval) => {
        const active = currentInterval === interval
        const intervalLabel =
          labels?.intervals?.[interval.toLowerCase() as keyof typeof labels.intervals]
        const titleLabel =
          labels?.intervals?.[`${interval.toLowerCase()}Tooltip` as keyof typeof labels.intervals]
        return (
          <li key={interval} className={styles.intervalBtnContainer}>
            <button
              className={cx(styles.intervalBtn, {
                [styles.intervalBtnActive]: active,
              })}
              data-testid={`interval-btn-${interval.toLowerCase()}`}
              onClick={() => onIntervalClick(interval)}
              title={titleLabel || interval}
            >
              {intervalLabel || interval}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
