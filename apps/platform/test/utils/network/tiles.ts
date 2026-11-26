import { PbfWriter as Pbf } from 'pbf'
import { commands } from 'vitest/browser'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { CONFIG_BY_INTERVAL } from '@globalfishingwatch/deck-loaders'

import { TEST_END_DATE } from '../../setup/config'

import type { Handler, MockRequest } from './mock-network'
import { binary, fetchFromNetwork, get, IS_RECORD_MODE } from './mock-network'

/**
 * Synthetic 4wings heatmap tiles.
 *
 * Every cell of the grid gets a value on one day (DATA_DAY), so any click or hover on the map lands
 * on data and the shown value is known in advance. Values are uniform by default, which is enough
 * for "is there data" checks but flattens colour ramps, percentiles and timeseries; pass a `value`
 * function, or a handler of your own, when a test needs values that vary.
 *
 * The encoding mirrors libs/deck-loaders/src/fourwings/lib/fourwings-test-fixtures.ts (one packed
 * varint field). That file is not exported by the published lib, so it is copied here — keep the
 * two in sync if the 4wings format changes:
 * - default:                      cellNum, startFrame, endFrame, ...one value per frame
 * - `temporal-aggregation=true`:  cellNum, value (the whole range in one number)
 */

/*
 * The grid has to be the API's own. A click sends the clicked cell's column and row to
 * `/4wings/interaction/{z}/{x}/{y}/{col}/{row}`, and the API reads them on its grid: with any other
 * grid the recorded answer lists the vessels of a different spot on the ocean.
 *
 * The API uses 113 columns, and a row count that depends on the tile (53 at z0, 83 for 2/2/1, 103
 * for 3/3/3) and follows no rounding rule we could find. So record mode reads `X-columns` /
 * `X-rows` from the real tile and saves them per z/x/y under GRID_DIR; replay reads them back.
 */
const API_TILE_COLUMNS = 113
const GRID_DIR = 'test/fixtures/api/heatmap-grid'

type TileGrid = { cols: number; rows: number }
const gridCache = new Map<string, Promise<TileGrid>>()

/** Close to the API's rows (cells square in degrees), but off by one on some tiles. */
function approximateGrid(z: number, y: number): TileGrid {
  const lat = (tileY: number) =>
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * tileY) / 2 ** z))) * 180) / Math.PI
  const rows = Math.round((API_TILE_COLUMNS * (lat(y) - lat(y + 1))) / (360 / 2 ** z))
  return { cols: API_TILE_COLUMNS, rows }
}

async function readOrRecordGrid(request: MockRequest): Promise<TileGrid> {
  const { z, x, y } = request.params
  const path = `${GRID_DIR}/${z}-${x}-${y}.json`
  if (IS_RECORD_MODE) {
    const response = await fetchFromNetwork(request.url, request.init)
    await response.body?.cancel()
    const grid = {
      cols: Number(response.headers.get('x-columns')),
      rows: Number(response.headers.get('x-rows')),
    }
    if (grid.cols && grid.rows) {
      await commands.writeFile(path, JSON.stringify(grid))
      return grid
    }
  }
  try {
    return JSON.parse(await commands.readFile(path)) as TileGrid
  } catch {
    console.warn(`[tiles] no recorded grid for ${z}/${x}/${y}; map clicks there may miss`)
    return approximateGrid(Number(z), Number(y))
  }
}

function getTileGrid(request: MockRequest) {
  const { z, x, y } = request.params
  const key = `${z}/${x}/${y}`
  if (!gridCache.has(key)) gridCache.set(key, readOrRecordGrid(request))
  return gridCache.get(key)!
}

// The earliest date the timebar offers. YEAR requests carry no date-range.
const DATA_START = Date.UTC(2012, 0, 1)

/*
 * Every cell holds data on ONE day: DATA_DAY, 30 days before TEST_END_DATE, inside the default
 * visible range. Filling every day of the range instead (~11k cells × ~150 days per tile on the
 * API grid) made the parser build hundreds of MB of cell objects for a global report, and Chromium
 * killed the page ("Browser connection was closed"). The real API is sparse too.
 * A range that excludes this day has no data (the "no data" report spec relies on it).
 */
export const DATA_DAY = Date.parse(TEST_END_DATE) - 30 * 24 * 60 * 60 * 1000

type HeatmapTileOptions = {
  /** Value per cell. Can depend on the request (datasets, filters, interval). */
  value?: number | ((request: MockRequest) => number)
}

/** The frame holding DATA_DAY at the requested interval, or undefined if outside the range. */
function getDataFrame(url: URL) {
  const interval = (url.searchParams.get('interval') ?? 'DAY') as FourwingsInterval
  const config = CONFIG_BY_INTERVAL[interval] ?? CONFIG_BY_INTERVAL.DAY
  const [start, end] = (url.searchParams.get('date-range') ?? '')
    .split(',')
    .map((date) => Date.parse(date))
  const startMs = Number.isFinite(start) ? start : DATA_START
  const endMs = Number.isFinite(end) ? end : Date.now()
  if (DATA_DAY < startMs || DATA_DAY >= endMs) return undefined // date-range is end-exclusive
  // HOUR and DAY frames are a plain division, so a timestamp inside a frame gives a fraction.
  return Math.floor(config.getIntervalFrame(DATA_DAY))
}

function toArrayBuffer(pbf: Pbf) {
  const bytes = pbf.finish()
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

function packTile(packed: Uint32Array) {
  const pbf = new Pbf()
  pbf.writePackedVarint(1, packed as unknown as number[])
  return toArrayBuffer(pbf)
}

/** One frame per cell: `cellNum, frame, frame, value`. */
export function createSyntheticHeatmapBuffer(cells: number, frame: number, value: number) {
  const packed = new Uint32Array(cells * 4)
  for (let cellNum = 0, i = 0; cellNum < cells; cellNum++) {
    packed[i++] = cellNum
    packed[i++] = frame
    packed[i++] = frame
    packed[i++] = value
  }
  return packTile(packed)
}

/** `temporal-aggregation=true`: `cellNum, value`. */
export function createSyntheticAggregatedBuffer(cells: number, value: number) {
  const packed = new Uint32Array(cells * 2)
  for (let cellNum = 0; cellNum < cells; cellNum++) {
    packed[cellNum * 2] = cellNum
    packed[cellNum * 2 + 1] = value
  }
  return packTile(packed)
}

const getSyntheticTileHeaders = ({ cols, rows }: TileGrid) => ({
  'X-columns': String(cols),
  'X-rows': String(rows),
  // scale 1 / offset 0: the varint on the wire is the value shown in the UI
  'X-scale': '1',
  'X-offset': '0',
  'X-empty-value': '4294967295',
})

/** Answers every `/4wings/tile/heatmap/{z}/{x}/{y}` request with a tile full of data. */
export function heatmapTile({ value = 1 }: HeatmapTileOptions = {}): Handler {
  return get('/v3/4wings/tile/heatmap/:z/:x/:y', async (request) => {
    const cellValue = typeof value === 'function' ? value(request) : value
    const grid = await getTileGrid(request)
    const headers = getSyntheticTileHeaders(grid)
    const frame = getDataFrame(request.url)
    if (frame === undefined) {
      // No data in this range: an empty tile, as the API sends
      return binary(new ArrayBuffer(0), headers)(request)
    }
    const cells = grid.cols * grid.rows
    const buffer =
      request.url.searchParams.get('temporal-aggregation') === 'true'
        ? createSyntheticAggregatedBuffer(cells, cellValue)
        : createSyntheticHeatmapBuffer(cells, frame, cellValue)
    return binary(buffer, headers)(request)
  })
}
