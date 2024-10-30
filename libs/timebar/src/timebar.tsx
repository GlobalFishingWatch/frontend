import React, { Component } from 'react'
import cx from 'classnames'
import memoize from 'memoize-one'
import { DateTime, DateTimeUnit } from 'luxon'
import { NumberValue } from 'd3-scale'
import {
  CONFIG_BY_INTERVAL,
  FourwingsInterval,
  getFourwingsInterval,
  LIMITS_BY_INTERVAL,
} from '@globalfishingwatch/deck-loaders'
import { getTime } from './utils/internal-utils'
import styles from './timebar.module.css'
import TimeRangeSelector from './components/timerange-selector'
import IntervalSelector from './components/interval-selector'
import Timeline from './components/timeline'
import Playback from './components/playback'
import { ReactComponent as IconTimeRange } from './icons/timeRange.svg'
import { ReactComponent as IconBookmark } from './icons/bookmark.svg'
import { ReactComponent as IconBookmarkFilled } from './icons/bookmarkFilled.svg'
import { EVENT_SOURCE, EVENT_INTERVAL_SOURCE } from './constants'
import { TrackGraphOrientation } from './timelineContext'

const ONE_HOUR_MS = 1000 * 60 * 60
const MINIMUM_RANGE = ONE_HOUR_MS

const getRangeMs = (range: number, unit: DateTimeUnit) => {
  const start = DateTime.now()
  const end = start.plus({ [unit]: range })
  return end.diff(start).milliseconds
}

const clampToMinAndMax = (
  start: string,
  end: string,
  minMs: number,
  maxMs: number,
  clampToEnd: boolean
) => {
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

export type TimebarProps = {
  labels?: {
    playback?: {
      playAnimation?: string
      pauseAnimation?: string
      toogleAnimationLooping?: string
      moveBack?: string
      moveForward?: string
      changeAnimationSpeed?: string
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
    bookmark?: {
      goToBookmark?: string
      deleteBookmark?: string
    }
    lastUpdate?: string
    intervals?: {
      hour?: string
      day?: string
      month?: string
      year?: string
    }
    setBookmark?: string
    zoomTo?: string
    timeRange?: string
  }
  start: string
  end: string
  onChange: (event: { start: string; end: string; source?: string; clampToEnd?: boolean }) => void
  children?: React.ReactNode
  bookmarkStart?: string
  bookmarkEnd?: string
  bookmarkPlacement?: string
  onMouseLeave?: (...args: unknown[]) => unknown
  onMouseMove?: (
    clientX: number | null,
    scale: ((arg: NumberValue) => Date) | null,
    isDay?: boolean
  ) => void
  onBookmarkChange?: (start: string, end: string) => void
  absoluteStart: string
  absoluteEnd: string
  latestAvailableDataDate?: string
  enablePlayback?: boolean
  onTogglePlay?: (isPlaying: boolean) => void
  minimumRange?: number
  minimumRangeUnit?: string
  maximumRange?: number
  maximumRangeUnit?: string
  stickToUnit?: (start: string, end: string) => 'day' | 'hour' | 'month' | 'year'
  // val is used to live edit translations in crowdin
  locale: 'en' | 'es' | 'fr' | 'id' | 'pt' | 'val'
  intervals?: FourwingsInterval[]
  getCurrentInterval: typeof getFourwingsInterval
  displayWarningWhenInFuture?: boolean
  trackGraphOrientation: TrackGraphOrientation
  isResizable?: boolean
}

type TimebarState = {
  updatedHeight: number
  showTimeRangeSelector: boolean
  absoluteEnd: string | null
  isDragging: boolean
  startCursorY: number | null
  startHeight: number | null
}

export class Timebar extends Component<TimebarProps> {
  interval: FourwingsInterval | null = null
  maximumRangeMs: number = Infinity
  minimumRangeMs: number = -Infinity
  state: TimebarState

  static defaultProps = {
    latestAvailableDataDate: '',
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
    locale: 'en',
    displayWarningWhenInFuture: true,
    isResizable: false,
  }

  constructor(props: TimebarProps) {
    super(props)
    this.interval = null
    this.state = {
      showTimeRangeSelector: false,
      absoluteEnd: null,
      updatedHeight: 70,
      isDragging: false,
      startCursorY: null,
      startHeight: null,
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

  static getDerivedStateFromProps(props: TimebarProps) {
    // let absolute end run through the end of the day
    const absoluteEnd = DateTime.fromISO(props.absoluteEnd, { zone: 'utc' }).endOf('day').toISO()
    return {
      absoluteEnd,
    }
  }

  toggleTimeRangeSelector = () => {
    this.setState((prevState: TimebarState) => ({
      showTimeRangeSelector: !prevState.showTimeRangeSelector,
    }))
  }

  setBookmark = () => {
    const { start, end, onBookmarkChange } = this.props
    onBookmarkChange && onBookmarkChange(start, end)
  }

  // setLocale = memoize((locale) => //TODO set DateTime.locale)

  onTimeRangeSelectorSubmit = (start: string, end: string) => {
    this.notifyChange(start, end, EVENT_SOURCE.TIME_RANGE_SELECTOR)
    this.setState({
      showTimeRangeSelector: false,
    })
  }

  onIntervalClick = (interval: FourwingsInterval) => {
    const { start, end, absoluteStart, absoluteEnd, latestAvailableDataDate } = this.props
    const intervalConfig = CONFIG_BY_INTERVAL[interval]
    if (intervalConfig) {
      const intervalLimit = LIMITS_BY_INTERVAL[interval]

      if (intervalLimit) {
        let newStart
        let newEnd
        if (
          latestAvailableDataDate &&
          latestAvailableDataDate.slice(0, start.length) >= start &&
          latestAvailableDataDate.slice(0, start.length) <= end
        ) {
          newEnd = DateTime.fromISO(latestAvailableDataDate, { zone: 'utc' })
            .endOf(interval as DateTimeUnit)
            .plus({ millisecond: 1 })
          newStart = newEnd.minus({ [intervalLimit.unit]: 1 })
        } else {
          // if present day is out of range we choose the middle point in the timebar
          newStart = DateTime.fromMillis(getTime(start) + (getTime(end) - getTime(start)) / 2, {
            zone: 'utc',
          }).startOf(intervalLimit.unit as DateTimeUnit)
          newEnd = newStart.plus({ [intervalLimit.unit]: 1 })
        }
        this.notifyChange(
          newStart.toISO() as string,
          newEnd.toISO() as string,
          EVENT_INTERVAL_SOURCE[interval] as string
        )
      } else {
        this.notifyChange(absoluteStart, absoluteEnd, EVENT_INTERVAL_SOURCE[interval] as string)
      }
    }
  }

  notifyChange = (start: string, end: string, source?: string, clampToEnd = false) => {
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

  onPlaybackTick = (newStart: string, newEnd: string) => {
    this.notifyChange(newStart, newEnd, EVENT_SOURCE.PLAYBACK_FRAME)
  }

  onTogglePlay = (isPlaying: boolean) => {
    const { onTogglePlay } = this.props
    onTogglePlay && onTogglePlay(isPlaying)
  }

  handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    this.setState({
      isDragging: true,
      startCursorY: e.clientY,
      startHeight: this.state.updatedHeight,
    })

    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseMove = (e: MouseEvent) => {
    if (
      this.state.isDragging &&
      this.state.startCursorY !== null &&
      this.state.startHeight !== null
    ) {
      const cursorYDelta = this.state.startCursorY - e.clientY
      let newHeight = Math.min(this.state.startHeight + cursorYDelta, 200)
      newHeight = Math.max(70, newHeight)
      this.setState({ updatedHeight: newHeight })
    }
  }

  handleMouseUp = () => {
    this.setState({
      isDragging: false,
      startCursorY: null,
      startHeight: null,
    })
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
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
      isResizable,
    } = this.props as TimebarProps

    // this.setLocale(locale)

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
      <div
        className={styles.Timebar}
        style={isResizable ? { height: `${this.state.updatedHeight}px` } : {}}
      >
        {isResizable && (
          <div className={styles.timebarResizer} onMouseDown={this.handleMouseDown} />
        )}
        {enablePlayback && (
          <Playback
            labels={labels.playback}
            start={start}
            end={end}
            absoluteStart={absoluteStart}
            absoluteEnd={absoluteEnd as string}
            onTick={this.onPlaybackTick}
            onTogglePlay={this.onTogglePlay}
            intervals={intervals}
            getCurrentInterval={getCurrentInterval}
          />
        )}

        <div className={cx('print-hidden', styles.timeActions)}>
          {showTimeRangeSelector && (
            <TimeRangeSelector
              labels={labels.timerange}
              start={start}
              end={end}
              absoluteStart={absoluteStart}
              absoluteEnd={absoluteEnd as string}
              onSubmit={this.onTimeRangeSelectorSubmit}
              onDiscard={this.toggleTimeRangeSelector}
              latestAvailableDataDate={this.props.latestAvailableDataDate}
            />
          )}
          <button
            type="button"
            title={labels.timerange?.title}
            className={cx(styles.uiButton)}
            onClick={this.toggleTimeRangeSelector}
          >
            <IconTimeRange />
          </button>
          <button
            type="button"
            title={labels.setBookmark}
            className={cx('print-hidden', styles.uiButton, styles.bookmark)}
            onClick={this.setBookmark}
            disabled={bookmarkDisabled === true}
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
          absoluteEnd={absoluteEnd as string}
          onBookmarkChange={this.props.onBookmarkChange}
          bookmarkStart={bookmarkStart}
          bookmarkEnd={bookmarkEnd}
          bookmarkPlacement={bookmarkPlacement}
          latestAvailableDataDate={this.props.latestAvailableDataDate as string}
          trackGraphOrientation={this.props.trackGraphOrientation as TrackGraphOrientation}
          stickToUnit={stickToUnit}
          displayWarningWhenInFuture={displayWarningWhenInFuture}
          locale={locale}
        />
      </div>
    )
  }
}
