import { useEffect, useMemo, useRef } from 'react'
import type { NumberValue } from 'd3-scale'
import { throttle } from 'es-toolkit'

import type {
  SetTimelineState,
  TimelineLatestPropsRef,
  TimelineStateRef,
} from './timeline-drag.utils'

type Params = {
  propsRef: TimelineLatestPropsRef
  stateRef: TimelineStateRef
  setState: SetTimelineState
}

type MoveScale = (value: NumberValue) => Date

type ThrottledEmit = {
  (x: number | null, scale: MoveScale | null, isDay?: boolean): void
  cancel: () => void
}

export function useTimelineHover({ propsRef, stateRef, setState }: Params) {
  const emitRef = useRef<ThrottledEmit | null>(null)

  useEffect(() => {
    const emit = throttle(
      (x: number | null, scale: MoveScale | null, isDay?: boolean) =>
        propsRef.current.onMouseMove?.(x, scale, isDay),
      60
    )
    emitRef.current = emit
    return () => emit.cancel()
  }, [propsRef])

  return useMemo(
    () => ({
      report(x: number, scale: MoveScale, isDay: boolean) {
        emitRef.current?.(x, scale, isDay)
      },
      leave() {
        emitRef.current?.cancel()
        if (!stateRef.current.isMovingInside) return
        setState({ isMovingInside: false })
        emitRef.current?.(null, null) // clear the tooltip
      },
    }),
    [stateRef, setState]
  )
}
