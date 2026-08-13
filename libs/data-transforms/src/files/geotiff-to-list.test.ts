// @vitest-environment jsdom
// @developmentseed/geotiff parses the GDAL_METADATA tag with DOMParser, which node lacks
import fs from 'fs'
import path from 'path'

import { writeArrayBuffer } from 'geotiff'
import { describe, expect, it } from 'vitest'

import { GEOTIFF_ERRORS, geotiffToList, isEmptyCell } from './geotiff-to-list'

const WIDTH = 2
const HEIGHT = 2
const BBOX = [10, 20, 12, 24] as const

// Rasters synthesised in the test, for the cases the mock files can't cover: exact per-cell
// values, and rasters that are empty or in the wrong CRS. See ./mock/README.md.
const writeTiff = (values: number[], metadata: Record<string, any> = {}) =>
  writeArrayBuffer(values, {
    width: WIDTH,
    height: HEIGHT,
    ModelPixelScale: [1, 2, 0],
    ModelTiepoint: [0, 0, 0, BBOX[0], BBOX[3], 0],
    // 2 = geographic. @developmentseed/geotiff refuses a file without a model type
    GTModelTypeGeoKey: 2,
    GeographicTypeGeoKey: 4326,
    ...metadata,
  }) as ArrayBuffer

const readTiff = (file: string) => {
  const buffer = fs.readFileSync(path.join(__dirname, `mock/${file}`))
  // copy into this realm's ArrayBuffer: @chunkd/source-memory does an `instanceof
  // ArrayBuffer` check that a node-realm buffer fails under the jsdom environment
  return new Uint8Array(buffer).buffer as ArrayBuffer
}

describe('isEmptyCell', () => {
  it('is empty when every band is NaN or nodata', () => {
    expect(isEmptyCell([NaN, NaN], null)).toBe(true)
    expect(isEmptyCell([-9999, -9999], -9999)).toBe(true)
    expect(isEmptyCell([0], 0)).toBe(true)
  })

  it('is not empty when any band has a value', () => {
    expect(isEmptyCell([1, NaN], null)).toBe(false)
    expect(isEmptyCell([-9999, 1], -9999)).toBe(false)
  })
})

describe('geotiffToList', () => {
  it('converts every pixel to a lat/lon row', async () => {
    const { rows, bands } = await geotiffToList(writeTiff([1, 2, 3, 4]))
    expect(bands).toEqual(['band_1'])
    expect(rows).toEqual([
      { lat: 23, lon: 10.5, band_1: 1 },
      { lat: 23, lon: 11.5, band_1: 2 },
      { lat: 21, lon: 10.5, band_1: 3 },
      { lat: 21, lon: 11.5, band_1: 4 },
    ])
  })

  it('skips nodata cells', async () => {
    // 255 rather than the usual -9999: writeArrayBuffer defaults to an 8-bit sample
    const { rows } = await geotiffToList(writeTiff([1, 255, 255, 4], { GDAL_NODATA: '255' }))
    expect(rows).toEqual([
      { lat: 23, lon: 10.5, band_1: 1 },
      { lat: 21, lon: 11.5, band_1: 4 },
    ])
  })

  it('reprojects a Web Mercator raster to lon/lat', async () => {
    // 2x2, 100km pixels, origin west of the Azores — this bbox is in metres, not degrees
    const tiff = writeArrayBuffer([1, 2, 3, 4], {
      width: 2,
      height: 2,
      ModelPixelScale: [100_000, 100_000, 0],
      ModelTiepoint: [0, 0, 0, -3_700_000, 4_500_000, 0],
      GTModelTypeGeoKey: 1, // projected
      ProjectedCSTypeGeoKey: 3857,
    }) as ArrayBuffer

    const { rows } = await geotiffToList(tiff)
    expect(rows).toHaveLength(4)
    expect(rows[0].lon).toBeCloseTo(-32.7885, 3)
    expect(rows[0].lat).toBeCloseTo(37.0781, 3)
    expect(rows[3].lon).toBeCloseTo(-31.8902, 3)
    expect(rows[3].lat).toBeCloseTo(36.358, 3)
  })

  it('rejects a CRS it cannot convert', async () => {
    const tiff = writeTiff([1, 2, 3, 4], {
      GTModelTypeGeoKey: 1,
      GeographicTypeGeoKey: undefined,
      ProjectedCSTypeGeoKey: 99999,
    })
    await expect(geotiffToList(tiff)).rejects.toThrow(GEOTIFF_ERRORS.UnsupportedProjection)
  })

  it('rejects a raster with no readable data', async () => {
    await expect(geotiffToList(writeTiff([0, 0, 0, 0], { GDAL_NODATA: '0' }))).rejects.toThrow(
      GEOTIFF_ERRORS.InvalidData
    )
  })
})

describe('geotiffToList with real GDAL files', () => {
  // 125x40 Float32 EPSG:4326 raster of the Azores, see ./mock/README.md
  const AZORES_BBOX = { minLon: -33.4, maxLat: 41, lonStep: 0.1, latStep: 0.1 }

  it('reprojects a geographic CRS that is not WGS 84', async () => {
    const { rows } = await geotiffToList(readTiff('GeogToWGS84GeoKey5.tif'))

    expect(rows).toHaveLength(101 * 101)
    // Matches the file's own bounding box (9.00106, 52.00137) because the datum shift is NOT
    // applied: the PROJJSON @developmentseed/geotiff builds names the ellipsoid ("EPSG
    // ellipsoid 7004") without its axes and drops GeogTOWGS84GeoKey, so proj4 has nothing to
    // shift with. Worth ~100m on files like this one — immaterial for a gridded heatmap.
    expect(rows[0].lon).toBeCloseTo(9.00107, 4)
    expect(rows[0].lat).toBeCloseTo(52.00136, 4)
  })

  it('reads the raster into lat/lon rows, skipping nodata', async () => {
    const { rows, bands } = await geotiffToList(readTiff('gfw-azores.tif'))

    expect(bands).toEqual(['band_1'])
    // fewer than the 125x40 cells, because the ocean-only nodata cells are dropped
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.length).toBeLessThan(125 * 40)

    for (const row of rows) {
      expect(row.lon).toBeGreaterThanOrEqual(AZORES_BBOX.minLon)
      expect(row.lat).toBeLessThanOrEqual(AZORES_BBOX.maxLat)
      expect(Number.isNaN(row.band_1)).toBe(false)
    }

    // coordinates sit on pixel centres of the source grid, so snapping to the nearest
    // cell index and back returns the same value
    const firstLon = AZORES_BBOX.minLon + AZORES_BBOX.lonStep / 2
    const firstLat = AZORES_BBOX.maxLat - AZORES_BBOX.latStep / 2
    for (const row of [rows[0], rows[rows.length - 1]]) {
      const lonIndex = Math.round((row.lon - firstLon) / AZORES_BBOX.lonStep)
      const latIndex = Math.round((firstLat - row.lat) / AZORES_BBOX.latStep)
      expect(row.lon).toBeCloseTo(firstLon + lonIndex * AZORES_BBOX.lonStep, 6)
      expect(row.lat).toBeCloseTo(firstLat - latIndex * AZORES_BBOX.latStep, 6)
    }
  })
})
