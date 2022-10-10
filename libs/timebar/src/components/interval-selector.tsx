import cx from 'classnames'
import { intersection } from 'lodash'
import { INTERVAL_ORDER, Interval } from '@globalfishingwatch/layer-composer'
import styles from './interval-selector.module.css'

type IntervalSelectorProps = {
  intervals: Interval[]
  currentInterval?: Interval
  labels?: { [key in Interval]?: string }
  onIntervalClick: (interval: Interval) => void
}

const defaultProps: IntervalSelectorProps = {
  intervals: [],
  onIntervalClick: () => {},
  labels: {
    hour: 'hour',
    day: 'day',
    month: 'month',
    year: 'year',
  },
}

function IntervalSelector({
  intervals,
  currentInterval,
  labels,
  onIntervalClick,
}: IntervalSelectorProps) {
  const intervalsSorted = intersection(INTERVAL_ORDER, intervals)?.reverse()
  return (
    <ul className={styles.intervalContainer}>
      {intervalsSorted?.length > 0 &&
        intervalsSorted.map((interval) => (
          <li key={interval}>
            <button
              className={cx(styles.intervalBtn, {
                [styles.intervalBtnActive]: currentInterval === interval,
              })}
              onClick={() => onIntervalClick(interval)}
            >
              {labels?.[interval] ? labels[interval] : interval}
            </button>
          </li>
        ))}
    </ul>
  )
}

IntervalSelector.defaultProps = defaultProps

export default IntervalSelector
