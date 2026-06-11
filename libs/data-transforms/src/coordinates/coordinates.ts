import { convert } from 'geo-coordinates-parser'

/**
 * Checks a longitude or latitude value is safe to project on the map.
 * Guards against null, undefined, '' and non-numeric strings, but allows 0.
 */
export const isValidCoordinate = (value: number | string | null | undefined): boolean => {
  if (value == null || value === '') return false
  return Number.isFinite(Number(value))
}

export const parseCoords = (
  latitude: number | string,
  longitude: number | string
): { latitude: number; longitude: number } | null => {
  if (!latitude || !longitude) return null
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    return { latitude, longitude }
  }
  try {
    const coords = convert(`${latitude},${longitude}`)
    return { latitude: coords.decimalLatitude, longitude: coords.decimalLongitude }
  } catch (error: any) {
    return null
  }
}
