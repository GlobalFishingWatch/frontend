import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components/icon'

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
  const {
    labels,
    absoluteStart,
    absoluteEnd,
    latestAvailableDataDate,
    toggleTimeRangeSelector,
    onTimeRangeSelectorSubmit,
    start,
    end,
    showTimeRangeSelector,
  } = useTimebar()

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
