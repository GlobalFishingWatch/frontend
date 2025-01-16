import cx from 'classnames'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { FOURWINGS_INTERVALS_ORDER,getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import styles from './interval-selector.module.css'

type IntervalSelectorProps = {
  start: string
  end: string
  labels?: any
  intervals: FourwingsInterval[]
  getCurrentInterval: (
    start: string,
    end: string,
    intervals?: FourwingsInterval[]
  ) => FourwingsInterval
  onIntervalClick: (interval: FourwingsInterval) => void
}

function IntervalSelector({
  start = '',
  end = '',
  getCurrentInterval = getFourwingsInterval,
  intervals = FOURWINGS_INTERVALS_ORDER,
  labels = {
    hour: 'hours',
    day: 'days',
    month: 'months',
    year: 'years',
  },
  onIntervalClick,
}: IntervalSelectorProps) {
  const currentInterval = getCurrentInterval(start, end, intervals)
  const intervalsSorted = [...intervals].reverse()
  return (
    <ul className={styles.intervalContainer}>
      {intervalsSorted.map((interval) => {
        const active = currentInterval === interval
        const intervalLabel = labels?.[interval.toLowerCase()]
        const titleLabel = labels?.[`${interval.toLowerCase()}Tooltip`]
        return (
          <li key={interval}>
            <button
              className={cx(styles.intervalBtn, {
                [styles.intervalBtnActive]: active,
              })}
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

export default IntervalSelector
