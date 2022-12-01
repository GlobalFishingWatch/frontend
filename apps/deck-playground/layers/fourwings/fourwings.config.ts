import { DateTime, Duration, DurationLikeObject } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer'

export const LIMITS_BY_INTERVAL: Record<
  Interval,
  { unit: keyof DurationLikeObject; value: number } | undefined
> = {
  hour: {
    unit: 'days',
    value: 3,
  },
  day: {
    unit: 'months',
    value: 3,
  },
  month: {
    unit: 'year',
    value: 6,
  },
  year: undefined,
}

export const getInterval = (start: number, end: number): Interval => {
  const duration = Duration.fromMillis(end - start)
  const validIntervals = Object.entries(LIMITS_BY_INTERVAL).flatMap(([interval, limits]) => {
    if (!limits) return interval
    return Math.round(duration.as(limits.unit)) <= limits.value ? interval : []
  })
  return validIntervals[0]
}

export type Chunk = {
  id: string
  interval: Interval
  start: number
  end: number
}

export const getChunksByInterval = (start: number, end: number, interval: Interval): Chunk[] => {
  const startDate = DateTime.fromMillis(start).startOf(interval)
  // TODO review if more than the interval units return an offset or calculates the total amount
  const chunksNumber = Math.floor(Duration.fromMillis(end - start).as(interval))
  const chunks: Chunk[] = Array.from(Array(chunksNumber).keys()).map((chunkIndex) => {
    return {
      id: `${interval}-${chunkIndex}`,
      interval,
      start: startDate.plus({ [interval]: chunkIndex }).toMillis(),
      end: startDate.plus({ [interval]: chunkIndex + 1 }).toMillis(),
    }
  })
  return chunks
}
