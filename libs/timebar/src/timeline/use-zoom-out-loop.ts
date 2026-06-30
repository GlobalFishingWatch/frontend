import { useEffect, useRef } from 'react'

import { getUTCDate } from '@globalfishingwatch/data-transforms'

import { EVENT_SOURCE } from '../constants'
import { clampToAbsoluteBoundaries, getDeltaMs, getTime } from '../utils'

import type {
  RangeRef,
  TimelineLatestPropsRef,
  TimelineStateRef,
  TimeScaleRef,
} from './timeline-drag.utils'
import { DRAG_END, DRAG_START, ZOOM_OUT_SPEED_PX } from './timeline-drag.utils'

type Params = {
  stateRef: TimelineStateRef
  propsRef: TimelineLatestPropsRef
  rangeRef: RangeRef
  innerScaleRef: TimeScaleRef
}

export function useZoomOutLoop({ stateRef, propsRef, rangeRef, innerScaleRef }: Params) {
  const frameTimestampRef = useRef(0)

  useEffect(() => {
    let raf = 0
    const onEnterFrame = (timestamp: number) => {
      const progress = timestamp - frameTimestampRef.current
      frameTimestampRef.current = timestamp

      const current = stateRef.current
      if (current.outerDrag === true) {
        const { dragging, innerStartPx, innerEndPx, outerWidth, handlerMouseX } = current
        const { absoluteStart, absoluteEnd, notifyChange } = propsRef.current
        const { start, end } = rangeRef.current

        const deltaPxRatio =
          dragging === DRAG_START
            ? (innerStartPx - handlerMouseX) / innerStartPx
            : (handlerMouseX - innerEndPx) / (outerWidth - innerEndPx)

        const rawOffsetMs =
          (innerScaleRef.current.invert(ZOOM_OUT_SPEED_PX).getTime() -
            innerScaleRef.current.invert(0).getTime()) *
          progress *
          deltaPxRatio
        const offsetMs = isNaN(rawOffsetMs) ? 0 : rawOffsetMs
        let newStart = start
        let newEnd = end

        if (dragging === DRAG_START) {
          newStart = getUTCDate(getTime(start) - offsetMs).toISOString()
        } else if (dragging === DRAG_END) {
          newEnd = getUTCDate(getTime(end) + offsetMs).toISOString()
        }

        const { newStartClamped, newEndClamped } = clampToAbsoluteBoundaries(
          newStart,
          newEnd,
          getDeltaMs(start, end),
          absoluteStart,
          absoluteEnd
        )
        notifyChange(
          newStartClamped,
          newEndClamped,
          EVENT_SOURCE.ZOOM_OUT_MOVE,
          dragging === DRAG_END
        )
      }

      raf = window.requestAnimationFrame(onEnterFrame)
    }

    raf = window.requestAnimationFrame(onEnterFrame)
    return () => window.cancelAnimationFrame(raf)
    // Mounted once: reads happen through stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
