import { memo } from 'react'
import { Timebar } from '@globalfishingwatch/timebar'
import { DEFAULT_WORKSPACE } from 'data/config'
import { useTimerangeConnect, useURLTimerange } from 'features/timebar/timebar.hooks'
import styles from './Timebar.module.css'

const TimebarWrapper = () => {
  useURLTimerange()
  const { timerange, onTimebarChange } = useTimerangeConnect()

  if (!timerange?.start || !timerange?.end) return null
  return (
    <div className={styles.timebarWrapper}>
      <Timebar
        enablePlayback={true}
        start={timerange?.start}
        end={timerange?.end}
        absoluteStart={DEFAULT_WORKSPACE.availableStart}
        absoluteEnd={DEFAULT_WORKSPACE.availableEnd}
        onChange={onTimebarChange}
      ></Timebar>
    </div>
  )
}

export default memo(TimebarWrapper)
