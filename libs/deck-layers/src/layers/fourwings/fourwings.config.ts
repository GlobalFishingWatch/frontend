import type { DateTimeUnit } from 'luxon'

import { API_GATEWAY, API_VERSION } from '@globalfishingwatch/api-client'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

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
export const POSITIONS_ID = 'positions'
export const FOOTPRINT_ID = 'footprint'
export const FOOTPRINT_HIGH_RES_ID = `${FOOTPRINT_ID}-high-res`
export const FOURWINGS_VISUALIZATION_MODES = [
  HEATMAP_ID,
  HEATMAP_HIGH_RES_ID,
  HEATMAP_LOW_RES_ID,
  POSITIONS_ID,
  FOOTPRINT_ID,
  FOOTPRINT_HIGH_RES_ID,
] as const

export const SUPPORTED_POSITION_PROPERTIES = [
  /*'speed',*/
  'bearing',
  'shipname',
  'vessel_id',
  'course',
]

export const FOURWINGS_MAX_ZOOM = 12
export const VECTORS_MAX_ZOOM = 12
export const FOURWINGS_TILE_SIZE = 512
// Caps the bytes retained per tileset cache to avoid browser out-of-memory
// crashes in long sessions. Byte-based instead of tile count because tile
// size varies by orders of magnitude with interval and zoom. Relies on the
// byteLength estimate the fourwings loader stamps on each parsed tile
export const FOURWINGS_MAX_CACHE_BYTE_SIZE = 256 * 1024 * 1024
export const MAX_ZOOM_TO_CLUSTER_POINTS = 4.5
export const MAX_POSITIONS_PER_TILE_SUPPORTED = 5000
export const POSITIONS_VISUALIZATION_MAX_ZOOM = 12

export const MAX_RAMP_VALUES = 10000

export const DYNAMIC_RAMP_CHANGE_THRESHOLD = 50
export const DYNAMIC_RAMP_VECTOR_CHANGE_THRESHOLD = 1

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

export const CHUNKS_BUFFER = 1
