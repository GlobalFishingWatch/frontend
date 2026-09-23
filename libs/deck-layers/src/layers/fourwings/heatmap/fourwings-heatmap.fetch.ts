import type { _TileLoadProps as TileLoadProps } from '@deck.gl/geo-layers'
import { parse } from '@loaders.gl/core'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type {
  FourwingsFeature,
  FourwingsInterval,
  ParseFourwingsOptions,
} from '@globalfishingwatch/deck-loaders'
import { descaleFourwingsValue, FourwingsLoader } from '@globalfishingwatch/deck-loaders'

import { IS_TEST_ENV } from '#config/layers.config'
import type { FourwingsDeckSublayer } from '#layers/fourwings/fourwings.types'
import { EMPTY_FOURWINGS_TILE_DATA } from '#layers/fourwings/fourwings-tile.utils'

import type {
  FourwingsAggregationOperation,
  FourwingsChunk,
  FourwingsIntervalCacheMode,
} from './fourwings-heatmap.types'
import { getDataUrl } from './fourwings-heatmap.utils'

export type FetchFourwingsTileDataParams<S extends FourwingsDeckSublayer = FourwingsDeckSublayer> =
  {
    tile: TileLoadProps
    chunk: FourwingsChunk
    interval: FourwingsInterval
    sublayers: S[]
    /** Overrides the default `getDataUrl` shape — the static layer sends no interval */
    getUrl?: (sublayer: S, sublayerIndex: number) => string
    /** Time range the parser precomputes `initialValues` for */
    startTime: number
    endTime: number
    aggregationOperation?: FourwingsAggregationOperation
    tilesUrl?: string
    extentStart?: number
    intervalCacheMode?: FourwingsIntervalCacheMode
    temporalAggregation?: boolean
    /** Called with the de-scaled `X-bins-0` header of each sublayer, when present */
    onBins?: (bins: number[], sublayerIndex: number) => void
  }

export type FourwingsTileHeaders = {
  cols: number[]
  rows: number[]
  scale: number[]
  offset: number[]
  noDataValue: number[]
}

function readNumberHeader(headers: Headers, name: string): number | undefined {
  const raw = headers.get(name)
  if (raw === null) {
    return undefined
  }
  const value = Number(raw)
  return Number.isFinite(value) ? value : undefined
}

export function readFourwingsHeaders(
  response: Response,
  sublayerIndex: number,
  target: FourwingsTileHeaders = { cols: [], rows: [], scale: [], offset: [], noDataValue: [] }
): FourwingsTileHeaders {
  const { headers } = response
  const cols = readNumberHeader(headers, 'X-columns')
  const rows = readNumberHeader(headers, 'X-rows')
  const scale = readNumberHeader(headers, 'X-scale')
  const offset = readNumberHeader(headers, 'X-offset')
  const noDataValue = readNumberHeader(headers, 'X-empty-value')
  if (cols !== undefined) {
    target.cols[sublayerIndex] = cols
  }
  if (rows !== undefined) {
    target.rows[sublayerIndex] = rows
  }
  if (scale !== undefined) {
    target.scale[sublayerIndex] = scale
  }
  if (offset !== undefined) {
    target.offset[sublayerIndex] = offset
  }
  if (noDataValue !== undefined) {
    target.noDataValue[sublayerIndex] = noDataValue
  }
  return target
}

export type FourwingsTileBuffers = {
  buffers: ArrayBuffer[]
  buffersLength: number[]
  headers: FourwingsTileHeaders
}

/**
 * Fetches one 4wings binary tile per url and returns the raw buffers plus their headers.
 */
export async function fetchFourwingsTileBuffers({
  urls,
  signal,
  onBins,
}: {
  urls: string[]
  signal?: AbortSignal
  /** Called with the de-scaled `X-bins-0` header of each url, when present */
  onBins?: (bins: number[], sublayerIndex: number) => void
}): Promise<FourwingsTileBuffers> {
  const headers: FourwingsTileHeaders = {
    cols: [],
    rows: [],
    scale: [],
    offset: [],
    noDataValue: [],
  }

  const getBuffer = async (url: string, sublayerIndex: number) => {
    const response = await GFWAPI.fetch<Response>(url, {
      signal,
      responseType: 'default',
    })
    if (response.status >= 400 && response.status !== 404) {
      throw new Error(response.statusText || String(response.status))
    }
    readFourwingsHeaders(response, sublayerIndex, headers)
    if (onBins) {
      const bins = JSON.parse(response.headers.get('X-bins-0') as string)?.map((n: string) =>
        descaleFourwingsValue(
          parseInt(n),
          headers.scale[sublayerIndex],
          headers.offset[sublayerIndex]
        )
      )
      if (bins?.length) {
        onBins(bins, sublayerIndex)
      }
    }
    return await response.arrayBuffer()
  }

  const settledPromises = await Promise.allSettled(urls.map(getBuffer))

  const hasChunkError = settledPromises.some(
    (p) => p.status === 'rejected' && p.reason.status !== 404
  )
  if (hasChunkError) {
    const error =
      (settledPromises.find((p) => p.status === 'rejected' && p.reason.statusText) as any)?.reason
        .statusText || 'Error loading chunk'
    throw new Error(error)
  }

  const buffersLength = settledPromises.map((p) =>
    p.status === 'fulfilled' && p.value !== undefined ? p.value.byteLength : 0
  )
  const buffers = settledPromises.flatMap((d) =>
    d.status === 'fulfilled' && d.value !== undefined ? d.value : []
  ) as ArrayBuffer[]
  // Release settled promise refs before the worker await to allow GC during transfer
  settledPromises.length = 0

  return { buffers, buffersLength, headers }
}

/** Requests one 4wings binary tile per visible sublayer and parses them into cells */
export async function fetchFourwingsTileData<
  S extends FourwingsDeckSublayer = FourwingsDeckSublayer,
>({
  tile,
  chunk,
  interval,
  sublayers,
  startTime,
  endTime,
  aggregationOperation,
  tilesUrl,
  extentStart,
  intervalCacheMode,
  temporalAggregation,
  getUrl,
  onBins,
}: FetchFourwingsTileDataParams<S>): Promise<FourwingsFeature[]> {
  const visibleSublayers = sublayers.filter((sublayer) => sublayer.visible)
  const urls = visibleSublayers.map(
    (sublayer, sublayerIndex) =>
      getUrl?.(sublayer, sublayerIndex) ??
      (getDataUrl({
        tile,
        chunk,
        sublayer,
        tilesUrl,
        extentStart,
        intervalCacheMode,
        temporalAggregation,
      }) as string)
  )

  const { buffers, buffersLength, headers } = await fetchFourwingsTileBuffers({
    urls,
    signal: tile.signal,
    onBins,
  })

  if (tile.signal?.aborted) {
    return EMPTY_FOURWINGS_TILE_DATA
  }

  const data = await parse(buffers, FourwingsLoader, {
    worker: !IS_TEST_ENV,
    fourwings: {
      sublayers: 1,
      ...headers,
      bufferedStartDate: chunk.bufferedStart,
      initialTimeRange: {
        start: startTime,
        end: endTime,
      },
      interval,
      // decides the cell layout the parser reads: frames, or one value per cell
      temporalAggregation,
      tile,
      aggregationOperation,
      buffersLength,
    } as ParseFourwingsOptions,
  })

  if (tile.signal?.aborted) {
    return EMPTY_FOURWINGS_TILE_DATA
  }

  return data
}
