import type React from 'react'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import type { NumberValue, ScaleTime } from 'd3-scale'
import { scaleTime } from 'd3-scale'
import { throttle } from 'es-toolkit'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'
import ResizeObserver from 'resize-observer-polyfill'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { FOURWINGS_INTERVALS_ORDER, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import TimebarDeckglWrapper from '../charts/charts.deck'
import Bookmark from '../components/bookmark'
import { EVENT_SOURCE } from '../constants'
import { useTimebar } from '../timebar-context'
import type {
  StickUnit,
  TimebarLocale,
  TimebarMouseLeaveHandler,
  TimebarMouseMoveHandler,
  TrackGraphOrientation,
} from '../timeline/timeline-context'
import { TimelineContext } from '../timeline/timeline-context'
import {
  clampToAbsoluteBoundaries,
  getDeltaMs,
  getLastX,
  getTime,
  isMoreThanADay,
  stickToClosestUnit,
} from '../utils'

import Handler from './timeline-handler'
import TimelineUnits from './timeline-units'

import styles from './timeline.module.css'

const DRAG_INNER = 'DRAG_INNER'
const DRAG_START = 'DRAG_START'
const DRAG_END = 'DRAG_END'

type TimebarTimelineProps = {
  children?: React.ReactNode
  locale?: TimebarLocale
  fullWidth?: boolean
  showLast30DaysBtn?: boolean
  bookmarkPlacement?: string
  trackGraphOrientation?: TrackGraphOrientation
  stickToUnit?: (start: string, end: string) => StickUnit
  displayWarningWhenInFuture?: boolean
  onMouseLeave?: TimebarMouseLeaveHandler
  onMouseMove?: TimebarMouseMoveHandler
  onGraphClick?: (toggle: boolean) => void
  showDeckStats?: boolean
}

type Dragging = 'DRAG_START' | 'DRAG_END' | 'DRAG_INNER'

type TimelineState = {
  innerStartPx: number
  innerEndPx: number
  innerWidth: number
  outerWidth: number
  outerHeight: number
  dragging: Dragging | null
  isMovingInside: boolean
  outerDrag: boolean
  outerX: number
  handlerMouseX: number
  relativeOffsetX: number
}

const INITIAL_STATE: TimelineState = {
  innerStartPx: 0,
  innerEndPx: 0,
  innerWidth: 50,
  outerWidth: 100,
  outerHeight: 50,
  dragging: null,
  isMovingInside: false,
  outerDrag: false,
  outerX: 0,
  handlerMouseX: 0,
  relativeOffsetX: 0,
}

export const TimebarTimeline = ({
  children,
  locale = 'en',
  fullWidth = false,
  showLast30DaysBtn = true,
  bookmarkPlacement = 'top',
  trackGraphOrientation = 'mirrored',
  stickToUnit,
  displayWarningWhenInFuture = true,
  onMouseMove,
  onGraphClick,
  showDeckStats = false,
}: TimebarTimelineProps) => {
  const {
    notifyChange,
    labels,
    absoluteStart,
    absoluteEnd,
    latestAvailableDataDate,
    onBookmarkChange,
    start,
    end,
    bookmarkStart,
    bookmarkEnd,
  } = useTimebar()
  const [state, setStateRaw] = useState<TimelineState>(INITIAL_STATE)
  const [tooltipContainer, setTooltipContainer] = useState<Element | null>(null)

  const setState = useCallback((patch: Partial<TimelineState>) => {
    setStateRaw((prev) => ({ ...prev, ...patch }))
  }, [])

  // Mirrors read by the window-level handlers / rAF loop (kept current via the
  // sync effect below), plus persistent instance values that must not trigger a render.
  const stateRef = useRef(state)
  const propsRef = useRef({
    start,
    end,
    absoluteStart,
    absoluteEnd,
    notifyChange,
    onMouseMove,
    stickToUnit,
    latestAvailableDataDate,
  })
  const innerScaleRef = useRef<ScaleTime<number, number, never>>(scaleTime())
  const outerScaleRef = useRef<ScaleTime<number, number, never>>(scaleTime())
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const graphContainerRef = useRef<HTMLDivElement | null>(null)
  const lastXRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const frameTimestampRef = useRef(0)

  const setNode = useCallback((el: HTMLDivElement | null) => {
    nodeRef.current = el
  }, [])
  const setGraphContainer = useCallback((el: HTMLDivElement | null) => {
    graphContainerRef.current = el
  }, [])

  // ---- Pure render computations ----
  const innerWidth = fullWidth ? state.outerWidth : state.innerWidth
  const innerStartPx = fullWidth ? 1 : state.innerStartPx
  const innerEndPx = fullWidth ? state.outerWidth : state.innerEndPx

  const innerScale = useMemo(
    () =>
      scaleTime()
        .domain([getUTCDate(start), getUTCDate(end)])
        .range([0, innerWidth]),
    [start, end, innerWidth]
  )

  const outerStartDate = innerScale.invert(-innerStartPx)
  const outerEndDate = innerScale.invert(state.outerWidth - innerStartPx)
  const outerStart = isNaN(outerStartDate.getTime()) ? start : outerStartDate.toISOString()
  const outerEnd = isNaN(outerEndDate.getTime()) ? end : outerEndDate.toISOString()

  const outerScale = useMemo(
    () =>
      scaleTime()
        .domain([getUTCDate(outerStart), getUTCDate(outerEnd)])
        .range([0, state.outerWidth]),
    [outerStart, outerEnd, state.outerWidth]
  )

  const overallScale = useMemo(
    () =>
      scaleTime()
        .domain([getUTCDate(absoluteStart), getUTCDate(absoluteEnd)])
        .range([0, innerWidth]),
    [absoluteStart, absoluteEnd, innerWidth]
  )

  // Keep the handler mirrors current after every commit.
  useEffect(() => {
    stateRef.current = state
    // While dragging, the window handlers own start/end (they advance them optimistically).
    // The committed props lag the drag (async atom -> render -> effect), so syncing them
    // here would snap the cursor backward and cause jitter. Keep the in-flight value.
    const keepDragCursor = stateRef.current.dragging !== null
    propsRef.current = {
      start: keepDragCursor ? propsRef.current.start : start,
      end: keepDragCursor ? propsRef.current.end : end,
      absoluteStart,
      absoluteEnd,
      notifyChange,
      onMouseMove,
      stickToUnit,
      latestAvailableDataDate,
    }
    if (!keepDragCursor) {
      innerScaleRef.current = innerScale
    }
    outerScaleRef.current = outerScale
  })

  const onMouseDown = useCallback(
    (event: React.SyntheticEvent<Element, Event>, dragging: Dragging) => {
      const { outerX } = stateRef.current
      const clientX =
        (event as React.MouseEvent).clientX || (event as React.TouchEvent).changedTouches[0].clientX
      lastXRef.current = clientX
      hasDraggedRef.current = false
      const x = clientX - outerX

      setState({ dragging, handlerMouseX: x })
    },
    [setState]
  )

  const onLast30DaysClick = useCallback(() => {
    const { notifyChange, latestAvailableDataDate } = propsRef.current
    const { start, end } = getLastX(30, 'day', latestAvailableDataDate)
    if (start && end) {
      notifyChange(start, end)
    }
  }, [])

  // All imperative wiring (window listeners + the requestAnimationFrame zoom-out
  // loop + the resize observer) lives here, reading the mirrors above. Mounted once.
  useEffect(() => {
    const isHandlerZoomInValid = (x: number) => {
      const { dragging, innerStartPx, innerEndPx } = stateRef.current
      const isZoomIn =
        (dragging === DRAG_START && x > innerStartPx) || (dragging === DRAG_END && x < innerEndPx)
      const isValid =
        isZoomIn &&
        ((dragging === DRAG_START && x < innerEndPx - 20) ||
          (dragging === DRAG_END && x > innerStartPx + 20))
      const clampedX =
        dragging === DRAG_START ? Math.min(x, innerEndPx - 20) : Math.max(x, innerStartPx + 20)
      return { isZoomIn, isValid, clampedX }
    }

    const isHandlerZoomOutValid = (x: number) => {
      const { dragging, innerStartPx, innerEndPx, outerWidth } = stateRef.current
      return (
        (dragging === DRAG_START && x < innerStartPx && x > 0) ||
        (dragging === DRAG_END && x > innerEndPx && x < outerWidth)
      )
    }

    const throttledMouseMove = throttle(
      (clientX: number | null, scale: ((arg: NumberValue) => Date) | null, isDay?: boolean) => {
        propsRef.current.onMouseMove?.(clientX, scale, isDay)
      },
      60
    )

    const notifyMouseLeave = () => {
      if (stateRef.current.isMovingInside) {
        setStateRaw((prev) => ({ ...prev, isMovingInside: false }))
        throttledMouseMove(null, null, undefined)
      }
    }

    const onWindowResize = () => {
      const graphContainer = graphContainerRef.current
      if (graphContainer !== null && typeof window !== 'undefined') {
        const graphStyle = window.getComputedStyle(graphContainer)
        const boundingRect = graphContainer.getBoundingClientRect()
        if (!boundingRect.left || !boundingRect.width) {
          return
        }
        const outerX = boundingRect.left
        const relativeOffsetX = -(nodeRef.current?.offsetLeft ?? 0)
        const outerWidth = parseFloat(graphStyle.width)
        const outerHeight = parseFloat(graphStyle.height)
        setStateRaw((prev) => ({
          ...prev,
          outerX,
          innerStartPx: outerWidth * 0.15,
          innerEndPx: outerWidth * 0.85,
          innerWidth: outerWidth * 0.7,
          outerWidth,
          outerHeight,
          relativeOffsetX,
        }))
      }
    }

    const onMouseMoveWindow = (event: MouseEvent | TouchEvent) => {
      const { start, end, absoluteStart, absoluteEnd, notifyChange } = propsRef.current
      const { dragging, outerX, innerStartPx, innerEndPx } = stateRef.current
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
      const isDraggingZoomIn = isHandlerZoomInValid(x).isValid === true
      const isDraggingZoomOut = isHandlerZoomOutValid(x) === true
      if (isMovingInside || isNodeInside) {
        setStateRaw((prev) => ({ ...prev, isMovingInside: true }))
      }

      if (
        (isMovingInside || isNodeInside) &&
        !isDraggingInner &&
        !isDraggingZoomIn &&
        !isDraggingZoomOut
      ) {
        const isDay = !isMoreThanADay(start, end)
        throttledMouseMove(x, outerScaleRef.current.invert, isDay)
      } else {
        throttledMouseMove.cancel()
        notifyMouseLeave()
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
          // Optimistically advance the mirrors so the next mousemove anchors on the
          // emitted position rather than the stale (not-yet-committed) start/end.
          propsRef.current.start = newStartClamped
          propsRef.current.end = newEndClamped
          innerScaleRef.current = scaleTime()
            .domain([getUTCDate(newStartClamped), getUTCDate(newEndClamped)])
            .range([0, innerScaleRef.current.range()[1]])
        }
      } else if (isDraggingZoomIn) {
        setStateRaw((prev) => ({ ...prev, handlerMouseX: x, outerDrag: false }))
      } else if (isDraggingZoomOut) {
        setStateRaw((prev) => ({ ...prev, handlerMouseX: x, outerDrag: true }))
      }
    }

    const onMouseUpWindow = (event: MouseEvent | TouchEvent) => {
      const { start, end, notifyChange, stickToUnit } = propsRef.current
      const { dragging, outerX, innerStartPx, outerDrag } = stateRef.current

      if (dragging === null) {
        return
      }
      const clientX =
        (event as MouseEvent).clientX ||
        ((event as TouchEvent).changedTouches && (event as TouchEvent).changedTouches[0].clientX) ||
        0
      const x = clientX - outerX

      const handlerZoomInValid = isHandlerZoomInValid(x)

      let newStart: string | null = start
      let newEnd: string | null = end

      if (handlerZoomInValid.isZoomIn) {
        const invertedDate = innerScaleRef.current.invert(
          handlerZoomInValid.clampedX - innerStartPx
        )
        if (!isNaN(invertedDate.getTime())) {
          if (dragging === DRAG_START) {
            newStart = invertedDate.toISOString()
          } else if (dragging === DRAG_END) {
            newEnd = invertedDate.toISOString()
          }
        }
      }
      // on release, "stick" to day/hour
      const stickUnit = stickToUnit
        ? stickToUnit(newStart, newEnd)
        : (getFourwingsInterval(
            start,
            end,
            FOURWINGS_INTERVALS_ORDER
          ).toLowerCase() as DateTimeUnit)
      newStart = stickToClosestUnit(newStart, stickUnit)
      newEnd = stickToClosestUnit(newEnd, stickUnit)
      if (newStart && newEnd && newStart === newEnd) {
        const mDate = DateTime.fromISO(newStart, { zone: 'utc' })
        const mEndOf = mDate.plus({ [stickUnit]: 1 })
        newEnd = mEndOf.toISO()
      }

      let source
      if (outerDrag === true) {
        source = EVENT_SOURCE.ZOOM_OUT_RELEASE
      } else if (dragging === DRAG_INNER) {
        source = EVENT_SOURCE.SEEK_RELEASE
      } else {
        source = EVENT_SOURCE.ZOOM_IN_RELEASE
      }

      notifyChange(newStart!, newEnd!, source)
      setStateRaw((prev) => ({ ...prev, dragging: null, handlerMouseX: 0, outerDrag: false }))
    }

    let raf = 0
    const onEnterFrame = (timestamp: number) => {
      const progress = timestamp - frameTimestampRef.current
      frameTimestampRef.current = timestamp

      const current = stateRef.current
      if (current.outerDrag === true) {
        const { dragging, innerStartPx, innerEndPx, outerWidth, handlerMouseX } = current
        const { start, end, absoluteStart, absoluteEnd, notifyChange } = propsRef.current

        const deltaPxRatio =
          dragging === DRAG_START
            ? (innerStartPx - handlerMouseX) / innerStartPx
            : (handlerMouseX - innerEndPx) / (outerWidth - innerEndPx)

        const rawOffsetMs =
          (innerScaleRef.current.invert(0.6).getTime() -
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
        // Optimistically advance the mirror so the next frame builds on the emitted
        // range instead of the stale (not-yet-committed) start/end.
        propsRef.current.start = newStartClamped
        propsRef.current.end = newEndClamped
      }

      raf = window.requestAnimationFrame(onEnterFrame)
    }

    window.addEventListener('mousemove', onMouseMoveWindow)
    window.addEventListener('touchmove', onMouseMoveWindow)
    window.addEventListener('mouseup', onMouseUpWindow)
    window.addEventListener('touchend', onMouseUpWindow)
    raf = window.requestAnimationFrame(onEnterFrame)

    // wait for end of call stack to get rendered CSS
    const resizeTimeout = window.setTimeout(onWindowResize, 10)
    let resizeObserver: ResizeObserver | null = null
    if (window.ResizeObserver && nodeRef.current) {
      resizeObserver = new ResizeObserver(onWindowResize)
      resizeObserver.observe(nodeRef.current)
    } else {
      window.addEventListener('resize', onWindowResize)
    }

    const node = nodeRef.current
    return () => {
      window.removeEventListener('resize', onWindowResize)
      window.removeEventListener('mousemove', onMouseMoveWindow)
      window.removeEventListener('touchmove', onMouseMoveWindow)
      window.removeEventListener('mouseup', onMouseUpWindow)
      window.removeEventListener('touchend', onMouseUpWindow)
      window.cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimeout)
      throttledMouseMove.cancel()
      if (resizeObserver && node) {
        resizeObserver.unobserve(node)
      }
    }
  }, [])

  const { dragging, handlerMouseX, relativeOffsetX, outerWidth, outerHeight } = state

  const isInTheFuture =
    displayWarningWhenInFuture && getUTCDate(start) > getUTCDate(latestAvailableDataDate)

  return (
    <TimelineContext.Provider
      value={{
        outerStart: outerStart as string,
        outerEnd: outerEnd as string,
        outerWidth,
        graphHeight: outerHeight,
        overallScale,
        tooltipContainer,
        trackGraphOrientation,
      }}
    >
      <div
        ref={setNode}
        className={cx(styles.Timeline, {
          [styles.fullWidth]: fullWidth,
        })}
      >
        {bookmarkStart && bookmarkEnd && (
          <Bookmark
            labels={labels.bookmark}
            scale={outerScale}
            bookmarkStart={bookmarkStart}
            bookmarkEnd={bookmarkEnd}
            placement={bookmarkPlacement}
            minX={relativeOffsetX}
            maxX={outerWidth}
            locale={locale}
            onDelete={() => {
              if (onBookmarkChange) {
                onBookmarkChange('', '')
              }
            }}
            onSelect={() => {
              notifyChange(bookmarkStart, bookmarkEnd, EVENT_SOURCE.BOOKMARK_SELECT)
            }}
          />
        )}
        <div className={styles.graphContainer} ref={setGraphContainer}>
          {/* // TODO separated drag area? */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className={styles.graph}
            data-test="timeline-graph"
            onMouseDown={(event) => {
              onMouseDown(event, DRAG_INNER)
            }}
            onTouchStart={(event) => {
              onMouseDown(event, DRAG_INNER)
            }}
            onClick={() => !hasDraggedRef.current && onGraphClick?.(true)}
          >
            <TimelineUnits
              labels={labels}
              start={start}
              end={end}
              absoluteStart={absoluteStart}
              absoluteEnd={absoluteEnd}
              outerScale={outerScale}
              outerStart={outerStart as string}
              outerEnd={outerEnd as string}
              onChange={notifyChange}
              locale={locale}
            />
            {children}
            <TimebarDeckglWrapper showDeckStats={showDeckStats} />
          </div>
        </div>
        <div
          data-testid="timeline-tooltip-container"
          className={styles.tooltipContainer}
          ref={setTooltipContainer}
        />
        {!fullWidth && (
          <Fragment>
            <div
              className={cx(styles.veilLeft, styles.veil, {
                [styles._immediate]: dragging === DRAG_START,
              })}
              style={{
                width: dragging === DRAG_START ? handlerMouseX : innerStartPx,
              }}
            />
            <Handler
              dragLabel={labels.dragLabel}
              onMouseDown={(event) => {
                onMouseDown(event, DRAG_START)
              }}
              dragging={dragging === DRAG_START}
              x={innerStartPx}
              mouseX={handlerMouseX}
            />
            <Handler
              dragLabel={labels.dragLabel}
              onMouseDown={(event) => {
                onMouseDown(event, DRAG_END)
              }}
              dragging={dragging === DRAG_END}
              x={innerEndPx}
              mouseX={handlerMouseX}
            />
            <div
              className={cx(styles.veilRight, styles.veil, {
                [styles._immediate]: dragging === DRAG_END,
              })}
              style={{
                left: dragging === DRAG_END ? handlerMouseX : innerEndPx,
                width: dragging === DRAG_END ? outerWidth - handlerMouseX : outerWidth - innerEndPx,
              }}
            />
            {isInTheFuture && showLast30DaysBtn && (
              <div className={styles.last30Days}>
                <button
                  onClick={() => {
                    onLast30DaysClick()
                  }}
                >
                  ↩︎ {labels.timerange?.last30days}
                </button>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </TimelineContext.Provider>
  )
}
