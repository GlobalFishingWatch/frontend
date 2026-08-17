import type { GeoTIFF } from '@developmentseed/geotiff'

import { USER_FOURWINGS_VALUE_COLUMN } from '@globalfishingwatch/api-types'
import { FOURWINGS_TILE_COLUMNS } from '@globalfishingwatch/deck-loaders'

const MAX_CELLS = 10_000_000
const EPSG_4326 = 4326

/** Thrown as the error message — consumers map these to their own user-facing copy. */
export const GEOTIFF_ERRORS = {
  UnsupportedProjection: 'UNSUPPORTED_PROJECTION',
  TooLarge: 'TOO_LARGE',
  InvalidData: 'INVALID_DATA',
} as const

export type GeotiffError = (typeof GEOTIFF_ERRORS)[keyof typeof GEOTIFF_ERRORS]

const GEOTIFF_ERROR_VALUES = Object.values(GEOTIFF_ERRORS) as string[]

export function isEmptyValue(value: number, nodata: number | null) {
  return Number.isNaN(value) || (nodata !== null && value === nodata)
}

type LonLatConverter = (x: number, y: number) => { lon: number; lat: number }

/**
 * Builds a converter from the file's own CRS to WGS 84 lon/lat, or null when the file already
 * is WGS 84.
 *
 * `GeoTIFF.crs` hands back either an EPSG code or, for user-defined CRSs, a PROJJSON object
 * it assembles from the geokeys. proj4 accepts both, so no EPSG lookup table is needed — that
 * is why there is no `geotiff-geokeys-to-proj4` here (it would add ~5MB for the same result).
 * proj4 is imported lazily since a WGS 84 file never needs it.
 */
async function getLonLatConverter(crs: GeoTIFF['crs']): Promise<LonLatConverter | null> {
  if (crs === EPSG_4326) {
    return null
  }
  const proj4 = (await import('proj4')).default
  let transform: { forward: (coords: number[]) => number[] } | undefined
  try {
    // proj4 knows EPSG:4326/3857 and the UTM zones offline; other codes it cannot resolve
    // without a definition, and it throws
    transform = proj4(typeof crs === 'number' ? `EPSG:${crs}` : (crs as any), 'EPSG:4326')
  } catch {
    throw new Error(GEOTIFF_ERRORS.UnsupportedProjection)
  }
  if (!transform) {
    throw new Error(GEOTIFF_ERRORS.UnsupportedProjection)
  }
  return (x, y) => {
    const [lon, lat] = transform.forward([x, y])
    return { lon, lat }
  }
}

type ReadBands = (band: number, row: number, col: number) => number

/**
 * Reads every band into memory, as one value lookup.
 *
 * @developmentseed/geotiff reads tiles, which is all a COG needs, but plain GDAL output is
 * striped unless it was written with `TILED=YES` — every sample file we have is striped, and
 * `fetchTile` refuses those. So tiled files go through it (masks and overviews handled for
 * us) and striped ones fall back to geotiff.js, which reads both layouts.
 */
async function readBands(tiff: GeoTIFF, buffer: ArrayBuffer): Promise<ReadBands> {
  if (tiff.isTiled) {
    const { assembleTiles } = await import('@developmentseed/geotiff')
    const tileCoords: [number, number][] = []
    for (let y = 0; y < tiff.tileCount.y; y++) {
      for (let x = 0; x < tiff.tileCount.x; x++) {
        tileCoords.push([x, y])
      }
    }
    // Assemble at whole-tile size and index within that. Passing the image's real size trips
    // assembleTiles' grid validation whenever the image is smaller than one tile — it
    // compares against width/tileWidth without rounding up, so a 125x40 image in a 512x512
    // tile is "expected 0.019 tiles".
    const stride = tiff.tileCount.x * tiff.tileWidth
    const raster = assembleTiles(await tiff.fetchTiles(tileCoords), {
      width: stride,
      height: tiff.tileCount.y * tiff.tileHeight,
      tileWidth: tiff.tileWidth,
      tileHeight: tiff.tileHeight,
      minCol: 0,
      minRow: 0,
    })
    // the library exposes toBandSeparate() but does not re-export it, and reading either
    // layout directly is a one-liner
    return raster.layout === 'band-separate'
      ? (band, row, col) => raster.bands[band][row * stride + col] as number
      : (band, row, col) => raster.data[(row * stride + col) * raster.count + band] as number
  }

  const { fromArrayBuffer } = await import('geotiff')
  const image = await (await fromArrayBuffer(buffer)).getImage()
  const rasters = await image.readRasters()
  const samples = (Array.isArray(rasters) ? rasters : [rasters]) as ArrayLike<number>[]
  const stride = image.getWidth()
  return (band, row, col) => samples[band][row * stride + col] as number
}

export type GeotiffBandStats = { min: number; max: number }

// from deck-layers' fourwings.config to avoid a circular dependency
const FOURWINGS_MAX_ZOOM = 12

/**
 * Deepest zoom a raster of this resolution can fit in 4wings api tiles cells
 *
 * @param resolution degrees per pixel, as returned by {@link geotiffToList}
 */
export const getGriddedMaxZoom = (resolution?: number) => {
  if (!resolution) {
    return FOURWINGS_MAX_ZOOM
  }
  const zoom = Math.log2(360 / (FOURWINGS_TILE_COLUMNS * resolution))
  return Math.max(0, Math.min(FOURWINGS_MAX_ZOOM, Math.floor(zoom)))
}

export const getGriddedTileEncoding = (stats?: GeotiffBandStats) => {
  if (!stats || !Number.isFinite(stats.min) || !Number.isFinite(stats.max)) {
    return { tileScale: 1, tileOffset: 0 }
  }
  return {
    tileScale: 0.001,
    tileOffset: stats.min < 0 ? Math.ceil(-stats.min) : 0,
  }
}

/**
 * Size of one pixel in degrees, measured at the centre of the raster and after reprojection,
 * so it reflects what the uploaded lon/lat spacing actually is. The coarser of the two axes,
 * since that is what governs where gaps would appear. Undefined for a single-pixel raster.
 */
function getResolutionInDegrees(tiff: GeoTIFF, toLonLat: LonLatConverter | null) {
  if (tiff.width < 2 && tiff.height < 2) {
    return undefined
  }
  const row = Math.min(Math.floor(tiff.height / 2), tiff.height - 1)
  const col = Math.min(Math.floor(tiff.width / 2), tiff.width - 1)
  // step back instead of forward at the edges, so a 2x2 raster still has a neighbour
  const nextRow = row + 1 < tiff.height ? row + 1 : row - 1
  const nextCol = col + 1 < tiff.width ? col + 1 : col - 1
  const toDegrees = (r: number, c: number) => {
    const [x, y] = tiff.xy(r, c, 'center')
    return toLonLat ? toLonLat(x, y) : { lon: x, lat: y }
  }
  const from = toDegrees(row, col)
  const to = toDegrees(Math.max(nextRow, 0), Math.max(nextCol, 0))
  const resolution = Math.max(Math.abs(to.lon - from.lon), Math.abs(to.lat - from.lat))
  return resolution > 0 ? resolution : undefined
}

/**
 * Not using `tiff.bbox`, which is in the file's own CRS: this goes through `xy()` like the rest of the file
 */
function getBboxInDegrees(tiff: GeoTIFF, toLonLat: LonLatConverter | null): Bbox {
  const lastRow = tiff.height - 1
  const lastCol = tiff.width - 1
  const corners: [number, number, 'ul' | 'ur' | 'll' | 'lr'][] = [
    [0, 0, 'ul'],
    [0, lastCol, 'ur'],
    [lastRow, 0, 'll'],
    [lastRow, lastCol, 'lr'],
  ]
  const bbox: Bbox = [Infinity, Infinity, -Infinity, -Infinity]
  for (const [row, col, offset] of corners) {
    const [x, y] = tiff.xy(row, col, offset)
    const { lon, lat } = toLonLat ? toLonLat(x, y) : { lon: x, lat: y }
    bbox[0] = Math.min(bbox[0], lon)
    bbox[1] = Math.min(bbox[1], lat)
    bbox[2] = Math.max(bbox[2], lon)
    bbox[3] = Math.max(bbox[3], lat)
  }
  return bbox
}

export type GeotiffRow = {
  lat: number
  lon: number
  band: string
  [USER_FOURWINGS_VALUE_COLUMN]: number
}

export async function geotiffToList(file: File | ArrayBuffer): Promise<{
  rows: GeotiffRow[]
  bands: string[]
  /** Degrees per pixel */
  resolution: number | undefined
  /** Value range across every band */
  stats: GeotiffBandStats
  /** Full raster extent, [minLon, minLat, maxLon, maxLat] — includes any nodata margin */
  bbox: Bbox
}> {
  try {
    const { GeoTIFF } = await import('@developmentseed/geotiff')
    const buffer =
      typeof (file as File).arrayBuffer === 'function'
        ? await (file as File).arrayBuffer()
        : (file as ArrayBuffer)
    const tiff = await GeoTIFF.fromArrayBuffer(buffer)

    const { width, height, count, nodata } = tiff
    if (width * height > MAX_CELLS) {
      throw new Error(GEOTIFF_ERRORS.TooLarge)
    }
    if (!count) {
      throw new Error(GEOTIFF_ERRORS.InvalidData)
    }

    const toLonLat = await getLonLatConverter(tiff.crs)
    const getValue = await readBands(tiff, buffer)

    const bands = Array.from({ length: count }, (_, index) => `band_${index + 1}`)
    const stats: GeotiffBandStats = { min: Infinity, max: -Infinity }
    const rows: GeotiffRow[] = []
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        // only worth reprojecting once a band in this cell turns out to hold data
        let lonLat: { lon: number; lat: number } | undefined
        for (let b = 0; b < bands.length; b++) {
          const value = getValue(b, row, col)
          if (isEmptyValue(value, nodata)) {
            continue
          }
          if (!lonLat) {
            // xy() applies the file's affine transform, so skewed and rotated rasters work too
            const [x, y] = tiff.xy(row, col, 'center')
            lonLat = toLonLat ? toLonLat(x, y) : { lon: x, lat: y }
          }
          rows.push({
            lat: lonLat.lat,
            lon: lonLat.lon,
            [USER_FOURWINGS_VALUE_COLUMN]: value,
            band: bands[b],
          })
          if (value < stats.min) {
            stats.min = value
          }
          if (value > stats.max) {
            stats.max = value
          }
        }
      }
    }
    if (!rows.length) {
      throw new Error(GEOTIFF_ERRORS.InvalidData)
    }
    return {
      rows,
      bands,
      resolution: getResolutionInDegrees(tiff, toLonLat),
      stats,
      bbox: getBboxInDegrees(tiff, toLonLat),
    }
  } catch (e) {
    if (e instanceof Error && GEOTIFF_ERROR_VALUES.includes(e.message)) {
      throw e
    }
    throw new Error(GEOTIFF_ERRORS.InvalidData, { cause: e })
  }
}
