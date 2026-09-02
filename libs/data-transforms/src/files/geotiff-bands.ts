/** Thrown as the error message — consumers map these to their own user-facing copy. */
export const GEOTIFF_ERRORS = {
  InvalidData: 'INVALID_DATA',
} as const

export type GeotiffError = (typeof GEOTIFF_ERRORS)[keyof typeof GEOTIFF_ERRORS]

/**
 * Number of bands in a GeoTIFF, only the header bytes are loaded.
 * Bands are addressed by their GDAL index (1-based, file order).
 */
export async function getGeotiffBandsCount(file: Blob): Promise<number> {
  try {
    const { fromBlob } = await import('geotiff')
    const image = await (await fromBlob(file)).getImage()
    const count = image.getSamplesPerPixel()
    if (!count) {
      throw new Error(GEOTIFF_ERRORS.InvalidData)
    }
    return count
  } catch (e) {
    throw new Error(GEOTIFF_ERRORS.InvalidData, { cause: e })
  }
}
