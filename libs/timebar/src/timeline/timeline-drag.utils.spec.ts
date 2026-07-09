import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'

import { EVENT_SOURCE } from '../constants'

import {
  DRAG_END,
  DRAG_INNER,
  DRAG_START,
  getIsHandlerZoomingIn,
  getIsHandlerZoomingOut,
  HANDLER_MIN_GAP_PX,
  resolveDragSource,
  resolveStickRange,
} from './timeline-drag.utils'

const millis = (iso: string) => DateTime.fromISO(iso, { zone: 'utc' }).toMillis()
const DAY_MS = 24 * 60 * 60 * 1000

describe('getHandlerZoomIn', () => {
  const layout = { innerStartPx: 100, innerEndPx: 300 }

  it('detects a zoom-in when the start handle moves inward', () => {
    const res = getIsHandlerZoomingIn(150, { dragging: DRAG_START, ...layout })
    expect(res.isZoomIn).toBe(true)
    expect(res.isValid).toBe(true)
    expect(res.clampedX).toBe(150)
  })

  it('clamps the start handle to keep the min gap and marks it invalid past the gap', () => {
    const res = getIsHandlerZoomingIn(295, { dragging: DRAG_START, ...layout })
    expect(res.isZoomIn).toBe(true)
    expect(res.isValid).toBe(false) // 295 is within HANDLER_MIN_GAP_PX of innerEndPx
    expect(res.clampedX).toBe(layout.innerEndPx - HANDLER_MIN_GAP_PX) // 280
  })

  it('clamps the end handle symmetrically', () => {
    const res = getIsHandlerZoomingIn(105, { dragging: DRAG_END, ...layout })
    expect(res.isZoomIn).toBe(true)
    expect(res.isValid).toBe(false)
    expect(res.clampedX).toBe(layout.innerStartPx + HANDLER_MIN_GAP_PX) // 120
  })

  it('is not a zoom-in when the start handle moves outward', () => {
    expect(getIsHandlerZoomingIn(50, { dragging: DRAG_START, ...layout }).isZoomIn).toBe(false)
  })
})

describe('getHandlerZoomOut', () => {
  const layout = { innerStartPx: 100, innerEndPx: 300, outerWidth: 400 }

  it('is true while the start handle is dragged outward inside the outer bounds', () => {
    expect(getIsHandlerZoomingOut(50, { dragging: DRAG_START, ...layout })).toBe(true)
    expect(getIsHandlerZoomingOut(0, { dragging: DRAG_START, ...layout })).toBe(false) // not > 0
  })

  it('is true while the end handle is dragged outward inside the outer bounds', () => {
    expect(getIsHandlerZoomingOut(350, { dragging: DRAG_END, ...layout })).toBe(true)
    expect(getIsHandlerZoomingOut(400, { dragging: DRAG_END, ...layout })).toBe(false) // not < outerWidth
  })

  it('is false when the handle is inside the selection', () => {
    expect(getIsHandlerZoomingOut(200, { dragging: DRAG_START, ...layout })).toBe(false)
  })
})

describe('resolveStickRange', () => {
  it('snaps both ends to the closest unit boundary', () => {
    const { start, end } = resolveStickRange(
      '2020-03-10T03:00:00.000Z',
      '2020-03-10T20:00:00.000Z',
      '2020-03-10T03:00:00.000Z',
      '2020-03-10T20:00:00.000Z',
      () => 'day'
    )
    expect(millis(start!)).toBe(millis('2020-03-10T00:00:00.000Z'))
    expect(millis(end!)).toBe(millis('2020-03-11T00:00:00.000Z'))
  })

  it('expands a collapsed range by one unit so start !== end', () => {
    const { start, end } = resolveStickRange(
      '2020-03-10T03:00:00.000Z',
      '2020-03-10T05:00:00.000Z',
      '2020-03-10T03:00:00.000Z',
      '2020-03-10T05:00:00.000Z',
      () => 'day'
    )
    expect(start).not.toBe(end)
    expect(millis(end!) - millis(start!)).toBe(DAY_MS)
  })

  // zoom-out: the dragged edge must snap OUTWARD, never round back inside the range.
  it('floors the start on a zoom-out so a small left drag still grows the range', () => {
    const { start } = resolveStickRange(
      '2020-03-20T00:00:00.000Z', // start dragged a little earlier within March
      '2020-06-10T00:00:00.000Z',
      '2020-03-20T00:00:00.000Z',
      '2020-06-10T00:00:00.000Z',
      () => 'month',
      { startDir: 'floor' }
    )
    // floored to the start of March, not rounded forward to April (which would shrink it)
    expect(millis(start!)).toBe(millis('2020-03-01T00:00:00.000Z'))
  })

  it('ceils the end on a zoom-out so a small right drag still grows the range', () => {
    const { end } = resolveStickRange(
      '2020-03-01T00:00:00.000Z',
      '2020-06-10T00:00:00.000Z', // end dragged a little later within June
      '2020-03-01T00:00:00.000Z',
      '2020-06-10T00:00:00.000Z',
      () => 'month',
      { endDir: 'ceil' }
    )
    // ceiled to the start of July, not rounded back to June 1 (which would shrink it)
    expect(millis(end!)).toBe(millis('2020-07-01T00:00:00.000Z'))
  })
})

describe('resolveDragSource', () => {
  it('tags a zoom-out release', () => {
    expect(resolveDragSource(true, DRAG_END)).toBe(EVENT_SOURCE.ZOOM_OUT_RELEASE)
  })
  it('tags an inner (seek) release', () => {
    expect(resolveDragSource(false, DRAG_INNER)).toBe(EVENT_SOURCE.SEEK_RELEASE)
  })
  it('tags a zoom-in release for a handle drag', () => {
    expect(resolveDragSource(false, DRAG_START)).toBe(EVENT_SOURCE.ZOOM_IN_RELEASE)
    expect(resolveDragSource(false, DRAG_END)).toBe(EVENT_SOURCE.ZOOM_IN_RELEASE)
  })
})
