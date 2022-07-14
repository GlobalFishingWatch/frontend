import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import dayjs from 'dayjs'
import memoize from 'memoize-one'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/en'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/id'
import { RecoilRoot } from 'recoil'
import ImmediateContext from './immediateContext'
import {
  getTime,
  clampToAbsoluteBoundaries,
  getDeltaDays,
  isMoreThanADay,
} from './utils/internal-utils'
// import './timebar-settings.css'
import styles from './timebar.module.css'
import TimeRangeSelector from './components/timerange-selector'
import Timeline from './components/timeline'
import Playback from './components/playback'
import { ReactComponent as IconTimeRange } from './icons/timeRange.svg'
import { ReactComponent as IconBookmark } from './icons/bookmark.svg'
import { ReactComponent as IconBookmarkFilled } from './icons/bookmarkFilled.svg'
import { ReactComponent as IconMinus } from './icons/minus.svg'
import { ReactComponent as IconPlus } from './icons/plus.svg'
import { EVENT_SOURCE } from './constants'

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
      this.setState({ immediate })
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
    this.notifyChange(start, end, EVENT_SOURCE.MOUNT)
  }

  static getDerivedStateFromProps(props) {
    // let absolute end run through the end of the day
    const absoluteEnd = dayjs(props.absoluteEnd).utc().endOf('day').toISOString()
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

  setLocale = memoize((locale) => dayjs.locale(locale))

  onTimeRangeSelectorSubmit = (start, end) => {
    this.notifyChange(start, end, EVENT_SOURCE.TIME_RANGE_SELECTOR)
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

    let source

    if (zoom === 'in') {
      source = EVENT_SOURCE.ZOOM_IN_BUTTON
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
      source = EVENT_SOURCE.ZOOM_OUT_BUTTON
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
        this.notifyChange(absoluteStart, absoluteEnd, source)
        return
      }
    }

    const unitOffsetMs = nextUnit === 'hour' ? ONE_DAY_MS / 24 : ONE_DAY_MS
    const middleMs = getTime(start) + (getTime(end) - getTime(start)) / 2
    const offsetMs = (nextDelta * unitOffsetMs) / 2
    const newStartMs = middleMs - offsetMs

    const mNewStart = dayjs(newStartMs).utc().startOf(nextUnit)
    const newEnd = mNewStart.add(nextDelta, nextUnit).toISOString()

    const deltaMs = nextDelta * unitOffsetMs
    const { newStartClamped, newEndClamped } = clampToAbsoluteBoundaries(
      mNewStart.toISOString(),
      newEnd,
      deltaMs,
      absoluteStart,
      absoluteEnd
    )

    this.notifyChange(newStartClamped, newEndClamped, source)
  }

  notifyChange = (start, end, source, clampToEnd = false) => {
    const { clampedStart, clampedEnd } = clampToMinAndMax(
      start,
      end,
      this.minimumRangeMs,
      this.maximumRangeMs,
      clampToEnd
    )
    const { onChange } = this.props
    const event = {
      start: clampedStart,
      end: clampedEnd,
      source,
    }
    onChange(event)
  }

  onPlaybackTick = (newStart, newEnd) => {
    this.notifyChange(newStart, newEnd, EVENT_SOURCE.PLAYBACK_FRAME)
  }

  onTogglePlay = (isPlaying) => {
    const { onTogglePlay } = this.props
    onTogglePlay(isPlaying)
  }

  render() {
    const {
      labels = {},
      start,
      end,
      absoluteStart,
      bookmarkStart,
      bookmarkEnd,
      bookmarkPlacement,
      enablePlayback,
      locale,
      minimumRange,
      minimumRangeUnit,
      maximumRange,
      maximumRangeUnit,
      stickToUnit,
    } = this.props
    const { immediate } = this.state

    this.setLocale(locale)
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
        <RecoilRoot override={false}>
          <div className={styles.Timebar}>
            {enablePlayback && (
              <Playback
                labels={labels.playback}
                start={start}
                end={end}
                absoluteStart={absoluteStart}
                absoluteEnd={absoluteEnd}
                onTick={this.onPlaybackTick}
                onTogglePlay={this.onTogglePlay}
              />
            )}

            <div className={cx('print-hidden', styles.timeActions)}>
              {showTimeRangeSelector && (
                <TimeRangeSelector
                  labels={labels.timerange}
                  start={start}
                  end={end}
                  absoluteStart={absoluteStart}
                  absoluteEnd={absoluteEnd}
                  onSubmit={this.onTimeRangeSelectorSubmit}
                  onDiscard={this.toggleTimeRangeSelector}
                  latestAvailableDataDate={this.props.latestAvailableDataDate}
                />
              )}
              <div className={cx('print-hidden', styles.timeRangeContainer)}>
                <button
                  type="button"
                  title={labels.timerange.title}
                  className={cx(styles.uiButton, styles.timeRange)}
                  disabled={immediate}
                  onClick={this.toggleTimeRangeSelector}
                >
                  <IconTimeRange />
                </button>
              </div>
              <button
                type="button"
                title={labels.setBookmark}
                className={cx('print-hidden', styles.uiButton, styles.bookmark)}
                onClick={this.setBookmark}
                disabled={immediate || bookmarkDisabled === true}
              >
                {hasBookmark ? <IconBookmarkFilled /> : <IconBookmark />}
              </button>
              <div className={cx('print-hidden', styles.timeScale)}>
                <button
                  type="button"
                  title={labels.zoomOut}
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
                  title={labels.zoomIn}
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
              labels={labels}
              onChange={this.notifyChange}
              onMouseLeave={this.props.onMouseLeave}
              onMouseMove={this.props.onMouseMove}
              absoluteStart={absoluteStart}
              absoluteEnd={absoluteEnd}
              onBookmarkChange={this.props.onBookmarkChange}
              bookmarkStart={bookmarkStart}
              bookmarkEnd={bookmarkEnd}
              bookmarkPlacement={bookmarkPlacement}
              showLastUpdate={this.props.showLastUpdate}
              latestAvailableDataDate={this.props.latestAvailableDataDate}
              trackGraphOrientation={this.props.trackGraphOrientation}
              stickToUnit={stickToUnit}
            />
          </div>
        </RecoilRoot>
      </ImmediateContext.Provider>
    )
  }
}

Timebar.propTypes = {
  labels: PropTypes.shape({
    playback: PropTypes.shape({
      playAnimation: PropTypes.string,
      pauseAnimation: PropTypes.string,
      toogleAnimationLooping: PropTypes.string,
      moveBack: PropTypes.string,
      moveForward: PropTypes.string,
      changeAnimationSpeed: PropTypes.string,
    }),
    timerange: PropTypes.shape({
      title: PropTypes.string,
      start: PropTypes.string,
      end: PropTypes.string,
      last30days: PropTypes.string,
      last3months: PropTypes.string,
      last6months: PropTypes.string,
      lastYear: PropTypes.string,
      done: PropTypes.string,
    }),
    bookmark: PropTypes.shape({
      goToBookmark: PropTypes.string,
      deleteBookmark: PropTypes.string,
    }),
    lastUpdate: PropTypes.string,
    day: PropTypes.string,
    year: PropTypes.string,
    month: PropTypes.string,
    hour: PropTypes.string,
    setBookmark: PropTypes.string,
    zoomIn: PropTypes.string,
    zoomOut: PropTypes.string,
    zoomTo: PropTypes.string,
    timeRange: PropTypes.string,
  }),
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  bookmarkStart: PropTypes.string,
  bookmarkEnd: PropTypes.string,
  bookmarkPlacement: PropTypes.string,
  onMouseLeave: PropTypes.func,
  onMouseMove: PropTypes.func,
  onBookmarkChange: PropTypes.func,
  absoluteStart: PropTypes.string.isRequired,
  absoluteEnd: PropTypes.string.isRequired,
  latestAvailableDataDate: PropTypes.string,
  enablePlayback: PropTypes.bool,
  onTogglePlay: PropTypes.func,
  minimumRange: PropTypes.number,
  minimumRangeUnit: PropTypes.string,
  maximumRange: PropTypes.number,
  maximumRangeUnit: PropTypes.string,
  stickToUnit: PropTypes.func,
  showLastUpdate: PropTypes.bool,
  // val is used to live edit translations in crowdin
  locale: PropTypes.oneOf(['en', 'es', 'fr', 'id', 'pt', 'val']),
}

Timebar.defaultProps = {
  latestAvailableDataDate: new Date().toISOString(),
  labels: {
    playback: {
      playAnimation: 'Play animation',
      pauseAnimation: 'Pause animation',
      toogleAnimationLooping: 'Toggle animation looping',
      moveBack: 'Move back',
      moveForward: 'Move forward',
      changeAnimationSpeed: 'Change animation speed',
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
    bookmark: {
      goToBookmark: 'Go to your bookmarked time range',
      deleteBookmark: 'Delete time range bookmark',
    },
    dragLabel: 'Drag to change the time range',
    lastUpdate: 'Last update',
    setBookmark: 'Bookmark current time range',
    day: 'day',
    year: 'year',
    month: 'month',
    hour: 'hour',
    zoomIn: 'Zoom in',
    zoomTo: 'Zoom to',
    zoomOut: 'Zoom out',
    selectTimeRange: 'Select a time range',
  },
  bookmarkStart: null,
  bookmarkEnd: null,
  enablePlayback: false,
  onTogglePlay: () => {
    // do nothing
  },
  children: null,
  onMouseLeave: () => {
    // do nothing
  },
  onMouseMove: () => {
    // do nothing
  },
  bookmarkPlacement: 'top',
  onBookmarkChange: () => {
    // do nothing
  },
  minimumRange: null,
  minimumRangeUnit: 'day',
  maximumRange: null,
  maximumRangeUnit: 'month',
  showLastUpdate: true,
  locale: 'en',
}

export default Timebar
