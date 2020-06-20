import React, { memo } from 'react'
import { useDispatch } from 'react-redux'
import TimebarComponent from '@globalfishingwatch/timebar'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { setHighlightedTime, disableHighlightedTime } from './timebar.slice'

const TimebarWrapper = () => {
  const { start, end, dispatchTimerange } = useTimerangeConnect()

  const dispatch = useDispatch()

  return (
    <TimebarComponent
      enablePlayback
      start={start}
      end={end}
      absoluteStart={DEFAULT_WORKSPACE.start}
      absoluteEnd={DEFAULT_WORKSPACE.end}
      onChange={dispatchTimerange}
      showLastUpdate={false}
      onMouseMove={(clientX: number, scale: (arg: number) => Date) => {
        if (clientX === null) {
          dispatch(disableHighlightedTime())
          return
        }
        const start = scale(clientX - 10).toISOString()
        const end = scale(clientX + 10).toISOString()
        dispatch(setHighlightedTime({ start, end }))
      }}
    ></TimebarComponent>
  )
}

export default memo(TimebarWrapper)
