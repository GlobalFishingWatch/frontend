import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { FourwingsInterval, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { CONFIG_BY_INTERVAL, LIMITS_BY_INTERVAL } from '@globalfishingwatch/deck-loaders'

import { TimebarControls } from './components/timebar-controls'
import { TimebarGraph } from './components/timebar-graph'
import { TimebarIntervalSelector } from './components/timebar-interval-selector'
import { TimebarPlayback } from './components/timebar-playback'
import { TimebarTimeRangeSelector } from './components/timebar-timerange-button'
import { TimebarBookmark } from './components/timebar-toolbar-bookmark'
import { getTime } from './utils/internal-utils'
import { EVENT_INTERVAL_SOURCE, EVENT_SOURCE } from './constants'
import type { TimebarActionsContextProps, TimebarStateContextProps } from './timebar-context'
import { TimebarActionsContext, TimebarStateContext } from './timebar-context'
import type { TimebarLabels } from './timebar-labels'
import { DEFAULT_LABELS } from './timebar-labels'
import type { StickUnit } from './timeline-context'
import { useShallowMemo } from './use-shallow-memo'
import { useResizableHeight } from './useResizableHeight'

import styles from './timebar.module.css'

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
  labels?: TimebarLabels
  start: string
  end: string
  onChange: (event: { start: string; end: string; source?: string; clampToEnd?: boolean }) => void
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
  maximumRangeUnit?: string
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
  bookmarkStart = undefined,
  bookmarkEnd = undefined,
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
  const labels = labelsProp ?? DEFAULT_LABELS
  const [showTimeRangeSelector, setShowTimeRangeSelector] = useState(false)
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

  // Latest props for handlers that need volatile values without re-creating the
  // (memoized) actions context on every range change. Synced in an effect so we
  // never write a ref during render; event handlers fire post-commit so they read current values.
  const latest = useRef({
    start,
    end,
    absoluteStart,
    absoluteEnd,
    latestAvailableDataDate,
    onBookmarkChange,
  })
  useEffect(() => {
    latest.current = {
      start,
      end,
      absoluteStart,
      absoluteEnd,
      latestAvailableDataDate,
      onBookmarkChange,
    }
  })

  const notifyChange = useCallback(
    (s: string, e: string, source?: string, clampToEnd = false) => {
      const { clampedStart, clampedEnd } = clampToMinAndMax(
        s,
        e,
        minimumRangeMs,
        maximumRangeMs,
        clampToEnd
      )
      onChange({ start: clampedStart, end: clampedEnd, source })
    },
    [minimumRangeMs, maximumRangeMs, onChange]
  )

  const onIntervalClick = useCallback(
    (interval: FourwingsInterval) => {
      const { start, end, absoluteStart, absoluteEnd, latestAvailableDataDate } = latest.current
      const intervalConfig = CONFIG_BY_INTERVAL[interval]
      if (!intervalConfig) return
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
        notifyChange(
          newStart.toISO() as string,
          newEnd.toISO() as string,
          EVENT_INTERVAL_SOURCE[interval] as string
        )
      } else {
        notifyChange(absoluteStart, absoluteEnd, EVENT_INTERVAL_SOURCE[interval] as string)
      }
    },
    [notifyChange]
  )

  const onPlaybackTick = useCallback(
    (newStart: string, newEnd: string) => {
      notifyChange(newStart, newEnd, EVENT_SOURCE.PLAYBACK_FRAME)
    },
    [notifyChange]
  )

  const toggleTimeRangeSelector = useCallback(() => {
    setShowTimeRangeSelector((prev) => !prev)
  }, [])

  const onTimeRangeSelectorSubmit = useCallback(
    (s: string, e: string) => {
      notifyChange(s, e, EVENT_SOURCE.TIME_RANGE_SELECTOR)
      setShowTimeRangeSelector(false)
    },
    [notifyChange]
  )

  const setBookmark = useCallback(() => {
    latest.current.onBookmarkChange?.(latest.current.start, latest.current.end)
  }, [])

  // Notify once on mount (preserves the class componentDidMount behavior).
  useEffect(() => {
    notifyChange(latest.current.start, latest.current.end, EVENT_SOURCE.MOUNT)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasBookmark =
    bookmarkStart !== undefined &&
    bookmarkStart !== null &&
    bookmarkEnd !== undefined &&
    bookmarkEnd !== null
  const bookmarkDisabled =
    hasBookmark &&
    getTime(bookmarkStart) === getTime(start) &&
    getTime(bookmarkEnd) === getTime(end)

  const actionsValue = useShallowMemo<TimebarActionsContextProps>({
    notifyChange,
    onIntervalClick,
    onPlaybackTick,
    onTimeRangeSelectorSubmit,
    onBookmarkChange,
    setBookmark,
    toggleTimeRangeSelector,
    intervals,
    getCurrentInterval,
    labels,
    absoluteStart,
    absoluteEnd,
    latestAvailableDataDate,
  })

  const stateValue = useShallowMemo<TimebarStateContextProps>({
    start,
    end,
    showTimeRangeSelector,
    hasBookmark,
    bookmarkDisabled,
    bookmarkStart,
    bookmarkEnd,
  })

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
      <TimebarActionsContext.Provider value={actionsValue}>
        <TimebarStateContext.Provider value={stateValue}>{children}</TimebarStateContext.Provider>
      </TimebarActionsContext.Provider>
    </div>
  )
}

Timebar.Playback = TimebarPlayback
Timebar.Controls = TimebarControls
Timebar.TimeRangeSelector = TimebarTimeRangeSelector
Timebar.Bookmark = TimebarBookmark
Timebar.IntervalSelector = TimebarIntervalSelector
Timebar.Graph = TimebarGraph
