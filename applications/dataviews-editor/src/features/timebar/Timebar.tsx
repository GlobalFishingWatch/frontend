import { TRACK_START, TRACK_END } from 'config'
import React from 'react'
import TimebarComponent from '@globalfishingwatch/timebar'
import { useTimeConnect } from './timebar.hooks'

const TimebarChild = () => null

const Timebar = () => {
  const { start, end, dispatchTimerange } = useTimeConnect()
  return (
    <TimebarComponent
      enablePlayback
      start={start}
      end={end}
      absoluteStart={TRACK_START.toISOString()}
      absoluteEnd={TRACK_END.toISOString()}
      onChange={dispatchTimerange}
      showLastUpdate={false}
    >
      {TimebarChild}
    </TimebarComponent>
  )
}

export default Timebar
