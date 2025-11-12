import { useSelector } from 'react-redux'
import type { DateTimeFormatOptions } from 'luxon'

import { BLUE_PLANET_MODE_DATE_FORMAT, selectDebugOptions } from 'features/debug/debug.slice'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

import TimeRangeDates from './TimeRangeDates'

import styles from './MapInfo.module.css'

export default function TimelineDatesRange() {
  const { start, end } = useTimerangeConnect()
  const bluePlanetMode = useSelector(selectDebugOptions)?.bluePlanetMode
  if (!start || !end) return null

  const format: DateTimeFormatOptions | undefined = bluePlanetMode
    ? BLUE_PLANET_MODE_DATE_FORMAT
    : undefined

  return (
    <div className={styles.dateRange}>
      <TimeRangeDates start={start} end={end} format={format} showUTCLabel={bluePlanetMode} />
    </div>
  )
}
