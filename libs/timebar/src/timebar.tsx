import type React from 'react'
import { useEffect, useMemo } from 'react'
import cx from 'classnames'
import { merge } from 'es-toolkit'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import type { FourwingsInterval, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { TimebarHighlighter } from './charts/highlighter'
import { TimebarStackedActivity } from './charts/stacked-activity'
import { TimebarTracksEvents } from './charts/tracks-events'
import { TimebarTracksGraph } from './charts/tracks-graph'
import { TimebarBookmarkButton } from './components/bookmark-button'
import { TimebarIntervalSelector } from './components/interval-selector'
import { TimebarPlayback } from './components/playback'
import { TimebarTimeRangeSelector } from './components/timerange-button'
import { TimebarToolWrapper } from './components/tool-wrapper'
import { TimebarToolbarWrapper } from './components/toolbar-wrapper'
import { TimebarTimeline } from './timeline/timeline'
import type { StickUnit } from './timeline/timeline-context'
import { useResizableHeight } from './utils/use-resizable-height'
import { EVENT_SOURCE } from './constants'
import type { TimebarContextProps } from './timebar-context'
import { TimebarContext } from './timebar-context'
import type { TimebarLabels } from './timebar-labels'
import { DEFAULT_LABELS } from './timebar-labels'
import { useTimebarRange } from './timebar-range'

import styles from './timebar.module.css'

const ONE_HOUR_MS = 1000 * 60 * 60
const MINIMUM_RANGE = ONE_HOUR_MS
const getRangeMs = (range: number, unit: DateTimeUnit) => {
  const start = DateTime.now()
  const end = start.plus({ [unit]: range })
  return end.diff(start).milliseconds
}

export type TimebarChangeSource = (typeof EVENT_SOURCE)[keyof typeof EVENT_SOURCE]

export type TimebarChangeEvent = {
  start: string
  end: string
  source?: TimebarChangeSource
  clampToEnd?: boolean
}

export type TimebarProps = {
  labels?: TimebarLabels
  start: string
  end: string
  onChange: (event: TimebarChangeEvent) => void
  children?: React.ReactNode
  bookmarkStart?: string
  bookmarkEnd?: string
  onBookmarkChange?: (start: string, end: string) => void
  absoluteStart: string
  absoluteEnd: string
  latestAvailableDataDate?: string
  minimumRange?: number | null
  minimumRangeUnit?: StickUnit
  maximumRange?: number | null
  maximumRangeUnit?: StickUnit
  intervals?: FourwingsInterval[]
  getCurrentInterval?: typeof getFourwingsInterval
  isResizable?: boolean
  defaultHeight?: number
}

export function Timebar({
  labels: labelsProp,
  start,
  end,
  onChange,
  children,
  bookmarkStart,
  bookmarkEnd,
  onBookmarkChange,
  absoluteStart,
  absoluteEnd,
  latestAvailableDataDate = '',
  minimumRange = null,
  minimumRangeUnit = 'day',
  maximumRange = null,
  maximumRangeUnit = 'month',
  intervals,
  getCurrentInterval,
  isResizable = false,
  defaultHeight,
}: TimebarProps) {
  const labels = useMemo<TimebarLabels>(() => {
    if (labelsProp) {
      // Deep clone
      return merge(merge({}, DEFAULT_LABELS), labelsProp)
    }
    return DEFAULT_LABELS
  }, [labelsProp])

  const { height, isDragging, onResizerMouseDown } = useResizableHeight({
    isResizable,
    defaultHeight,
  })

  const maximumRangeMs = useMemo(
    () =>
      maximumRange === null
        ? Number.POSITIVE_INFINITY
        : getRangeMs(maximumRange, maximumRangeUnit as DateTimeUnit),
    [maximumRange, maximumRangeUnit]
  )
  const minimumRangeMs = useMemo(
    () =>
      minimumRange === null
        ? MINIMUM_RANGE
        : getRangeMs(minimumRange, minimumRangeUnit as DateTimeUnit),
    [minimumRange, minimumRangeUnit]
  )

  const { range, rangeRef, notifyChange, beginInteraction, endInteraction } = useTimebarRange({
    start,
    end,
    minimumRangeMs,
    maximumRangeMs,
    onChange,
  })

  // Notify once on mount (preserves the class componentDidMount behavior).
  useEffect(() => {
    notifyChange(start, end, EVENT_SOURCE.MOUNT)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<TimebarContextProps>(
    () => ({
      notifyChange,
      rangeRef,
      beginInteraction,
      endInteraction,
      onBookmarkChange,
      intervals,
      getCurrentInterval,
      labels,
      absoluteStart,
      absoluteEnd,
      latestAvailableDataDate,
      start: range.start,
      end: range.end,
      bookmarkStart,
      bookmarkEnd,
    }),
    [
      notifyChange,
      rangeRef,
      beginInteraction,
      endInteraction,
      onBookmarkChange,
      intervals,
      getCurrentInterval,
      labels,
      absoluteStart,
      absoluteEnd,
      latestAvailableDataDate,
      range.start,
      range.end,
      bookmarkStart,
      bookmarkEnd,
    ]
  )

  return (
    <div className={styles.Timebar} style={isResizable ? { height: `${height}px` } : {}}>
      {isResizable && (
        <div
          role="button"
          tabIndex={0}
          className={cx(styles.timebarResizer, { [styles.resizing]: isDragging })}
          onMouseDown={onResizerMouseDown}
        />
      )}
      <TimebarContext.Provider value={value}>{children}</TimebarContext.Provider>
    </div>
  )
}

Timebar.Playback = TimebarPlayback
Timebar.IntervalSelector = TimebarIntervalSelector
Timebar.TimeRangeSelector = TimebarTimeRangeSelector
Timebar.ToolbarWrapper = TimebarToolbarWrapper
Timebar.Tools = {
  Wrapper: TimebarToolWrapper,
  Bookmark: TimebarBookmarkButton,
}
Timebar.Charts = {
  Wrapper: TimebarTimeline,
  TracksGraph: TimebarTracksGraph,
  TracksEvents: TimebarTracksEvents,
  Highlighter: TimebarHighlighter,
  StackedActivity: TimebarStackedActivity,
}
