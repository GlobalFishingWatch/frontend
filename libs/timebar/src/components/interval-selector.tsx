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

const INTERVAL_OPTIONS = INTERVAL_ORDER.filter(
  (interval) => interval !== '10days' && interval !== 'year'
).reverse()

function IntervalSelector({
  intervals,
  currentInterval,
  labels,
  onIntervalClick,
}: IntervalSelectorProps) {
  return (
    <ul className={styles.intervalContainer}>
      {INTERVAL_OPTIONS.map((interval) => {
        const disabled = !intervals.includes(interval)
        return (
          <li key={interval}>
            <button
              className={cx(styles.intervalBtn, {
                [styles.intervalBtnActive]: currentInterval === interval,
                [styles.intervalBtnDisabled]: disabled,
              })}
              disabled={disabled}
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
