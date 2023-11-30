import { convert } from 'geo-coordinates-parser'

export const parseCoords = (
  latitude: number | string,
  longitude: number | string
): Record<string, number> | null => {
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    return { latitude, longitude }
  }
  try {
    const coords = convert(`${latitude},${longitude}`)
    return { latitude: coords.decimalLatitude, longitude: coords.decimalLongitude }
  } catch (e) {
    console.warn(e, `latitude: ${latitude}, longitude ${longitude}`)
    return null
  }
}
