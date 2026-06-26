import { createContext, useContext } from 'react'
import type * as d3 from 'd3-scale'
import type { DateTimeUnit } from 'luxon'

export type TimelineScale = d3.ScaleTime<number, number>

export type TrackGraphOrientation = 'up' | 'down' | 'mirrored'

/** ISO 8601 date-time string, e.g. "2024-01-01T00:00:00.000Z" */
export type ISODateString = string

/** Subset of luxon DateTimeUnit the timebar snaps ranges to. */
export type StickUnit = Extract<DateTimeUnit, 'hour' | 'day' | 'month' | 'year'>

export type TimelineContextProps = {
  start: ISODateString
  end: ISODateString
  outerStart: ISODateString
  outerEnd: ISODateString
  outerWidth: number
  outerHeight: number
  graphHeight: number
  innerWidth: number
  innerStartPx: number
  innerEndPx: number
  overallScale: TimelineScale
  outerScale: TimelineScale
  svgTransform: string
  tooltipContainer: Element | null
  trackGraphOrientation: TrackGraphOrientation
}

export const TimelineContext = createContext<TimelineContextProps | null>(null)

/** Read the timeline (d3 scale/layout) context. Throws if used outside <Timeline>. */
export function useTimelineContext() {
  const context = useContext(TimelineContext)
  if (context === null) {
    throw new Error('useTimelineContext must be used within a Timeline provider')
  }
  return context
}

export default TimelineContext
