// @vitest-environment jsdom
// geotiff.js reads a Blob through FileReader, which node does not expose as a global
import fs from 'fs'
import path from 'path'

import { writeArrayBuffer } from 'geotiff'
import { describe, expect, it } from 'vitest'

import { GEOTIFF_ERRORS, getGeotiffBandsCount } from './geotiff-bands'

const writeTiff = (values: number[], samplesPerPixel = 1) =>
  new Blob([
    writeArrayBuffer(values, {
      width: 2,
      height: 2,
      SamplesPerPixel: samplesPerPixel,
      ModelPixelScale: [1, 2, 0],
      ModelTiepoint: [0, 0, 0, 10, 24, 0],
      GTModelTypeGeoKey: 2,
      GeographicTypeGeoKey: 4326,
    }) as ArrayBuffer,
  ])

describe('getGeotiffBandsCount', () => {
  it('counts one band per sample', async () => {
    expect(await getGeotiffBandsCount(writeTiff([1, 2, 3, 4]))).toBe(1)
    expect(await getGeotiffBandsCount(writeTiff([1, 2, 3, 4, 5, 6, 7, 8], 2))).toBe(2)
  })

  it('reads a real GDAL file', async () => {
    // 125x40 Float32 EPSG:4326 raster of the Azores, see ./mock/README.md
    const buffer = fs.readFileSync(path.join(__dirname, 'mock/gfw-azores.tif'))
    expect(await getGeotiffBandsCount(new Blob([buffer]))).toBe(1)
  })

  it('rejects a file it cannot read', async () => {
    await expect(getGeotiffBandsCount(new Blob(['not a tiff']))).rejects.toThrow(
      GEOTIFF_ERRORS.InvalidData
    )
  })
})
