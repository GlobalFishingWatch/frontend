import cx from 'classnames'

import { useTimebar } from '../timebar-context'

import styles from './interval-selector.module.css'

export function TimebarIntervalSelector() {
  const { intervals, getCurrentInterval, labels, onIntervalClick, start, end } = useTimebar()

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
