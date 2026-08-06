import { DateTime, Duration } from 'luxon'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { LIMITS_BY_INTERVAL } from '@globalfishingwatch/deck-loaders/fourwings/helpers'

import { getUTCDateTime } from '#utils/dates'

import { CHUNKS_BUFFER } from './fourwings.config'
import type { FourwingsChunk, FourwingsIntervalCacheMode } from './fourwings.types'

export const getDateInIntervalResolution = (date: number, interval: FourwingsInterval): number => {
  return DateTime.fromMillis(date)
    .toUTC()
    .startOf(interval as any)
    .toMillis()
}

export type GetChunkByIntervalParams = {
  start: number
  end: number
  bufferedStartTime?: number
  bufferedEndTime?: number
  interval: FourwingsInterval
  chunksBuffer?: number
  intervalCacheMode?: FourwingsIntervalCacheMode
}
// TODO: validate if worth to make this dynamic for the playback
export const getChunkByInterval = ({
  start,
  end,
  bufferedStartTime,
  bufferedEndTime,
  interval,
  chunksBuffer = CHUNKS_BUFFER,
  intervalCacheMode = 'DATE',
}: GetChunkByIntervalParams): FourwingsChunk => {
  const intervalUnit = LIMITS_BY_INTERVAL[interval]?.unit
  if (!intervalUnit || intervalCacheMode === 'NONE') {
    const id = intervalCacheMode === 'NONE' ? 'real-time-range' : 'full-time-range'
    return {
      id,
      interval,
      start,
      end,
      bufferedStart: bufferedStartTime ?? start,
      bufferedEnd: bufferedEndTime ?? end,
    }
  }
  const startDate = getUTCDateTime(start).startOf(intervalUnit as any)
  const bufferedStartDate = startDate.minus({ [intervalUnit]: chunksBuffer })
  const now = DateTime.now().toUTC().startOf('day')
  const endDateInterval = interval.toLowerCase() as 'month' | 'day' | 'hour'
  let endDate = getUTCDateTime(end)
  endDate = endDate
    .endOf(
      // eg: when interval day and endDate is more than first day of the month, we move to end of month
      endDate[endDateInterval] > 1 ? (intervalUnit as typeof endDateInterval) : endDateInterval
    )
    .plus({ millisecond: 1 })
  const bufferedEndDate = endDate.plus({ [intervalUnit]: chunksBuffer })
  return {
    id: `${intervalUnit}-chunk`,
    interval,
    start: startDate.toMillis(),
    end: Math.min(endDate.toMillis(), now.toMillis()),
    bufferedStart: bufferedStartDate.toMillis(),
    bufferedEnd: Math.min(bufferedEndDate.toMillis(), now.toMillis()),
  }
}

export const getChunkBuffer = (interval: FourwingsInterval) => {
  const { buffer, unit } = LIMITS_BY_INTERVAL[interval] || {}
  if (!unit) {
    return 0
  }
  return Duration.fromObject({ [unit]: buffer }).toMillis()
}
