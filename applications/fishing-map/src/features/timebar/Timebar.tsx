import React, { Fragment, memo, useContext } from 'react'
import { useDispatch } from 'react-redux'
import TimebarComponent, { TimelineContext } from '@globalfishingwatch/timebar'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { DEFAULT_WORKSPACE } from 'data/config'
import { setHighlightedTime, disableHighlightedTime } from './timebar.slice'
import TimebarSettings from './TimebarSettings'

const SomeTimebarChildren = () => {
  const { outerScale, outerHeight } = useContext(TimelineContext)
  const startX = outerScale(new Date(2019, 1, 1))
  const endX = outerScale(new Date(2019, 1, 10))

  return (
    <div
      style={{
        background: 'red',
        position: 'relative',
        left: startX,
        width: endX - startX,
        top: outerHeight / 2 - 5,
        height: 10,
      }}
    ></div>
  )
}

const TimebarWrapper = () => {
  const { start, end, dispatchTimerange } = useTimerangeConnect()

  const dispatch = useDispatch()

  return (
    <Fragment>
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
        {() => {
          return <SomeTimebarChildren />
        }}
      </TimebarComponent>
      <TimebarSettings />
    </Fragment>
  )
}

export default memo(TimebarWrapper)
