import React, { Component } from 'react'
import cx from 'classnames'
import type { NumberValue } from 'd3-scale'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'
import memoize from 'memoize-one'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { FourwingsInterval, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { CONFIG_BY_INTERVAL, LIMITS_BY_INTERVAL } from '@globalfishingwatch/deck-loaders'
import { Icon } from '@globalfishingwatch/ui-components'

import IntervalSelector from './components/interval-selector'
import Playback from './components/playback'
import Timeline from './components/timeline'
import TimeRangeSelector from './components/timerange-selector'
import { getTime } from './utils/internal-utils'
import {
  EVENT_INTERVAL_SOURCE,
  EVENT_SOURCE,
  MAXIMUM_TIMEBAR_HEIGHT,
  MINIMUM_TIMEBAR_HEIGHT,
} from './constants'
import type { TrackGraphOrientation } from './timelineContext'

import styles from './timebar.module.css'

const ONE_HOUR_MS = 1000 * 60 * 60
const MINIMUM_RANGE = ONE_HOUR_MS
const DEFAULT_HEIGHT = 70

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
  const delta = getUTCDate(end).getTime() - getUTCDate(start).getTime()
  let clampedEnd = end
  let clampedStart = start
  if (delta > maxMs) {
    if (clampToEnd === true) {
      clampedEnd = getUTCDate(getUTCDate(start).getTime() + maxMs).toISOString()
    } else {
      clampedStart = getUTCDate(getUTCDate(end).getTime() - maxMs).toISOString()
    }
  } else if (delta < minMs) {
    if (clampToEnd === true) {
      clampedEnd = getUTCDate(getUTCDate(start).getTime() + minMs).toISOString()
    } else {
      clampedStart = getUTCDate(getUTCDate(end).getTime() - minMs).toISOString()
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
  showPlayback?: boolean
  disablePlayback?: boolean
  disabledPlaybackTooltip?: string
  onTogglePlay?: (isPlaying: boolean) => void
  minimumRange?: number
  minimumRangeUnit?: string
  maximumRange?: number
  maximumRangeUnit?: string
  stickToUnit?: (start: string, end: string) => 'day' | 'hour' | 'month' | 'year'
  // val is used to live edit translations in crowdin
  locale: 'en' | 'es' | 'fr' | 'id' | 'pt' | 'val'
  intervals?: FourwingsInterval[]
  getCurrentInterval?: typeof getFourwingsInterval
  displayWarningWhenInFuture?: boolean
  trackGraphOrientation?: TrackGraphOrientation
  isResizable?: boolean
  defaultHeight?: number
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
    disablePlayback: false,
    disabledPlaybackTooltip: '',
    showPlayback: false,
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
      updatedHeight: props.defaultHeight || DEFAULT_HEIGHT,
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

  toggleTimeRangeSelector = () => {
    this.setState((prevState: TimebarState) => ({
      showTimeRangeSelector: !prevState.showTimeRangeSelector,
    }))
  }

  setBookmark = () => {
    const { start, end, onBookmarkChange } = this.props
    if (onBookmarkChange) {
      onBookmarkChange(start, end)
    }
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
    if (onTogglePlay) {
      onTogglePlay(isPlaying)
    }
  }

  handleMouseDown = (e: React.MouseEvent) => {
    if (this.props.isResizable) {
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
  }

  handleMouseMove = (e: MouseEvent) => {
    if (
      this.props.isResizable &&
      this.state.isDragging &&
      this.state.startCursorY !== null &&
      this.state.startHeight !== null
    ) {
      const cursorYDelta = this.state.startCursorY - e.clientY
      let newHeight = Math.min(this.state.startHeight + cursorYDelta, MAXIMUM_TIMEBAR_HEIGHT)
      newHeight = Math.max(MINIMUM_TIMEBAR_HEIGHT, newHeight)
      this.setState({ updatedHeight: newHeight })
    }
  }

  handleMouseUp = () => {
    if (this.props.isResizable) {
      this.setState({
        isDragging: false,
        startCursorY: null,
        startHeight: null,
      })
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    }
  }

  render() {
    const {
      labels = {},
      start,
      end,
      absoluteStart,
      absoluteEnd,
      bookmarkStart,
      bookmarkEnd,
      bookmarkPlacement,
      disablePlayback,
      disabledPlaybackTooltip,
      showPlayback,
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
          <div
            role="button"
            tabIndex={0}
            className={styles.timebarResizer}
            onMouseDown={this.handleMouseDown}
          />
        )}
        {showPlayback && (
          <Playback
            labels={labels.playback}
            start={start}
            end={end}
            absoluteStart={absoluteStart}
            absoluteEnd={this.state.absoluteEnd as string}
            onTick={this.onPlaybackTick}
            onTogglePlay={this.onTogglePlay}
            intervals={intervals}
            getCurrentInterval={getCurrentInterval}
            disabled={disablePlayback}
            disabledPlaybackTooltip={disabledPlaybackTooltip}
          />
        )}

        <div className={cx('print-hidden', styles.timeActions)}>
          {this.state.showTimeRangeSelector && (
            <TimeRangeSelector
              labels={labels.timerange}
              start={start}
              end={end}
              absoluteStart={absoluteStart}
              absoluteEnd={this.state.absoluteEnd as string}
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
            <Icon icon="time-range" />
          </button>
          <button
            type="button"
            title={labels.setBookmark}
            className={cx('print-hidden', styles.uiButton, styles.bookmark)}
            onClick={this.setBookmark}
            disabled={bookmarkDisabled === true}
          >
            {hasBookmark ? <Icon icon="bookmark-filled" /> : <Icon icon="bookmark" />}
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
