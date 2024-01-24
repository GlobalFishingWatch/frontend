import { convert } from 'geo-coordinates-parser'

export const parseCoords = (
  latitude: number | string,
  longitude: number | string
): { latitude: number; longitude: number } | null => {
  if (!latitude || !longitude) return null
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    return { latitude, longitude }
  }
  const coords = convert(`${latitude},${longitude}`)
  return { latitude: coords.decimalLatitude, longitude: coords.decimalLongitude }
}
