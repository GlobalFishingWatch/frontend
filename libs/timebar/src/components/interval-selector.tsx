import cx from 'classnames'
import { getFourwingsInterval, FOURWINGS_INTERVALS_ORDER } from '@globalfishingwatch/deck-loaders'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
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

const defaultProps: IntervalSelectorProps = {
  start: '',
  end: '',
  intervals: FOURWINGS_INTERVALS_ORDER,
  getCurrentInterval: getFourwingsInterval,
  onIntervalClick: () => {},
  labels: {
    hour: 'hours',
    day: 'days',
    month: 'months',
    year: 'years',
  },
}

function IntervalSelector({
  start,
  end,
  getCurrentInterval,
  intervals,
  labels,
  onIntervalClick,
}: IntervalSelectorProps) {
  const currentInterval = getCurrentInterval(start, end, intervals)
  const intervalsSorted = [...intervals].reverse()
  return (
    <ul className={styles.intervalContainer}>
      {intervalsSorted.map((interval) => {
        const active = currentInterval === interval
        return (
          <li key={interval}>
            <button
              className={cx(styles.intervalBtn, {
                [styles.intervalBtnActive]: active,
              })}
              onClick={() => onIntervalClick(interval)}
              title={labels?.[`${interval}Tooltip`]}
            >
              {labels?.[interval] ? labels[interval] : interval}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

IntervalSelector.defaultProps = defaultProps

export default IntervalSelector
