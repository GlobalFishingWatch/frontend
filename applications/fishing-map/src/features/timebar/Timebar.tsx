import React, { Fragment, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TimebarComponent, { TimebarHighlighter } from '@globalfishingwatch/timebar'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { setHighlightedTime, disableHighlightedTime, selectHighlightedTime } from './timebar.slice'

const TimebarWrapper = () => {
  const { start, end, dispatchTimerange } = useTimerangeConnect()
  const highlightedTime = useSelector(selectHighlightedTime)

  const dispatch = useDispatch()

  return (
    <TimebarComponent
      enablePlayback
      start={start}
      end={end}
      absoluteStart={DEFAULT_WORKSPACE.availableStart}
      absoluteEnd={DEFAULT_WORKSPACE.availableEnd}
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
    >
      {() => (
        <Fragment>
          {highlightedTime && (
            <TimebarHighlighter
              hoverStart={highlightedTime.start}
              hoverEnd={highlightedTime.end}
              // activity={timebarMode === TimebarMode.speed ? tracksGraph : null}
              unit="knots"
            />
          )}
        </Fragment>
      )}
    </TimebarComponent>
  )
}

export default memo(TimebarWrapper)
