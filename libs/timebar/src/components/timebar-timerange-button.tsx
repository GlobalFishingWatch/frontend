import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components'

import { useTimebarActions, useTimebarState } from '../timebar-context'

import type { LastXOption } from './timerange-selector'
import TimeRangeSelector from './timerange-selector'

import styles from '../timebar.module.css'

type TimebarTimeRangeSelectorProps = {
  /** Quick-select "last N units" options. Defaults to 30 days / 3 + 6 months / 1 year. */
  timeRangeOptions?: LastXOption[]
}

/** Time-range (calendar) button + its modal. Place inside <Timebar.Controls>. */
export function TimebarTimeRangeSelector({ timeRangeOptions }: TimebarTimeRangeSelectorProps = {}) {
  const {
    labels,
    absoluteStart,
    absoluteEnd,
    latestAvailableDataDate,
    toggleTimeRangeSelector,
    onTimeRangeSelectorSubmit,
  } = useTimebarActions()
  const { start, end, showTimeRangeSelector } = useTimebarState()

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
