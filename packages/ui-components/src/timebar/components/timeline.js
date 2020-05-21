import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import cx from 'classnames'
import { scaleTime } from 'd3-scale'
import dayjs from 'dayjs'
import throttle from 'lodash/throttle'
import { animated, Spring } from 'react-spring/renderprops'
import ResizeObserver from 'resize-observer-polyfill'

import ImmediateContext from '../immediateContext'
import {
  getTime,
  clampToAbsoluteBoundaries,
  getDeltaMs,
  isMoreThanADay,
  stickToClosestUnit,
} from '../utils/internal-utils'

import Bookmark from './bookmark'
import TimelineUnits from './timeline-units'
import Handler from './timeline-handler'
import styles from './timeline.module.css'

const DRAG_INNER = 'DRAG_INNER'
const DRAG_START = 'DRAG_START'
const DRAG_END = 'DRAG_END'

export const TimelineContext = React.createContext({})

class Timeline extends PureComponent {
  static contextType = ImmediateContext

  getOuterScale = memoize((outerStart, outerEnd, outerWidth) =>
    scaleTime()
      .domain([new Date(outerStart), new Date(outerEnd)])
      .range([0, outerWidth])
  )

  getOverallScale = memoize((absoluteStart, absoluteEnd, innerWidth) =>
    scaleTime()
      .domain([new Date(absoluteStart), new Date(absoluteEnd)])
      .range([0, innerWidth])
  )

  getSvgTransform = memoize((overallScale, start, end, innerWidth, innerStartPx) => {
    const startX = overallScale(new Date(start))
    const endX = overallScale(new Date(end))
    const deltaX = endX - startX
    const scaleX = innerWidth / deltaX

    const t = `translate(${innerStartPx}, 0) scale(${scaleX}, 1) translate(${-startX}, 0)`
    return t
  })

  constructor() {
    super()
    this.state = {
      innerStartPx: 0,
      innerEndPx: 0,
      innerWidth: 50,
      outerWidth: 100,
      outerHeight: 50,
      dragging: null,
    }
    this.graphContainer = null
    this.isMovingInside = false
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('touchmove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('touchend', this.onMouseUp)
    this.requestAnimationFrame = window.requestAnimationFrame(this.onEnterFrame)

    // wait for end of call stack to get rendered CSS
    window.setTimeout(this.onWindowResize, 10)
    if (window.ResizeObserver) {
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
    window.cancelAnimationFrame(this.requestAnimationFrame)

    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.node)
    }
  }

  onWindowResize = () => {
    if (this.graphContainer !== null) {
      const graphStyle = window.getComputedStyle(this.graphContainer)
      const outerX = parseFloat(this.graphContainer.getBoundingClientRect().left)
      const relativeOffsetX = -this.node.offsetLeft
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

  isHandlerZoomInValid(x) {
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

  isHandlerZoomOutValid(x) {
    const { dragging, innerStartPx, innerEndPx, outerWidth } = this.state
    return (
      (dragging === DRAG_START && x < innerStartPx && x > 0) ||
      (dragging === DRAG_END && x > innerEndPx && x < outerWidth)
    )
  }

  onEnterFrame = (timestamp) => {
    if (this.frameTimestamp === undefined) {
      this.frameTimestamp = timestamp
    }
    const progress = timestamp - this.frameTimestamp
    this.frameTimestamp = timestamp

    if (this.state.outerDrag === true) {
      const { dragging, innerStartPx, innerEndPx, outerWidth, handlerMouseX } = this.state
      const { start, end, absoluteStart, absoluteEnd, onChange } = this.props
      // console.log(progress);
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
        newStart = new Date(getTime(start) - offsetMs).toISOString()
      } else if (dragging === DRAG_END) {
        newEnd = new Date(getTime(end) + offsetMs).toISOString()
      }

      const { newStartClamped, newEndClamped } = clampToAbsoluteBoundaries(
        newStart,
        newEnd,
        getDeltaMs(start, end),
        absoluteStart,
        absoluteEnd
      )
      onChange(newStartClamped, newEndClamped, dragging === DRAG_END)
    }

    this.requestAnimationFrame = window.requestAnimationFrame(this.onEnterFrame)
  }

  onMouseDown = (event, dragging) => {
    const { outerX } = this.state
    const clientX = event.clientX || event.changedTouches[0].clientX
    this.lastX = clientX
    const x = clientX - outerX

    this.setState({
      dragging,
      handlerMouseX: x,
    })
  }

  throttledMouseMove = throttle((clientX, scale, isDay) => {
    this.props.onMouseMove(clientX, scale, isDay)
  }, 16)

  notifyMouseLeave = () => {
    this.throttledMouseMove(null, null, null)
  }

  onMouseMove = (event) => {
    const { start, end, absoluteStart, absoluteEnd, onChange, onMouseLeave } = this.props
    const { dragging, outerX, innerStartPx, innerEndPx } = this.state
    const clientX = event.clientX || (event.changedTouches && event.changedTouches[0].clientX)
    if (clientX === undefined) {
      return
    }
    const x = clientX - outerX
    const isMovingInside = this.node.contains(event.target) && x > innerStartPx && x < innerEndPx
    if (isMovingInside) {
      this.isMovingInside = true
      const isDay = !isMoreThanADay(start, end)
      this.throttledMouseMove(x, this.outerScale.invert, isDay)
    } else if (this.isMovingInside === true) {
      this.isMovingInside = false
      onMouseLeave()
      this.notifyMouseLeave()
    }

    const isDraggingInner = dragging === DRAG_INNER
    const isDraggingZoomIn = this.isHandlerZoomInValid(x).isValid === true
    const isDraggingZoomOut = this.isHandlerZoomOutValid(x) === true

    if (isDraggingInner || isDraggingZoomIn || isDraggingZoomOut) {
      // trigger setting immediate only once, when any drag interaction starts
      // this can't be done in onMouseDown because it would disable click interaction on graph or tmln units
      if (this.context.immediate === false) {
        this.context.toggleImmediate(true)
      }
    }

    if (isDraggingInner) {
      const currentDeltaMs = getDeltaMs(start, end)
      // Calculates x movement from last event since TouchEvent doesn't have the movementX property
      const movementX = clientX - this.lastX
      this.lastX = event.clientX || event.changedTouches[0].clientX
      const newStart = this.innerScale.invert(-movementX)
      const newEnd = new Date(newStart.getTime() + currentDeltaMs)
      const { newStartClamped, newEndClamped } = clampToAbsoluteBoundaries(
        newStart.toISOString(),
        newEnd.toISOString(),
        currentDeltaMs,
        absoluteStart,
        absoluteEnd
      )
      onChange(newStartClamped, newEndClamped, dragging === DRAG_END)
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

  onMouseUp = (event) => {
    const { start, end, onChange } = this.props
    const { dragging, outerX, innerStartPx } = this.state

    if (dragging === null) {
      return
    }
    this.context.toggleImmediate(false)

    const clientX = event.clientX || (event.changedTouches && event.changedTouches[0].clientX) || 0
    const x = clientX - outerX

    const isHandlerZoomInValid = this.isHandlerZoomInValid(x)

    this.setState({
      dragging: null,
      handlerMouseX: null,
      outerDrag: false,
    })

    let newStart = start
    let newEnd = end

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
    const stickUnit = isMoreThanADay(newStart, newEnd) ? 'day' : 'hour'
    newStart = stickToClosestUnit(newStart, stickUnit)
    newEnd = stickToClosestUnit(newEnd, stickUnit)

    onChange(newStart, newEnd)
  }

  render() {
    const {
      start,
      end,
      absoluteStart,
      absoluteEnd,
      bookmarkStart,
      bookmarkEnd,
      onChange,
      onBookmarkChange,
      showLastUpdate,
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
    const { immediate } = this.context

    this.innerScale = scaleTime()
      .domain([new Date(start), new Date(end)])
      .range([0, innerWidth])
    const outerStart = this.innerScale.invert(-innerStartPx).toISOString()
    const outerEnd = this.innerScale.invert(outerWidth - innerStartPx).toISOString()

    this.outerScale = this.getOuterScale(outerStart, outerEnd, this.state.outerWidth)
    const overallScale = this.getOverallScale(absoluteStart, absoluteEnd, innerWidth)
    const svgTransform = this.getSvgTransform(overallScale, start, end, innerWidth, innerStartPx)

    const lastUpdatePosition = this.outerScale(new Date(absoluteEnd))
    return (
      <TimelineContext.Provider
        value={{
          outerScale: this.outerScale,
          outerStart,
          outerEnd,
          outerWidth,
          outerHeight,
          graphHeight: outerHeight,
          innerWidth,
          innerStartPx,
          innerEndPx,
          overallScale,
          svgTransform,
          tooltipContainer: this.tooltipContainer,
        }}
      >
        <div
          ref={(node) => (this.node = node)}
          className={cx(styles.Timeline, { [styles._disabled]: immediate })}
        >
          {bookmarkStart !== undefined && bookmarkStart !== null && bookmarkStart !== '' && (
            <Bookmark
              scale={this.outerScale}
              bookmarkStart={bookmarkStart}
              bookmarkEnd={bookmarkEnd}
              minX={relativeOffsetX}
              maxX={outerWidth}
              onDelete={() => {
                onBookmarkChange(null, null)
              }}
              onSelect={() => {
                onChange(bookmarkStart, bookmarkEnd)
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
            <div
              className={styles.graph}
              onMouseDown={(event) => {
                this.onMouseDown(event, DRAG_INNER)
              }}
              onTouchStart={(event) => {
                this.onMouseDown(event, DRAG_INNER)
              }}
            >
              <TimelineUnits
                start={start}
                end={end}
                absoluteStart={absoluteStart}
                absoluteEnd={absoluteEnd}
                outerScale={this.outerScale}
                outerStart={outerStart}
                outerEnd={outerEnd}
                onChange={onChange}
              />
              {/* // TODO still need to pass props? */}
              {this.props.children && this.props.children()}
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
            onMouseDown={(event) => {
              this.onMouseDown(event, DRAG_START)
            }}
            onTouchStart={(event) => {
              this.onMouseDown(event, DRAG_START)
            }}
            dragging={this.state.dragging === DRAG_START}
            x={innerStartPx}
            mouseX={this.state.handlerMouseX}
          />
          <Handler
            onMouseDown={(event) => {
              this.onMouseDown(event, DRAG_END)
            }}
            onTouchStart={(event) => {
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
          {showLastUpdate && lastUpdatePosition <= outerWidth && (
            <Spring native immediate={immediate} to={{ left: lastUpdatePosition }}>
              {(style) => (
                <animated.div className={styles.absoluteEnd} style={style}>
                  <div className={cx(styles.lastUpdate, styles.lastUpdateLabel)}>Last Update</div>
                  <div className={styles.lastUpdate}>
                    {dayjs(absoluteEnd).format('MMMM D YYYY')}
                  </div>
                </animated.div>
              )}
            </Spring>
          )}
        </div>
      </TimelineContext.Provider>
    )
  }
}

Timeline.propTypes = {
  onChange: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  children: PropTypes.func.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  absoluteStart: PropTypes.string.isRequired,
  absoluteEnd: PropTypes.string.isRequired,
  onBookmarkChange: PropTypes.func,
  bookmarkStart: PropTypes.string,
  bookmarkEnd: PropTypes.string,
  showLastUpdate: PropTypes.bool,
}

Timeline.defaultProps = {
  bookmarkStart: null,
  bookmarkEnd: null,
  onBookmarkChange: () => {},
  onMouseLeave: () => {},
  onMouseMove: () => {},
  showLastUpdate: true,
}

export default Timeline
