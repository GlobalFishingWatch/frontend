import type React from 'react'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import type { ScaleTime } from 'd3-scale'
import { scaleTime } from 'd3-scale'

import { getUTCDate } from '@globalfishingwatch/data-transforms'

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
import { getLastX, useLatest } from '../utils'

import type { TimelineState } from './timeline-drag.utils'
import { DRAG_END, DRAG_INNER, DRAG_START, INITIAL_STATE } from './timeline-drag.utils'
import Handler from './timeline-handler'
import TimelineUnits from './timeline-units'
import { usePointerInteraction } from './use-pointer-interaction'
import { useTimelineHover } from './use-timeline-hover'
import { useTimelineLayout } from './use-timeline-layout'
import { useZoomOutLoop } from './use-zoom-out-loop'

import styles from './timeline.module.css'

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
    rangeRef,
    beginInteraction,
    endInteraction,
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

  // Fresh mirrors read by the window-level handlers / rAF loop. The live range is the
  // shared rangeRef (single writer: notifyChange), so it isn't mirrored here.
  const stateRef = useLatest(state)
  const propsRef = useLatest({
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

  // Keep the scale mirrors current after every commit. While dragging, the handlers
  // rebuild innerScaleRef themselves from the live range, so only adopt the committed
  // innerScale when idle (otherwise zoom handle pixels would map to the wrong domain).
  useEffect(() => {
    if (state.dragging === null) {
      innerScaleRef.current = innerScale
    }
    outerScaleRef.current = outerScale
  })

  const onLast30DaysClick = useCallback(() => {
    const { notifyChange, latestAvailableDataDate } = propsRef.current
    const { start, end } = getLastX(30, 'day', latestAvailableDataDate)
    if (start && end) {
      notifyChange(start, end)
    }
  }, [propsRef])

  const hover = useTimelineHover({ propsRef, stateRef, setState })
  useTimelineLayout({ nodeRef, graphContainerRef, setState })
  useZoomOutLoop({ stateRef, propsRef, rangeRef, innerScaleRef })
  const { onMouseDown, hasDraggedRef } = usePointerInteraction({
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
  })

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
