import { scaleLinear } from 'd3-scale'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import { getUTCDate, getUTCDateTime } from '@globalfishingwatch/data-transforms'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { clampToAbsoluteBoundaries } from '../utils'

const BASE_STEP = 0.001
const MS_IN_INTERVAL = {
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24,
  YEAR: 1000 * 60 * 60 * 24 * 365,
}

type GetStepProps = {
  start: string
  end: string
  absoluteStart: string
  absoluteEnd?: string
  deltaMultiplicator: number
  intervals?: FourwingsInterval[]
  getCurrentInterval?: typeof getFourwingsInterval
  byIntervals?: boolean
  speedStep?: number
}

const getStep = (start: string, end: string, speedStep = 0) => {
  const baseStepWithSpeed = BASE_STEP * speedStep
  const startMs = getUTCDate(start).getTime()
  const endMs = getUTCDate(end).getTime()

  const scale = scaleLinear().range([0, 1]).domain([startMs, endMs])
  const step = scale.invert(baseStepWithSpeed) - startMs
  return step
}

const isUnparseableRange = (start: string, end: string) =>
  !start || !end || isNaN(getUTCDate(start).getTime()) || isNaN(getUTCDate(end).getTime())

const toISOStringIfValid = (ms: number) => {
  const date = getUTCDate(ms)
  return isNaN(date.getTime()) ? undefined : date.toISOString()
}

export const getTimebarStepByDelta = ({
  start,
  end,
  absoluteStart,
  absoluteEnd,
  intervals,
  getCurrentInterval = getFourwingsInterval,
  deltaMultiplicator,
  byIntervals = true,
  speedStep = 0,
}: GetStepProps) => {
  // Same `{ start, end }` shape as the success path (README / Timebar.Playback / track-labeler).
  // The previous empty-range branch returned `{ newStart, newEnd }`, which no caller read.
  if (isUnparseableRange(start, end)) {
    return {
      start,
      end,
      clamped: 'none' as const,
    }
  }

  let newStartMs
  let newEndMs
  const interval = getCurrentInterval(start, end, intervals)
  if (byIntervals) {
    const intervalStartMs =
      interval === 'MONTH'
        ? DateTime.fromISO(start, { zone: 'utc' }).daysInMonth! * MS_IN_INTERVAL.DAY
        : MS_IN_INTERVAL[interval]
    const intervalEndMs =
      interval === 'MONTH'
        ? DateTime.fromISO(end, { zone: 'utc' }).daysInMonth! * MS_IN_INTERVAL.DAY
        : MS_IN_INTERVAL[interval]
    newStartMs = getUTCDate(start).getTime() + intervalStartMs * deltaMultiplicator
    newEndMs = getUTCDate(end).getTime() + intervalEndMs * deltaMultiplicator
  } else {
    const deltaMs = getStep(start, end, speedStep) * deltaMultiplicator
    newStartMs = getUTCDate(start).getTime() + deltaMs
    newEndMs = getUTCDate(end).getTime() + deltaMs
  }
  const newStartISO = toISOStringIfValid(newStartMs)
  const newEndISO = toISOStringIfValid(newEndMs)
  // Overflow (e.g. a background-tab rAF gap × a 15y span) makes Date invalid; toISOString throws.
  if (!newStartISO || !newEndISO) {
    return {
      start,
      end,
      clamped: 'none' as const,
    }
  }
  const currentStartEndDeltaMs = newEndMs - newStartMs
  const playbackAbsoluteEnd =
    absoluteEnd ??
    getUTCDateTime(Date.now())
      .endOf(interval.toLowerCase() as DateTimeUnit)
      .toISO()
  const { newStartClamped, newEndClamped, clamped } = clampToAbsoluteBoundaries(
    newStartISO,
    newEndISO,
    currentStartEndDeltaMs,
    absoluteStart,
    playbackAbsoluteEnd!
  )

  return {
    start: newStartClamped,
    end: newEndClamped,
    clamped,
  }
}
