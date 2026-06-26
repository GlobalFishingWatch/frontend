import cx from 'classnames'

import { useTimebarActions, useTimebarState } from '../timebar-context'

import IntervalSelector from './interval-selector'

import styles from '../timebar.module.css'

/** Interval (hour/day/month/year) selector column. Omit it to hide (e.g. real-time mode). */
export function TimebarIntervalSelector() {
  const { intervals, getCurrentInterval, labels, onIntervalClick } = useTimebarActions()
  const { start, end } = useTimebarState()

  if (!intervals || !getCurrentInterval) return null

  return (
    <div className={cx('print-hidden', styles.timeActions)}>
      <IntervalSelector
        intervals={intervals}
        getCurrentInterval={getCurrentInterval}
        labels={labels.intervals}
        start={start}
        end={end}
        onIntervalClick={onIntervalClick}
      />
    </div>
  )
}
