/** Thrown as the error message — consumers map these to their own user-facing copy. */
export const GEOTIFF_ERRORS = {
  InvalidData: 'INVALID_DATA',
} as const

export type GeotiffError = (typeof GEOTIFF_ERRORS)[keyof typeof GEOTIFF_ERRORS]

/**
 * Band names for a GeoTIFF, in file order only the header bytes are loaded
 */
export async function getGeotiffBands(file: Blob): Promise<string[]> {
  try {
    const { fromBlob } = await import('geotiff')
    const image = await (await fromBlob(file)).getImage()
    const count = image.getSamplesPerPixel()
    if (!count) {
      throw new Error(GEOTIFF_ERRORS.InvalidData)
    }
    return Array.from({ length: count }, (_, index) => `band_${index + 1}`)
  } catch (e) {
    throw new Error(GEOTIFF_ERRORS.InvalidData, { cause: e })
  }
}
