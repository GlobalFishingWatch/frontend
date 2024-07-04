import { DateTime, DateTimeUnit, Duration, DurationLikeObject } from 'luxon'
import { intersection } from 'lodash'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { API_GATEWAY, API_VERSION } from '@globalfishingwatch/api-client'
import { getUTCDateTime } from '../../utils/dates'
import { FourwingsChunk } from './fourwings.types'

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

export const SUPPORTED_POSITION_PROPERTIES = ['speed', 'bearing', 'shipname']

export const FOURWINGS_MAX_ZOOM = 12
// TODO:deck validate this is a good number
export const MAX_POSITIONS_PER_TILE_SUPPORTED = 10000
export const POSITIONS_VISUALIZATION_MAX_ZOOM = 9

export const MAX_RAMP_VALUES = 10000

export const DYNAMIC_RAMP_CHANGE_THRESHOLD = 50

export const FOURWINGS_INTERVALS_ORDER: FourwingsInterval[] = ['HOUR', 'DAY', 'MONTH', 'YEAR']
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

export const LIMITS_BY_INTERVAL: Record<
  FourwingsInterval,
  { unit: keyof DurationLikeObject; value: number; buffer: number } | undefined
> = {
  HOUR: {
    unit: 'days',
    value: 3,
    buffer: 1,
  },
  DAY: {
    unit: 'months',
    value: 3,
    buffer: 1,
  },
  MONTH: {
    unit: 'year',
    value: 3,
    buffer: 1,
  },
  YEAR: undefined,
}

export const getFourwingsInterval = (
  start: number | string,
  end: number | string,
  availableIntervals = FOURWINGS_INTERVALS_ORDER
): FourwingsInterval => {
  const startMillis = typeof start === 'string' ? DateTime.fromISO(start).toMillis() : start
  const endMillis = typeof end === 'string' ? DateTime.fromISO(end).toMillis() : end
  const duration = Duration.fromMillis(endMillis - startMillis)
  const validIntervals = Object.entries(LIMITS_BY_INTERVAL).flatMap(([interval, limits]) => {
    if (!availableIntervals.includes(interval as FourwingsInterval)) return []
    if (!limits) return interval as FourwingsInterval
    return Math.round(duration.as(limits.unit)) <= limits.value
      ? (interval as FourwingsInterval)
      : []
  })
  if (validIntervals.length) {
    return validIntervals[0]
  }
  const sortedIntervals = intersection(
    FOURWINGS_INTERVALS_ORDER,
    availableIntervals
  ) as FourwingsInterval[]
  return sortedIntervals[sortedIntervals.length - 1]
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
  const startDate = getUTCDateTime(start)
    .startOf(intervalUnit as any)
    .minus({ [intervalUnit]: CHUNKS_BUFFER })
  const bufferedStartDate = startDate.minus({ [intervalUnit]: CHUNKS_BUFFER })
  const now = DateTime.now().toUTC().startOf('day')
  const endDate = getUTCDateTime(end)
    .endOf(intervalUnit as any)
    .plus({ [intervalUnit]: CHUNKS_BUFFER, millisecond: 1 })
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
