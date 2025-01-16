import React, { PureComponent } from 'react'
import cx from 'classnames'
import type { NumberValue, ScaleTime } from 'd3-scale'
import { scaleTime } from 'd3-scale'
import throttle from 'lodash/throttle'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'
import memoize from 'memoize-one'
import ResizeObserver from 'resize-observer-polyfill'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import { FOURWINGS_INTERVALS_ORDER,getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { EVENT_SOURCE } from '../constants'
import type { TimebarProps } from '../timebar'
import type { TrackGraphOrientation } from '../timelineContext'
import TimelineContext from '../timelineContext'
import { getLast30Days } from '../utils'
import {
  clampToAbsoluteBoundaries,
  getDeltaMs,
  getTime,
  isMoreThanADay,
  stickToClosestUnit,
} from '../utils/internal-utils'

import Bookmark from './bookmark'
import Handler from './timeline-handler'
import TimelineUnits from './timeline-units'

import styles from './timeline.module.css'

const DRAG_INNER = 'DRAG_INNER'
const DRAG_START = 'DRAG_START'
const DRAG_END = 'DRAG_END'

type TimelineProps = {
  labels: {
    zoomTo?: string
    dragLabel?: string
    lastUpdate?: string
    bookmark?: {
      goToBookmark?: string
      deleteBookmark?: string
    }
    timerange?: {
      title?: string
      start?: string
      end?: string
      last30days?: string
      last3months?: string
      last6months?: string
      lastYear?: string
      done?: string
    }
  }
  onChange: (start: string, end: string, source?: string, clampToEnd?: boolean) => void
  onMouseLeave?: TimebarProps['onMouseLeave']
  onMouseMove?: TimebarProps['onMouseMove']
  children?: React.ReactNode
  start: string
  end: string
  absoluteStart: string
  absoluteEnd: string
  latestAvailableDataDate: string
  onBookmarkChange?: (start: string, end: string) => void
  bookmarkStart?: string
  bookmarkEnd?: string
  bookmarkPlacement?: string
  stickToUnit?: (start: string, end: string) => 'day' | 'hour' | 'month' | 'year'
  displayWarningWhenInFuture?: boolean
  trackGraphOrientation: TrackGraphOrientation
  locale: string
}

type Dragging = 'DRAG_START' | 'DRAG_END' | 'DRAG_INNER'

type TimelineState = {
  innerStartPx: number
  innerEndPx: number
  innerWidth: number
  outerWidth: number
  outerHeight: number
  dragging: null
  isMovingInside: boolean
  outerDrag: boolean
  outerX: number
  handlerMouseX: number
  relativeOffsetX: number
}

class Timeline extends PureComponent<TimelineProps> {
  graphContainer: HTMLDivElement | null = null
  requestAnimationFrame: number | null = null
  resizeObserver: ResizeObserver | null = null
  node: any
  outerScale: ScaleTime<number, number, never> = scaleTime()
  innerScale: ScaleTime<number, number, never> = scaleTime()
  tooltipContainer: Element | null = null
  frameTimestamp: number = 0
  lastX: number = 0

  state: TimelineState

  static defaultProps = {
    labels: {
      dragLabel: 'Drag to change the time range',
      lastUpdate: 'Last update',
      bookmark: {
        goToBookmark: 'Go to your bookmarked time range',
        deleteBookmark: 'Delete time range bookmark',
      },
      timerange: {
        title: 'Select a time range',
        start: 'start',
        end: 'end',
        last30days: 'Last 30 days',
        last3months: 'Last 3 months',
        last6months: 'Last 6 months',
        lastYear: 'Last year',
        done: 'Done',
      },
    },
    bookmarkStart: null,
    bookmarkEnd: null,
    bookmarkPlacement: 'top',
    children: null,
    displayWarningWhenInFuture: true,
    onBookmarkChange: () => {
      // do nothing
    },
    onMouseLeave: () => {
      // do nothing
    },
    onMouseMove: () => {
      // do nothing
    },
  }

  getOuterScale = memoize((outerStart, outerEnd, outerWidth) =>
    scaleTime()
      .domain([getUTCDate(outerStart), getUTCDate(outerEnd)])
      .range([0, outerWidth])
  )

  getOverallScale = memoize((absoluteStart, absoluteEnd, innerWidth) =>
    scaleTime()
      .domain([getUTCDate(absoluteStart), getUTCDate(absoluteEnd)])
      .range([0, innerWidth])
  )

  getSvgTransform = memoize((overallScale, start, end, innerWidth, innerStartPx) => {
    const startX = overallScale(getUTCDate(start))
    const endX = overallScale(getUTCDate(end))
    const deltaX = endX - startX
    const scaleX = innerWidth / deltaX

    const t = `translate(${innerStartPx}, 0) scale(${scaleX}, 1) translate(${-startX}, 0)`
    return t
  })

  constructor(props: TimelineProps) {
    super(props)
    this.state = {
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
    this.graphContainer = null
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('touchmove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('touchend', this.onMouseUp)
    this.requestAnimationFrame = window.requestAnimationFrame(this.onEnterFrame)

    // wait for end of call stack to get rendered CSS
    window.setTimeout(this.onWindowResize, 10)
    if (window.ResizeObserver && this.node) {
      this.resizeObserver = new ResizeObserver(this.onWindowResize)
      this.resizeObserver.observe(this.node)
    } else {
      window.addEventListener('resize', this.onWindowResize)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('touchmove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('touchend', this.onMouseUp)
    if (this.requestAnimationFrame) {
      window.cancelAnimationFrame(this.requestAnimationFrame)
    }

    if (this.resizeObserver && this.node) {
      this.resizeObserver.unobserve(this.node)
    }
  }

  onWindowResize = () => {
    if (this.graphContainer !== null && typeof window !== 'undefined') {
      const graphStyle = window.getComputedStyle(this.graphContainer)
      const outerX = this.graphContainer.getBoundingClientRect().left
      const relativeOffsetX = -this.node?.offsetLeft
      const outerWidth = parseFloat(graphStyle.width)
      const outerHeight = parseFloat(graphStyle.height)
      const innerStartPx = outerWidth * 0.15
      const innerEndPx = outerWidth * 0.85
      const innerWidth = outerWidth * 0.7
      this.setState({
        outerX,
        innerStartPx,
        innerEndPx,
        innerWidth,
        outerWidth,
        outerHeight,
        relativeOffsetX,
      })
    }
  }

  isHandlerZoomInValid(x: number) {
    const { dragging, innerStartPx, innerEndPx } = this.state
    const isZoomIn =
      (dragging === DRAG_START && x > innerStartPx) || (dragging === DRAG_END && x < innerEndPx)

    // check that start handler doesn't go after end handler or end handler before start handler
    const isValid =
      isZoomIn &&
      ((dragging === DRAG_START && x < innerEndPx - 20) ||
        (dragging === DRAG_END && x > innerStartPx + 20))
    const clampedX =
      dragging === DRAG_START ? Math.min(x, innerEndPx - 20) : Math.max(x, innerStartPx + 20)
    return { isZoomIn, isValid, clampedX }
  }

  isHandlerZoomOutValid(x: number) {
    const { dragging, innerStartPx, innerEndPx, outerWidth } = this.state
    return (
      (dragging === DRAG_START && x < innerStartPx && x > 0) ||
      (dragging === DRAG_END && x > innerEndPx && x < outerWidth)
    )
  }

  onEnterFrame = (timestamp: number) => {
    if (this.frameTimestamp === undefined) {
      this.frameTimestamp = timestamp
    }
    const progress = timestamp - this.frameTimestamp
    this.frameTimestamp = timestamp

    if (this.state.outerDrag === true) {
      const { dragging, innerStartPx, innerEndPx, outerWidth, handlerMouseX } = this.state
      const { start, end, absoluteStart, absoluteEnd, onChange } = this.props

      const deltaPxRatio =
        dragging === DRAG_START
          ? (innerStartPx - handlerMouseX) / innerStartPx
          : (handlerMouseX - innerEndPx) / (outerWidth - innerEndPx)

      const offsetMs =
        (this.innerScale.invert(0.6).getTime() - this.innerScale.invert(0).getTime()) *
        progress *
        deltaPxRatio
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
      onChange(newStartClamped, newEndClamped, EVENT_SOURCE.ZOOM_OUT_MOVE, dragging === DRAG_END)
    }

    this.requestAnimationFrame = window.requestAnimationFrame(this.onEnterFrame)
  }

  onMouseDown = (event: React.SyntheticEvent<Element, Event>, dragging: Dragging) => {
    const { outerX } = this.state
    const clientX =
      (event as React.MouseEvent).clientX || (event as React.TouchEvent).changedTouches[0].clientX
    this.lastX = clientX
    const x = clientX - outerX

    this.setState({
      dragging,
      handlerMouseX: x,
    })
  }

  throttledMouseMove = throttle(
    (clientX: number | null, scale: ((arg: NumberValue) => Date) | null, isDay?: boolean) => {
      const { onMouseMove } = this.props
      if (onMouseMove) {
        onMouseMove(clientX, scale, isDay)
      }
    },
    60
  )

  notifyMouseLeave = () => {
    if (this.state.isMovingInside) {
      this.setState({ isMovingInside: false })
      this.throttledMouseMove(null, null, undefined)
    }
  }

  onMouseMove = (event: MouseEvent | TouchEvent) => {
    const { start, end, absoluteStart, absoluteEnd, onChange } = this.props
    const { dragging, outerX, innerStartPx, innerEndPx } = this.state
    const clientX =
      (event as MouseEvent).clientX ||
      ((event as TouchEvent).changedTouches && (event as TouchEvent).changedTouches[0].clientX)
    if (clientX === undefined) {
      return
    }
    const x = clientX - outerX
    const isMovingInside = this.node?.contains(event.target) && x > innerStartPx && x < innerEndPx
    const isNodeInside = (event.target as any).contains(this.node) // TODO: fix this

    const isDraggingInner = dragging === DRAG_INNER
    const isDraggingZoomIn = this.isHandlerZoomInValid(x).isValid === true
    const isDraggingZoomOut = this.isHandlerZoomOutValid(x) === true
    if (isMovingInside || isNodeInside) {
      this.setState({ isMovingInside: true })
    }

    if (
      (isMovingInside || isNodeInside) &&
      !isDraggingInner &&
      !isDraggingZoomIn &&
      !isDraggingZoomOut
    ) {
      const isDay = !isMoreThanADay(start, end)
      this.throttledMouseMove(x, this.outerScale.invert, isDay)
    } else {
      this.throttledMouseMove.cancel()
      this.notifyMouseLeave()
    }

    if (isDraggingInner) {
      const currentDeltaMs = getDeltaMs(start, end)
      // Calculates x movement from last event since TouchEvent doesn't have the movementX property
      const movementX = clientX - this.lastX
      this.lastX = (event as MouseEvent).clientX || (event as TouchEvent).changedTouches[0].clientX
      const newStart = this.innerScale.invert(-movementX)
      const newEnd = getUTCDate(newStart.getTime() + currentDeltaMs)
      const { newStartClamped, newEndClamped } = clampToAbsoluteBoundaries(
        newStart.toISOString(),
        newEnd.toISOString(),
        currentDeltaMs,
        absoluteStart,
        absoluteEnd
      )
      onChange(newStartClamped, newEndClamped, EVENT_SOURCE.SEEK_MOVE, dragging === DRAG_END)
    } else if (isDraggingZoomIn) {
      this.setState({
        handlerMouseX: x,
        outerDrag: false,
      })
    } else if (isDraggingZoomOut) {
      this.setState({
        handlerMouseX: x,
        outerDrag: true,
      })
    }
  }

  onMouseUp = (event: MouseEvent | TouchEvent) => {
    const { start, end, onChange, stickToUnit } = this.props
    const { dragging, outerX, innerStartPx, outerDrag } = this.state

    if (dragging === null) {
      return
    }
    const clientX =
      (event as MouseEvent).clientX ||
      ((event as TouchEvent).changedTouches && (event as TouchEvent).changedTouches[0].clientX) ||
      0
    const x = clientX - outerX

    const isHandlerZoomInValid = this.isHandlerZoomInValid(x)

    let newStart: string | null = start
    let newEnd: string | null = end

    if (isHandlerZoomInValid.isZoomIn) {
      if (dragging === DRAG_START) {
        newStart = this.innerScale
          .invert(isHandlerZoomInValid.clampedX - innerStartPx)
          .toISOString()
      } else if (dragging === DRAG_END) {
        newEnd = this.innerScale.invert(isHandlerZoomInValid.clampedX - innerStartPx).toISOString()
      }
    }
    // on release, "stick" to day/hour
    const stickUnit = stickToUnit
      ? stickToUnit(newStart, newEnd)
      : (getFourwingsInterval(start, end, FOURWINGS_INTERVALS_ORDER).toLowerCase() as DateTimeUnit)
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

    onChange(newStart!, newEnd!, source)
    this.setState({
      dragging: null,
      handlerMouseX: null,
      outerDrag: false,
    })
  }

  onLast30DaysClick() {
    const { onChange, latestAvailableDataDate } = this.props
    const { start, end } = getLast30Days(latestAvailableDataDate)
    if (start && end) {
      onChange(start, end)
    }
  }

  render() {
    const {
      labels,
      start,
      end,
      absoluteStart,
      absoluteEnd,
      bookmarkStart,
      bookmarkEnd,
      bookmarkPlacement,
      onChange,
      onBookmarkChange,
      trackGraphOrientation,
      latestAvailableDataDate,
      displayWarningWhenInFuture,
      locale,
    } = this.props
    const {
      dragging,
      handlerMouseX,
      innerStartPx,
      innerEndPx,
      innerWidth,
      relativeOffsetX,
      outerWidth,
      outerHeight,
    } = this.state

    this.innerScale = scaleTime()
      .domain([getUTCDate(start), getUTCDate(end)])
      .range([0, innerWidth])
    let outerStart
    try {
      outerStart = this.innerScale.invert(-innerStartPx).toISOString()
    } catch (e) {
      console.warn(e)
    }
    let outerEnd
    try {
      outerEnd = this.innerScale.invert(outerWidth - innerStartPx).toISOString()
    } catch (e) {
      console.warn(e)
    }
    this.outerScale = this.getOuterScale(outerStart, outerEnd, this.state.outerWidth)
    const overallScale = this.getOverallScale(absoluteStart, absoluteEnd, innerWidth)
    const svgTransform = this.getSvgTransform(overallScale, start, end, innerWidth, innerStartPx)

    const isInTheFuture =
      displayWarningWhenInFuture && getUTCDate(start) > getUTCDate(latestAvailableDataDate)

    return (
      <TimelineContext.Provider
        value={{
          start,
          end,
          outerScale: this.outerScale,
          outerStart: outerStart as string,
          outerEnd: outerEnd as string,
          outerWidth,
          outerHeight,
          graphHeight: outerHeight,
          innerWidth,
          innerStartPx,
          innerEndPx,
          overallScale,
          svgTransform,
          tooltipContainer: this.tooltipContainer as Element,
          trackGraphOrientation,
        }}
      >
        <div
          ref={(node: any) => {
            this.node = node
          }}
          className={cx(styles.Timeline)}
        >
          {bookmarkStart && bookmarkEnd && (
            <Bookmark
              labels={labels.bookmark}
              scale={this.outerScale}
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
                onChange(bookmarkStart, bookmarkEnd, EVENT_SOURCE.BOOKMARK_SELECT)
              }}
            />
          )}
          <div
            className={styles.graphContainer}
            ref={(ref) => {
              this.graphContainer = ref
            }}
          >
            {/* // TODO separated drag area? */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
              className={styles.graph}
              data-test="timeline-graph"
              onMouseDown={(event) => {
                this.onMouseDown(event, DRAG_INNER)
              }}
              onTouchStart={(event) => {
                this.onMouseDown(event, DRAG_INNER)
              }}
            >
              <TimelineUnits
                labels={labels}
                start={start}
                end={end}
                absoluteStart={absoluteStart}
                absoluteEnd={absoluteEnd}
                outerScale={this.outerScale}
                outerStart={outerStart as string}
                outerEnd={outerEnd as string}
                onChange={onChange}
                locale={locale}
              />
              {this.props.children}
            </div>
          </div>
          <div
            className={styles.tooltipContainer}
            ref={(el) => {
              this.tooltipContainer = el
            }}
          />
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
              this.onMouseDown(event, DRAG_START)
            }}
            dragging={this.state.dragging === DRAG_START}
            x={innerStartPx}
            mouseX={this.state.handlerMouseX}
          />
          <Handler
            dragLabel={labels.dragLabel}
            onMouseDown={(event) => {
              this.onMouseDown(event, DRAG_END)
            }}
            dragging={this.state.dragging === DRAG_END}
            x={innerEndPx}
            mouseX={this.state.handlerMouseX}
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
          {isInTheFuture && (
            <div className={styles.last30Days}>
              <button
                onClick={() => {
                  this.onLast30DaysClick()
                }}
              >
                ↩︎ {labels.timerange?.last30days}
              </button>
            </div>
          )}
        </div>
      </TimelineContext.Provider>
    )
  }
}

export default Timeline
