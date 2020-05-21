import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import dayjs from 'dayjs'
import memoize from 'memoize-one'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'

import ImmediateContext from './immediateContext'
import {
  getTime,
  clampToAbsoluteBoundaries,
  getDeltaDays,
  isMoreThanADay,
} from './utils/internal-utils'
import { getHumanizedDates } from './utils'
import './timebar-settings.module.css'
import styles from './timebar.module.css'
import TimeRangeSelector from './components/timerange-selector'
import Timeline from './components/timeline'
import Playback from './components/playback'
import { ReactComponent as IconTimeRange } from './icons/timeRange.svg'
import { ReactComponent as IconBookmark } from './icons/bookmark.svg'
import { ReactComponent as IconBookmarkFilled } from './icons/bookmarkFilled.svg'
import { ReactComponent as IconMinus } from './icons/minus.svg'
import { ReactComponent as IconPlus } from './icons/plus.svg'
dayjs.extend(relativeTime)
dayjs.extend(utc)

const ONE_DAY_MS = 1000 * 60 * 60 * 24
const ONE_HOUR_MS = 1000 * 60 * 60
const MINIMUM_RANGE = ONE_HOUR_MS

const getRangeMs = (range, unit) => {
  const start = dayjs(new Date())
  const end = start.add(range, unit)
  return end.diff(start)
}

const clampToMinAndMax = (start, end, minMs, maxMs, clampToEnd) => {
  const delta = new Date(end).getTime() - new Date(start).getTime()
  let clampedEnd = end
  let clampedStart = start
  if (delta > maxMs) {
    if (clampToEnd === true) {
      clampedEnd = new Date(new Date(start).getTime() + maxMs).toISOString()
    } else {
      clampedStart = new Date(new Date(end).getTime() - maxMs).toISOString()
    }
  } else if (delta < minMs) {
    if (clampToEnd === true) {
      clampedEnd = new Date(new Date(start).getTime() + minMs).toISOString()
    } else {
      clampedStart = new Date(new Date(end).getTime() - minMs).toISOString()
    }
  }
  return { clampedStart, clampedEnd }
}

class Timebar extends Component {
  constructor() {
    super()
    this.toggleImmediate = (immediate) => {
      this.setState((state) => ({
        immediate,
      }))
    }
    this.interval = null
    this.state = {
      immediate: false,
      showTimeRangeSelector: false,
      absoluteEnd: null,
    }
  }

  getMaximumRangeMs = memoize((maximumRange, maximumRangeUnit) => {
    if (maximumRange === null) {
      return Number.POSITIVE_INFINITY
    }
    return getRangeMs(maximumRange, maximumRangeUnit)
  })

  getMinimumRangeMs = memoize((minimumRange, minimumRangeUnit) => {
    if (minimumRange === null) {
      return MINIMUM_RANGE
    }
    return getRangeMs(minimumRange, minimumRangeUnit)
  })

  componentDidMount() {
    const { start, end } = this.props

    // TODO stick to day/hour here too
    this.notifyChange(start, end)
  }

  static getDerivedStateFromProps(props) {
    // let absolute end run through the end of the day
    const absoluteEnd = dayjs(props.absoluteEnd).endOf('day').toISOString()
    return {
      absoluteEnd,
    }
  }

  toggleTimeRangeSelector = () => {
    this.setState((prevState) => ({
      showTimeRangeSelector: !prevState.showTimeRangeSelector,
    }))
  }

  setBookmark = () => {
    const { start, end, onBookmarkChange } = this.props
    onBookmarkChange !== null && onBookmarkChange(start, end)
  }

  onTimeRangeSelectorSubmit = (start, end) => {
    this.notifyChange(start, end)
    this.setState({
      showTimeRangeSelector: false,
    })
  }

  zoom = (zoom) => {
    const { start, end, absoluteStart, absoluteEnd } = this.props
    const delta = Math.round(getDeltaDays(start, end))

    let steps
    let nextDelta
    let nextUnit = 'day'

    if (zoom === 'in') {
      steps = [365, 32, 30, 7, 1]
      for (let s = 0; s < steps.length; s += 1) {
        const step = steps[s]
        if (delta > step) {
          nextDelta = step
          break
        }
      }
      // sub-day situation
      if (nextDelta === undefined) {
        nextDelta = 23.9
        nextUnit = 'hour'
      }
    } else if (zoom === 'out') {
      steps = [1, 7, 30, 32, 365]
      for (let s = 0; s < steps.length; s += 1) {
        const step = steps[s]
        // if (delta > step) {
        if (delta < step) {
          nextDelta = step
          break
        }
      }

      // more than 1 year situation
      if (nextDelta === undefined) {
        this.notifyChange(absoluteStart, absoluteEnd)
        return
      }
    }

    const unitOffsetMs = nextUnit === 'hour' ? ONE_DAY_MS / 24 : ONE_DAY_MS
    const middleMs = getTime(start) + (getTime(end) - getTime(start)) / 2
    const offsetMs = (nextDelta * unitOffsetMs) / 2
    const newStartMs = middleMs - offsetMs
    const mNewStart = dayjs(newStartMs).startOf(nextUnit)
    const newEnd = mNewStart.add(nextDelta, nextUnit).toISOString()

    const deltaMs = nextDelta * unitOffsetMs
    const { newStartClamped, newEndClamped } = clampToAbsoluteBoundaries(
      mNewStart.toISOString(),
      newEnd,
      deltaMs,
      absoluteStart,
      absoluteEnd
    )

    this.notifyChange(newStartClamped, newEndClamped)
  }

  notifyChange = (start, end, clampToEnd = false) => {
    const { clampedStart, clampedEnd } = clampToMinAndMax(
      start,
      end,
      this.minimumRangeMs,
      this.maximumRangeMs,
      clampToEnd
    )
    const { onChange } = this.props
    const { humanizedStart, humanizedEnd } = getHumanizedDates(clampedStart, clampedEnd)
    onChange(clampedStart, clampedEnd, humanizedStart, humanizedEnd)
  }

  onPlaybackTick = (newStart, newEnd) => {
    this.notifyChange(newStart, newEnd)
  }

  render() {
    const {
      start,
      end,
      absoluteStart,
      bookmarkStart,
      bookmarkEnd,
      enablePlayback,
      minimumRange,
      minimumRangeUnit,
      maximumRange,
      maximumRangeUnit,
    } = this.props
    const { immediate } = this.state

    // state.absoluteEnd overrides the value set in props.absoluteEnd - see getDerivedStateFromProps
    const { showTimeRangeSelector, absoluteEnd } = this.state

    this.maximumRangeMs = this.getMaximumRangeMs(maximumRange, maximumRangeUnit)
    this.minimumRangeMs = this.getMinimumRangeMs(minimumRange, minimumRangeUnit)

    const canZoomIn = isMoreThanADay(start, end)
    const deltaDays = getDeltaDays(start, end)
    const absoluteDeltaDays = getDeltaDays(absoluteStart, absoluteEnd)
    const canZoomOut = deltaDays <= absoluteDeltaDays - 1

    const hasBookmark =
      bookmarkStart !== undefined &&
      bookmarkStart !== null &&
      bookmarkEnd !== undefined &&
      bookmarkEnd !== null
    const bookmarkDisabled =
      hasBookmark &&
      getTime(bookmarkStart) === getTime(start) &&
      getTime(bookmarkEnd) === getTime(end)

    return (
      <ImmediateContext.Provider value={{ immediate, toggleImmediate: this.toggleImmediate }}>
        <div className={styles.Timebar}>
          {enablePlayback && (
            <Playback
              start={start}
              end={end}
              absoluteStart={absoluteStart}
              absoluteEnd={absoluteEnd}
              onTick={this.onPlaybackTick}
            />
          )}

          <div className={styles.timeActions}>
            {showTimeRangeSelector && (
              <TimeRangeSelector
                start={start}
                end={end}
                absoluteStart={absoluteStart}
                absoluteEnd={absoluteEnd}
                onSubmit={this.onTimeRangeSelectorSubmit}
                onDiscard={this.toggleTimeRangeSelector}
              />
            )}
            <div className={styles.timeRangeContainer}>
              <button
                type="button"
                title="Select a time range"
                className={cx(styles.uiButton, styles.timeRange)}
                disabled={immediate}
                onClick={this.toggleTimeRangeSelector}
              >
                <IconTimeRange />
              </button>
            </div>
            <button
              type="button"
              title="Bookmark current time range"
              className={cx(styles.uiButton, styles.bookmark)}
              onClick={this.setBookmark}
              disabled={immediate || bookmarkDisabled === true}
            >
              {hasBookmark ? <IconBookmarkFilled /> : <IconBookmark />}
            </button>
            <div className={styles.timeScale}>
              <button
                type="button"
                title="Zoom out"
                disabled={immediate || canZoomOut === false}
                onClick={() => {
                  this.zoom('out')
                }}
                className={cx(styles.uiButton, styles.out)}
              >
                <IconMinus />
              </button>
              <button
                type="button"
                title="Zoom in"
                disabled={immediate || canZoomIn === false}
                onClick={() => {
                  this.zoom('in')
                }}
                className={cx(styles.uiButton, styles.in)}
              >
                <IconPlus />
              </button>
            </div>
          </div>

          <Timeline
            children={this.props.children}
            start={start}
            end={end}
            onChange={this.notifyChange}
            onMouseLeave={this.props.onMouseLeave}
            onMouseMove={this.props.onMouseMove}
            absoluteStart={absoluteStart}
            absoluteEnd={absoluteEnd}
            onBookmarkChange={this.props.onBookmarkChange}
            bookmarkStart={bookmarkStart}
            bookmarkEnd={bookmarkEnd}
            showLastUpdate={this.props.showLastUpdate}
          />
        </div>
      </ImmediateContext.Provider>
    )
  }
}

Timebar.propTypes = {
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  bookmarkStart: PropTypes.string,
  bookmarkEnd: PropTypes.string,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onBookmarkChange: PropTypes.func,
  absoluteStart: PropTypes.string.isRequired,
  absoluteEnd: PropTypes.string.isRequired,
  enablePlayback: PropTypes.bool,
  minimumRange: PropTypes.number,
  minimumRangeUnit: PropTypes.string,
  maximumRange: PropTypes.number,
  maximumRangeUnit: PropTypes.string,
  showLastUpdate: PropTypes.bool,
}

Timebar.defaultProps = {
  bookmarkStart: null,
  bookmarkEnd: null,
  enablePlayback: false,
  onMouseLeave: () => {},
  onMouseMove: () => {},
  onBookmarkChange: () => {},
  minimumRange: null,
  minimumRangeUnit: 'day',
  maximumRange: null,
  maximumRangeUnit: 'month',
  showLastUpdate: true,
}

export default Timebar
