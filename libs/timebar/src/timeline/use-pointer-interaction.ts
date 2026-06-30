import type React from 'react'
import type { RefObject } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import type { NumberValue } from 'd3-scale'
import { scaleTime } from 'd3-scale'

import { getUTCDate } from '@globalfishingwatch/data-transforms'

import { EVENT_SOURCE } from '../constants'
import { clampToAbsoluteBoundaries, getDeltaMs, isMoreThanADay } from '../utils'

import type {
  Dragging,
  RangeRef,
  SetTimelineState,
  TimelineLatestPropsRef,
  TimelineStateRef,
  TimeScaleRef,
} from './timeline-drag.utils'
import {
  DRAG_END,
  DRAG_INNER,
  DRAG_START,
  getIsHandlerZoomingIn,
  getIsHandlerZoomingOut,
  resolveDragSource,
  resolveStickRange,
} from './timeline-drag.utils'

type Params = {
  stateRef: TimelineStateRef
  propsRef: TimelineLatestPropsRef
  rangeRef: RangeRef
  innerScaleRef: TimeScaleRef
  outerScaleRef: TimeScaleRef
  setState: SetTimelineState
  beginInteraction: () => void
  endInteraction: () => void
  nodeRef: RefObject<HTMLDivElement | null>
  hover: {
    report: (x: number, scale: (arg: NumberValue) => Date, isDay: boolean) => void
    leave: () => void
  }
}

export function usePointerInteraction({
  stateRef,
  propsRef,
  rangeRef,
  innerScaleRef,
  outerScaleRef,
  setState,
  beginInteraction,
  endInteraction,
  nodeRef,
  hover,
}: Params) {
  const lastXRef = useRef(0)
  const hasDraggedRef = useRef(false)

  const onMouseDown = useCallback(
    (event: React.SyntheticEvent<Element, Event>, dragging: Dragging) => {
      const { outerX } = stateRef.current
      const clientX =
        (event as React.MouseEvent).clientX || (event as React.TouchEvent).changedTouches[0].clientX
      lastXRef.current = clientX
      hasDraggedRef.current = false
      const x = clientX - outerX

      beginInteraction()
      setState({ dragging, handlerMouseX: x })
    },
    [stateRef, beginInteraction, setState]
  )

  useEffect(() => {
    const onMouseMoveWindow = (event: MouseEvent | TouchEvent) => {
      const { absoluteStart, absoluteEnd, notifyChange } = propsRef.current
      const { start, end } = rangeRef.current
      const { dragging, outerX, innerStartPx, innerEndPx, outerWidth } = stateRef.current
      const clientX =
        (event as MouseEvent).clientX ||
        ((event as TouchEvent).changedTouches && (event as TouchEvent).changedTouches[0].clientX)
      if (clientX === undefined) {
        return
      }
      const x = clientX - outerX
      const isMovingInside =
        nodeRef.current?.contains(event.target as Node) && x > innerStartPx && x < innerEndPx
      const isNodeInside = (event.target as any).contains(nodeRef.current) // TODO: fix this

      const isDraggingInner = dragging === DRAG_INNER
      const isDraggingZoomIn =
        getIsHandlerZoomingIn(x, { dragging, innerStartPx, innerEndPx }).isValid === true
      const isDraggingZoomOut =
        getIsHandlerZoomingOut(x, { dragging, innerStartPx, innerEndPx, outerWidth }) === true

      if (isMovingInside || isNodeInside) {
        setState({ isMovingInside: true })
      }

      if (
        (isMovingInside || isNodeInside) &&
        !isDraggingInner &&
        !isDraggingZoomIn &&
        !isDraggingZoomOut
      ) {
        const isDay = !isMoreThanADay(start, end)
        hover.report(x, outerScaleRef.current.invert, isDay)
      } else {
        hover.leave()
      }

      if (isDraggingInner) {
        hasDraggedRef.current = true
        const currentDeltaMs = getDeltaMs(start, end)
        // Calculates x movement from last event since TouchEvent doesn't have the movementX property
        const movementX = clientX - lastXRef.current
        lastXRef.current =
          (event as MouseEvent).clientX || (event as TouchEvent).changedTouches[0].clientX
        const newStart = innerScaleRef.current.invert(-movementX)
        if (!isNaN(newStart.getTime())) {
          const newEnd = getUTCDate(newStart.getTime() + currentDeltaMs)
          const { newStartClamped, newEndClamped } = clampToAbsoluteBoundaries(
            newStart.toISOString(),
            newEnd.toISOString(),
            currentDeltaMs,
            absoluteStart,
            absoluteEnd
          )
          notifyChange(newStartClamped, newEndClamped, EVENT_SOURCE.SEEK_MOVE, false)
          // notifyChange advanced the shared rangeRef synchronously; rebuild the inner
          // scale to match so the next mousemove anchors on the emitted position.
          innerScaleRef.current = scaleTime()
            .domain([getUTCDate(newStartClamped), getUTCDate(newEndClamped)])
            .range([0, innerScaleRef.current.range()[1]])
        }
      } else if (isDraggingZoomIn) {
        setState({ handlerMouseX: x, outerDrag: false })
      } else if (isDraggingZoomOut) {
        setState({ handlerMouseX: x, outerDrag: true })
      }
    }

    const onMouseUpWindow = (event: MouseEvent | TouchEvent) => {
      const { notifyChange, stickToUnit } = propsRef.current
      const { start, end } = rangeRef.current
      const { dragging, outerX, innerStartPx, innerEndPx } = stateRef.current

      if (dragging === null) {
        return
      }
      const clientX =
        (event as MouseEvent).clientX ||
        ((event as TouchEvent).changedTouches && (event as TouchEvent).changedTouches[0].clientX) ||
        0
      const x = clientX - outerX

      const handlerZoomInValid = getIsHandlerZoomingIn(x, { dragging, innerStartPx, innerEndPx })

      const isZoomOut =
        (dragging === DRAG_START || dragging === DRAG_END) && !handlerZoomInValid.isZoomIn

      let newStart: string | null = start
      let newEnd: string | null = end

      if (handlerZoomInValid.isZoomIn) {
        const liveScale = scaleTime()
          .domain([getUTCDate(start), getUTCDate(end)])
          .range([0, innerEndPx - innerStartPx])
        const invertedDate = liveScale.invert(handlerZoomInValid.clampedX - innerStartPx)
        if (!isNaN(invertedDate.getTime())) {
          if (dragging === DRAG_START) {
            newStart = invertedDate.toISOString()
          } else if (dragging === DRAG_END) {
            newEnd = invertedDate.toISOString()
          }
        }
      }

      const startDir = isZoomOut && dragging === DRAG_START ? 'floor' : 'nearest'
      const endDir = isZoomOut && dragging === DRAG_END ? 'ceil' : 'nearest'
      const sticked = resolveStickRange(newStart!, newEnd!, start, end, stickToUnit, {
        startDir,
        endDir,
      })
      const source = resolveDragSource(isZoomOut, dragging)

      notifyChange(sticked.start!, sticked.end!, source)
      endInteraction()
      setState({ dragging: null, handlerMouseX: 0, outerDrag: false })
    }

    // touchcancel (and any other aborted gesture) never reaches mouseup, so reset the
    // interaction guard explicitly. Otherwise interactingRef would stay set and the
    // timebar would silently stop adopting external range changes.
    const onInteractionCancel = () => {
      if (stateRef.current.dragging === null) {
        return
      }
      endInteraction()
      setState({ dragging: null, handlerMouseX: 0, outerDrag: false })
    }

    window.addEventListener('mousemove', onMouseMoveWindow)
    window.addEventListener('touchmove', onMouseMoveWindow)
    window.addEventListener('mouseup', onMouseUpWindow)
    window.addEventListener('touchend', onMouseUpWindow)
    window.addEventListener('touchcancel', onInteractionCancel)

    return () => {
      window.removeEventListener('mousemove', onMouseMoveWindow)
      window.removeEventListener('touchmove', onMouseMoveWindow)
      window.removeEventListener('mouseup', onMouseUpWindow)
      window.removeEventListener('touchend', onMouseUpWindow)
      window.removeEventListener('touchcancel', onInteractionCancel)
      endInteraction()
    }
    // Mounted once: reads happen through stable refs/callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { onMouseDown, hasDraggedRef }
}
