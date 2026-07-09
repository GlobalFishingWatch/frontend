import type { RefObject } from 'react'
import type { ScaleTime } from 'd3-scale'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import { FOURWINGS_INTERVALS_ORDER, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { EVENT_SOURCE } from '../constants'
import type { TimebarContextProps } from '../timebar-context'
import { stickToClosestUnit } from '../utils'

import type { StickUnit, TimebarMouseMoveHandler } from './timeline-context'

export const DRAG_INNER = 'DRAG_INNER'
export const DRAG_START = 'DRAG_START'
export const DRAG_END = 'DRAG_END'

export type Dragging = 'DRAG_START' | 'DRAG_END' | 'DRAG_INNER'

export const HANDLER_MIN_GAP_PX = 20
export const INNER_START_RATIO = 0.15
export const INNER_END_RATIO = 0.85
export const ZOOM_OUT_SPEED_PX = 0.6

type ZoomState = {
  dragging: Dragging | null
  innerStartPx: number
  innerEndPx: number
}

export const getIsHandlerZoomingIn = (
  x: number,
  { dragging, innerStartPx, innerEndPx }: ZoomState
) => {
  const isZoomIn =
    (dragging === DRAG_START && x > innerStartPx) || (dragging === DRAG_END && x < innerEndPx)
  const isValid =
    isZoomIn &&
    ((dragging === DRAG_START && x < innerEndPx - HANDLER_MIN_GAP_PX) ||
      (dragging === DRAG_END && x > innerStartPx + HANDLER_MIN_GAP_PX))
  const clampedX =
    dragging === DRAG_START
      ? Math.min(x, innerEndPx - HANDLER_MIN_GAP_PX)
      : Math.max(x, innerStartPx + HANDLER_MIN_GAP_PX)
  return { isZoomIn, isValid, clampedX }
}

export const getIsHandlerZoomingOut = (
  x: number,
  { dragging, innerStartPx, innerEndPx, outerWidth }: ZoomState & { outerWidth: number }
) =>
  (dragging === DRAG_START && x < innerStartPx && x > 0) ||
  (dragging === DRAG_END && x > innerEndPx && x < outerWidth)

export type StickDir = 'nearest' | 'floor' | 'ceil'

const stickBoundary = (date: string, unit: DateTimeUnit, dir: StickDir) => {
  if (dir === 'nearest') return stickToClosestUnit(date, unit)
  const m = DateTime.fromISO(date, { zone: 'utc' })
  return dir === 'floor' ? m.startOf(unit).toISO() : m.endOf(unit).plus({ millisecond: 1 }).toISO()
}

export const resolveStickRange = (
  newStart: string,
  newEnd: string,
  start: string,
  end: string,
  stickToUnit?: (start: string, end: string) => DateTimeUnit,
  { startDir = 'nearest', endDir = 'nearest' }: { startDir?: StickDir; endDir?: StickDir } = {}
) => {
  const stickUnit = stickToUnit
    ? stickToUnit(newStart, newEnd)
    : (getFourwingsInterval(start, end, FOURWINGS_INTERVALS_ORDER).toLowerCase() as DateTimeUnit)
  const stickedStart = stickBoundary(newStart, stickUnit, startDir)
  let stickedEnd = stickBoundary(newEnd, stickUnit, endDir)
  if (stickedStart && stickedEnd && stickedStart === stickedEnd) {
    stickedEnd = DateTime.fromISO(stickedStart, { zone: 'utc' })
      .plus({ [stickUnit]: 1 })
      .toISO()
  }
  return { start: stickedStart, end: stickedEnd }
}

export const resolveDragSource = (outerDrag: boolean, dragging: Dragging | null) => {
  if (outerDrag === true) return EVENT_SOURCE.ZOOM_OUT_RELEASE
  if (dragging === DRAG_INNER) return EVENT_SOURCE.SEEK_RELEASE
  return EVENT_SOURCE.ZOOM_IN_RELEASE
}

export type TimelineState = {
  innerStartPx: number
  innerEndPx: number
  innerWidth: number
  outerWidth: number
  outerHeight: number
  dragging: Dragging | null
  isMovingInside: boolean
  outerDrag: boolean
  outerX: number
  handlerMouseX: number
  relativeOffsetX: number
}

export const INITIAL_STATE: TimelineState = {
  innerStartPx: 0,
  innerEndPx: 0,
  innerWidth: 50,
  outerWidth: 100,
  outerHeight: 50,
  dragging: null,
  isMovingInside: false,
  outerDrag: false,
  outerX: 0,
  handlerMouseX: 0,
  relativeOffsetX: 0,
}

export type TimelineLatestProps = {
  absoluteStart: string
  absoluteEnd: string
  notifyChange: TimebarContextProps['notifyChange']
  onMouseMove?: TimebarMouseMoveHandler
  stickToUnit?: (start: string, end: string) => StickUnit
  latestAvailableDataDate?: string
}

export type TimeScaleRef = RefObject<ScaleTime<number, number, never>>
export type TimelineStateRef = RefObject<TimelineState>
export type TimelineLatestPropsRef = RefObject<TimelineLatestProps>
export type RangeRef = TimebarContextProps['rangeRef']
export type SetTimelineState = (patch: Partial<TimelineState>) => void
