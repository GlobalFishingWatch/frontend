import { useCallback, useState } from 'react'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'

import { EVENT_SOURCE } from '../constants'
import { useTimebar } from '../timebar-context'

import type { LastXOption } from './timerange-selector'
import TimeRangeSelector from './timerange-selector'

import styles from '../timebar.module.css'

type TimebarTimeRangeSelectorProps = {
  /** Defaults to 30 days / 3 + 6 months / 1 year. */
  timeRangeOptions?: LastXOption[]
  showDateInputs?: boolean
}

export function TimebarTimeRangeSelector({
  timeRangeOptions,
  showDateInputs,
}: TimebarTimeRangeSelectorProps = {}) {
  const { labels, absoluteStart, absoluteEnd, latestAvailableDataDate, notifyChange, start, end } =
    useTimebar()
  const [showTimeRangeSelector, setShowTimeRangeSelector] = useState(false)

  const toggleTimeRangeSelector = useCallback(() => {
    setShowTimeRangeSelector((prev) => !prev)
  }, [])

  const onTimeRangeSelectorSubmit = useCallback(
    (s: string, e: string) => {
      notifyChange(s, e, EVENT_SOURCE.TIME_RANGE_SELECTOR)
      setShowTimeRangeSelector(false)
    },
    [notifyChange]
  )

  return (
    <>
      {showTimeRangeSelector && (
        <TimeRangeSelector
          labels={labels.timerange}
          start={start}
          end={end}
          absoluteStart={absoluteStart}
          absoluteEnd={absoluteEnd}
          onSubmit={onTimeRangeSelectorSubmit}
          onDiscard={toggleTimeRangeSelector}
          latestAvailableDataDate={latestAvailableDataDate}
          lastXOptions={timeRangeOptions}
          showDateInputs={showDateInputs}
        />
      )}
      <button
        type="button"
        title={labels.timerange?.title}
        className={cx(styles.uiButton)}
        onClick={toggleTimeRangeSelector}
        data-testid="timebar-timerange-button"
      >
        <Icon icon="time-range" />
      </button>
    </>
  )
}
