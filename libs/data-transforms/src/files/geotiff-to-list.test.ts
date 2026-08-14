// @vitest-environment jsdom
// @developmentseed/geotiff parses the GDAL_METADATA tag with DOMParser, which node lacks
import fs from 'fs'
import path from 'path'

import { writeArrayBuffer } from 'geotiff'
import { describe, expect, it } from 'vitest'

import {
  GEOTIFF_ERRORS,
  geotiffToList,
  getGriddedMaxZoom,
  getGriddedTileEncoding,
  isEmptyCell,
  isEmptyValue,
} from './geotiff-to-list'

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

describe('isEmptyValue', () => {
  it('is empty when NaN or nodata', () => {
    expect(isEmptyValue(NaN, null)).toBe(true)
    expect(isEmptyValue(-9999, -9999)).toBe(true)
    expect(isEmptyValue(0, 0)).toBe(true)
  })

  it('is not empty for a real value', () => {
    expect(isEmptyValue(1, null)).toBe(false)
    expect(isEmptyValue(0, -9999)).toBe(false)
  })
})

describe('isEmptyCell', () => {
  it('is empty when every band is nodata, NaN or zero', () => {
    expect(isEmptyCell([0, 0, 0], null)).toBe(true)
    expect(isEmptyCell([NaN, 0], null)).toBe(true)
    expect(isEmptyCell([-9999, 0], -9999)).toBe(true)
  })

  it('keeps a cell where any band measured something', () => {
    expect(isEmptyCell([0, 0, 3], null)).toBe(false)
    expect(isEmptyCell([-1, 0], null)).toBe(false)
  })
})

describe('geotiffToList', () => {
  it('converts every pixel to a lat/lon row', async () => {
    const { rows, bands } = await geotiffToList(writeTiff([1, 2, 3, 4]))
    expect(bands).toEqual(['band_1'])
    expect(rows).toEqual([
      { lat: 23, lon: 10.5, gfw_value: 1, band: 'band_1' },
      { lat: 23, lon: 11.5, gfw_value: 2, band: 'band_1' },
      { lat: 21, lon: 10.5, gfw_value: 3, band: 'band_1' },
      { lat: 21, lon: 11.5, gfw_value: 4, band: 'band_1' },
    ])
  })

  it('emits one row per band and drops only the nodata ones', async () => {
    // 2 bands interleaved per pixel; 255 rather than the usual -9999 because
    // writeArrayBuffer defaults to an 8-bit sample
    const { rows, bands } = await geotiffToList(
      writeTiff([1, 10, 2, 255, 255, 255, 4, 40], { GDAL_NODATA: '255' })
    )
    expect(bands).toEqual(['band_1', 'band_2'])
    expect(rows).toEqual([
      { lat: 23, lon: 10.5, gfw_value: 1, band: 'band_1' },
      { lat: 23, lon: 10.5, gfw_value: 10, band: 'band_2' },
      // band_2 of this cell is nodata, so only band_1 survives
      { lat: 23, lon: 11.5, gfw_value: 2, band: 'band_1' },
      // the whole third cell is nodata
      { lat: 21, lon: 11.5, gfw_value: 4, band: 'band_1' },
      { lat: 21, lon: 11.5, gfw_value: 40, band: 'band_2' },
    ])
  })

  it('skips a cell whose every band is zero, but keeps a zero beside a real value', async () => {
    // cell 1 all-zero across both bands, cell 4 has a zero band next to a measurement
    const { rows } = await geotiffToList(writeTiff([0, 0, 1, 2, 3, 4, 0, 6]))
    expect(rows).toEqual([
      { lat: 23, lon: 11.5, gfw_value: 1, band: 'band_1' },
      { lat: 23, lon: 11.5, gfw_value: 2, band: 'band_2' },
      { lat: 21, lon: 10.5, gfw_value: 3, band: 'band_1' },
      { lat: 21, lon: 10.5, gfw_value: 4, band: 'band_2' },
      { lat: 21, lon: 11.5, gfw_value: 0, band: 'band_1' },
      { lat: 21, lon: 11.5, gfw_value: 6, band: 'band_2' },
    ])
  })

  it('skips nodata cells', async () => {
    const { rows } = await geotiffToList(writeTiff([1, 255, 255, 4], { GDAL_NODATA: '255' }))
    expect(rows).toEqual([
      { lat: 23, lon: 10.5, gfw_value: 1, band: 'band_1' },
      { lat: 21, lon: 11.5, gfw_value: 4, band: 'band_1' },
    ])
  })

  it('reports the pixel size in degrees and the value range across bands', async () => {
    // BBOX is 2 degrees wide and 4 tall over a 2x2 raster, so pixels are 1 x 2 degrees
    const { resolution, stats } = await geotiffToList(writeTiff([1, 2, 3, 4]))
    expect(resolution).toBeCloseTo(2, 6)
    expect(stats).toEqual({ min: 1, max: 4 })
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

    // fewer than the 101x101 cells: the file declares no nodata and pads with zeros
    expect(rows).toHaveLength(9164)
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
      expect(row.band).toBe('band_1')
      expect(Number.isNaN(row.gfw_value)).toBe(false)
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

describe('getGriddedMaxZoom', () => {
  it('caps the zoom where 4wings cells would get finer than the source pixels', () => {
    expect(getGriddedMaxZoom(0.1)).toBe(4) // gfw-azores.tif
    expect(getGriddedMaxZoom(1)).toBe(1) // nz_habitat_anticross_4326_1deg.tif
    expect(getGriddedMaxZoom(0.059626)).toBe(5) // wind_direction.tif
    expect(getGriddedMaxZoom(0.001511)).toBe(11) // utm.tif, reprojected
  })

  it('stays inside the 4wings zoom range', () => {
    expect(getGriddedMaxZoom(0.000001)).toBe(12)
    expect(getGriddedMaxZoom(180)).toBe(0)
  })

  it('falls back to the maximum when the resolution is unknown', () => {
    expect(getGriddedMaxZoom(undefined)).toBe(12)
    expect(getGriddedMaxZoom(0)).toBe(12)
  })
})

describe('getGriddedTileEncoding', () => {
  it('shifts negatives up so they survive an unsigned varint', () => {
    // wind_direction.tif: decoding -32767 back out needs the offset
    const { tileScale, tileOffset } = getGriddedTileEncoding({ min: -32767, max: 358.4 })
    expect(tileOffset).toBe(32767)
    expect((0 + tileOffset) / tileScale).toBeGreaterThan(0)
    // round trip: encoded value decodes back to the original
    const encoded = Math.round((-32767 + tileOffset) / tileScale)
    expect(encoded * tileScale - tileOffset).toBeCloseTo(-32767, 6)
  })

  it('leaves positive-only bands unshifted', () => {
    expect(getGriddedTileEncoding({ min: 0.04, max: 572.98 })).toEqual({
      tileScale: 0.001,
      tileOffset: 0,
    })
  })

  it('keeps the same 3-decimal step whatever the range', () => {
    expect(getGriddedTileEncoding({ min: 0, max: 1e12 }).tileScale).toBe(0.001)
    expect(getGriddedTileEncoding({ min: 0, max: 1 }).tileScale).toBe(0.001)
  })

  it('falls back to a no-op encoding without usable stats', () => {
    expect(getGriddedTileEncoding(undefined)).toEqual({ tileScale: 1, tileOffset: 0 })
    expect(getGriddedTileEncoding({ min: Infinity, max: -Infinity })).toEqual({
      tileScale: 1,
      tileOffset: 0,
    })
  })
})
