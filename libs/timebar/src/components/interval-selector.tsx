import cx from 'classnames'
import { getInterval, Interval, INTERVAL_ORDER } from '@globalfishingwatch/layer-composer'
import styles from './interval-selector.module.css'

type IntervalSelectorProps = {
  start: string
  end: string
  labels?: { [key in Interval]?: string }
  intervals: Interval[]
  getCurrentInterval: (start: string, end: string, intervals: Interval[][]) => Interval
  onIntervalClick: (interval: Interval) => void
}

const defaultProps: IntervalSelectorProps = {
  start: '',
  end: '',
  intervals: INTERVAL_ORDER,
  getCurrentInterval: getInterval,
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
  const currentInterval = getCurrentInterval(start, end, [intervals])
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
