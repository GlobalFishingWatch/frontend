import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

import TimeRangeDates from './TimeRangeDates'

import styles from './MapInfo.module.css'

export default function TimelineDatesRange() {
  const { start, end } = useTimerangeConnect()
  if (!start || !end) return null

  return (
    <div className={styles.dateRange}>
      <TimeRangeDates start={start} end={end} />
    </div>
  )
}
