import type { DateTimeUnit } from 'luxon'
import { DateTime, Duration } from 'luxon'

import { API_GATEWAY, API_VERSION } from '@globalfishingwatch/api-client'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { LIMITS_BY_INTERVAL } from '@globalfishingwatch/deck-loaders'

import { getUTCDateTime } from '../../utils/dates'

import type { FourwingsChunk } from './fourwings.types'

const BASE_API_TILES_URL =
  `${API_GATEWAY}/${API_VERSION}/4wings/tile/{FOURWINGS_VISUALIZATION_MODE}/{z}/{x}/{y}` as const
export const HEATMAP_API_TILES_URL = BASE_API_TILES_URL.replace(
  '{FOURWINGS_VISUALIZATION_MODE}',
  'heatmap'
)
export const POSITIONS_API_TILES_URL = BASE_API_TILES_URL.replace(
  '{FOURWINGS_VISUALIZATION_MODE}',
  'position'
)

export const HEATMAP_ID = 'heatmap'
export const HEATMAP_HIGH_RES_ID = `${HEATMAP_ID}-high-res`
export const HEATMAP_LOW_RES_ID = `${HEATMAP_ID}-low-res`
export const HEATMAP_STATIC_ID = `${HEATMAP_ID}-static`
export const POSITIONS_ID = 'positions'
export const HEATMAP_STATIC_PROPERTY_ID = 'count'
export const FOOTPRINT_ID = 'footprint'

export const SUPPORTED_POSITION_PROPERTIES = [/*'speed',*/ 'bearing', 'shipname', 'vessel_id']

export const FOURWINGS_MAX_ZOOM = 12
export const MAX_ZOOM_TO_CLUSTER_POINTS = 4.5
export const MAX_POSITIONS_PER_TILE_SUPPORTED = 5000
export const POSITIONS_VISUALIZATION_MAX_ZOOM = 12

export const MAX_RAMP_VALUES = 10000

export const DYNAMIC_RAMP_CHANGE_THRESHOLD = 50

export const TIME_COMPARISON_NOT_SUPPORTED_INTERVALS: FourwingsInterval[] = ['MONTH', 'YEAR']

export const CHUNKS_BY_INTERVAL: Record<
  FourwingsInterval,
  { unit: DateTimeUnit; value: number } | undefined
> = {
  HOUR: {
    unit: 'day',
    value: 20,
  },
  DAY: {
    unit: 'year',
    value: 1,
  },
  MONTH: undefined,
  YEAR: undefined,
}

export const getDateInIntervalResolution = (date: number, interval: FourwingsInterval): number => {
  return DateTime.fromMillis(date)
    .toUTC()
    .startOf(interval as any)
    .toMillis()
}

export const CHUNKS_BUFFER = 1
// TODO: validate if worth to make this dynamic for the playback
export const getChunkByInterval = (
  start: number,
  end: number,
  interval: FourwingsInterval
): FourwingsChunk => {
  const intervalUnit = LIMITS_BY_INTERVAL[interval]?.unit
  if (!intervalUnit) {
    return { id: 'full-time-range', interval, start, end, bufferedStart: start, bufferedEnd: end }
  }
  const startDate = getUTCDateTime(start).startOf(intervalUnit as any)
  const bufferedStartDate = startDate.minus({ [intervalUnit]: CHUNKS_BUFFER })
  const now = DateTime.now().toUTC().startOf('day')
  const endDate = getUTCDateTime(end)
  if (endDate[interval.toLowerCase() as 'month' | 'day' | 'hour'] > 1) {
    endDate.endOf(intervalUnit as any).plus({ millisecond: 1 })
  }
  const bufferedEndDate = endDate.plus({ [intervalUnit]: CHUNKS_BUFFER })
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
