import { convert } from 'geo-coordinates-parser'

export const parseCoords = (latitude: number | string, longitude: number | string) => {
  const coords = convert(`${latitude},${longitude}`)
  return { latitude: coords.decimalLatitude, longitude: coords.decimalLongitude }
}
