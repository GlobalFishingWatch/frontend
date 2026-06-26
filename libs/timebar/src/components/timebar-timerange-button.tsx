import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components'

import { useTimebarActions, useTimebarState } from '../timebar-context'

import TimeRangeSelector from './timerange-selector'

import styles from '../timebar.module.css'

/** Time-range (calendar) button + its modal. Place inside <Timebar.Controls>. */
export function TimebarTimeRangeSelector() {
  const {
    labels,
    absoluteStart,
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
          // ponytail: legacy passed state.absoluteEnd (always null) — preserved. Wire context absoluteEnd to fix.
          absoluteEnd={null as unknown as string}
          onSubmit={onTimeRangeSelectorSubmit}
          onDiscard={toggleTimeRangeSelector}
          latestAvailableDataDate={latestAvailableDataDate}
        />
      )}
      <button
        type="button"
        title={labels.timerange?.title}
        className={cx(styles.uiButton)}
        onClick={toggleTimeRangeSelector}
      >
        <Icon icon="time-range" />
      </button>
    </>
  )
}
