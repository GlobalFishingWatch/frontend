import type * as d3 from 'd3-scale'
import type { DateTimeUnit } from 'luxon'

import { createGuardedContext } from './create-guarded-context'

export type TimelineScale = d3.ScaleTime<number, number>

export type TrackGraphOrientation = 'up' | 'down' | 'mirrored'

// val is used to live edit translations in crowdin
export type TimebarLocale = 'en' | 'es' | 'fr' | 'id' | 'pt' | 'val'

export type TimebarMouseLeaveHandler = (...args: unknown[]) => unknown
export type TimebarMouseMoveHandler = (
  clientX: number | null,
  scale: ((arg: d3.NumberValue) => Date) | null,
  isDay?: boolean
) => void

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

/** The timeline (d3 scale/layout) context. `useTimelineContext` throws if used outside <Timeline>. */
export const [TimelineContext, useTimelineContext] = createGuardedContext<TimelineContextProps>(
  'useTimelineContext',
  'a Timeline provider'
)
