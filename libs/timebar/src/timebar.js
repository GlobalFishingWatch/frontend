import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import dayjs from 'dayjs'
import memoize from 'memoize-one'
import relativeTime from 'dayjs/plugin/relativeTime'
import objectSupport from 'dayjs/plugin/objectSupport'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/en'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/id'
import { RecoilRoot } from 'recoil'
import { DateTime } from 'luxon'
import { CONFIG_BY_INTERVAL, LIMITS_BY_INTERVAL } from '@globalfishingwatch/layer-composer'
import ImmediateContext from './immediateContext'
import { getTime } from './utils/internal-utils'
// import './timebar-settings.css'
import styles from './timebar.module.css'
import TimeRangeSelector from './components/timerange-selector'
import IntervalSelector from './components/interval-selector'
import Timeline from './components/timeline'
import Playback from './components/playback'
import { ReactComponent as IconTimeRange } from './icons/timeRange.svg'
import { ReactComponent as IconBookmark } from './icons/bookmark.svg'
import { ReactComponent as IconBookmarkFilled } from './icons/bookmarkFilled.svg'
import { EVENT_SOURCE, EVENT_INTERVAL_SOURCE } from './constants'

dayjs.extend(relativeTime)
dayjs.extend(objectSupport)
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

  onIntervalClick = (interval) => {
    const { start, end, absoluteStart, absoluteEnd, latestAvailableDataDate } = this.props
    const intervalConfig = CONFIG_BY_INTERVAL[interval]
    if (intervalConfig) {
      const intervalLimit = LIMITS_BY_INTERVAL[interval]
      if (intervalLimit) {
        let newStart
        let newEnd
        if (
          latestAvailableDataDate.slice(0, start.length) >= start &&
          latestAvailableDataDate.slice(0, start.length) <= end
        ) {
          newEnd = DateTime.fromISO(latestAvailableDataDate, { zone: 'utc' })
            .endOf(interval)
            .plus({ millisecond: 1 })
          newStart = newEnd.minus({ [intervalLimit.unit]: 1 })
        } else {
          // if present day is out of range we choose the middle point in the timebar
          newStart = DateTime.fromMillis(getTime(start) + (getTime(end) - getTime(start)) / 2, {
            zone: 'utc',
          }).startOf(intervalLimit.unit)
          newEnd = newStart.plus({ [intervalLimit.unit]: 1 })
        }
        this.notifyChange(newStart.toISODate(), newEnd.toISODate(), EVENT_INTERVAL_SOURCE[interval])
      } else {
        this.notifyChange(absoluteStart, absoluteEnd, EVENT_INTERVAL_SOURCE[interval])
      }
    }
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
      displayWarningWhenInFuture,
      intervals,
      getCurrentInterval,
    } = this.props
    const { immediate } = this.state

    this.setLocale(locale)
    // state.absoluteEnd overrides the value set in props.absoluteEnd - see getDerivedStateFromProps
    const { showTimeRangeSelector, absoluteEnd } = this.state

    this.maximumRangeMs = this.getMaximumRangeMs(maximumRange, maximumRangeUnit)
    this.minimumRangeMs = this.getMinimumRangeMs(minimumRange, minimumRangeUnit)

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
                  intervals={intervals}
                />
              )}
              <button
                type="button"
                title={labels.timerange.title}
                className={cx(styles.uiButton)}
                disabled={immediate}
                onClick={this.toggleTimeRangeSelector}
              >
                <IconTimeRange />
              </button>
              <button
                type="button"
                title={labels.setBookmark}
                className={cx('print-hidden', styles.uiButton, styles.bookmark)}
                onClick={this.setBookmark}
                disabled={immediate || bookmarkDisabled === true}
              >
                {hasBookmark ? <IconBookmarkFilled /> : <IconBookmark />}
              </button>
            </div>
            <div className={cx('print-hidden', styles.timeActions)}>
              {
                intervals && getCurrentInterval ? (
                  <IntervalSelector
                    intervals={intervals}
                    getCurrentInterval={getCurrentInterval}
                    labels={labels.intervals}
                    start={start}
                    end={end}
                    onIntervalClick={this.onIntervalClick}
                  />
                ) : null // TODO restore + and - buttons as fallback
              }
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
              displayWarningWhenInFuture={displayWarningWhenInFuture}
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
    intervals: PropTypes.shape({
      hour: PropTypes.string,
      day: PropTypes.string,
      month: PropTypes.string,
      year: PropTypes.string,
    }),
    setBookmark: PropTypes.string,
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
  intervals: PropTypes.array,
  getCurrentInterval: PropTypes.func,
  displayWarningWhenInFuture: PropTypes.bool,
}

Timebar.defaultProps = {
  latestAvailableDataDate: DateTime.utc().toISO(),
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
    intervals: {
      hour: 'hours',
      day: 'days',
      month: 'months',
      year: 'years',
    },
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
  displayWarningWhenInFuture: true,
}

export default Timebar
