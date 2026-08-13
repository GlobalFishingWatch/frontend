import type { GeoTIFF } from '@developmentseed/geotiff'

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

export function isEmptyCell(values: number[], nodata: number | null) {
  return values.every((value) => Number.isNaN(value) || (nodata !== null && value === nodata))
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

export async function geotiffToList(
  file: File | ArrayBuffer
): Promise<{ rows: Record<string, number>[]; bands: string[] }> {
  try {
    const { GeoTIFF } = await import('@developmentseed/geotiff')
    // duck-typed rather than `instanceof ArrayBuffer`: buffers crossing a realm boundary
    // (jsdom, workers, iframes) fail that check
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
    const rows: Record<string, number>[] = []
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const values = bands.map((_, band) => getValue(band, row, col))
        if (isEmptyCell(values, nodata)) {
          continue
        }
        // xy() applies the file's affine transform, so skewed and rotated rasters work too
        const [x, y] = tiff.xy(row, col, 'center')
        const { lon, lat } = toLonLat ? toLonLat(x, y) : { lon: x, lat: y }
        const cell: Record<string, number> = { lat, lon }
        for (let b = 0; b < bands.length; b++) {
          cell[bands[b]] = values[b]
        }
        rows.push(cell)
      }
    }
    if (!rows.length) {
      throw new Error(GEOTIFF_ERRORS.InvalidData)
    }
    return { rows, bands }
  } catch (e) {
    if (e instanceof Error && GEOTIFF_ERROR_VALUES.includes(e.message)) {
      throw e
    }
    throw new Error(GEOTIFF_ERRORS.InvalidData, { cause: e })
  }
}
