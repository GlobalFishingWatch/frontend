import type { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
import type { FourWingsFeature, FourWingsStaticFeature } from '@globalfishingwatch/deck-loaders'

export interface Bounds {
  north: number
  south: number
  west: number
  east: number
}

export const filterFeaturesByBounds = (
  features: GeoJSONFeature[] | FourWingsFeature[] | FourWingsStaticFeature[],
  bounds: Bounds
) => {
  if (!bounds) {
    return []
  }
  const { north, east, south, west } = bounds
  const rightWorldCopy = east >= 180
  const leftWorldCopy = west <= -180
  return features.filter((f) => {
    const lon =
      (f.geometry as any)?.coordinates?.[0]?.[0]?.[0] || (f as GeoJSONFeature).properties?.lon
    const lat =
      (f.geometry as any)?.coordinates?.[0]?.[0]?.[1] || (f as GeoJSONFeature).properties?.lat
    if (lat < south || lat > north) {
      return false
    }
    // This tries to translate features longitude for a proper comparison against the viewport
    // when they fall in a left or right copy of the world but not in the center one
    // but... https://c.tenor.com/YwSmqv2CZr8AAAAd/dog-mechanic.gif
    const featureInLeftCopy = lon > 0 && lon - 360 >= west
    const featureInRightCopy = lon < 0 && lon + 360 <= east
    const leftOffset = leftWorldCopy && !rightWorldCopy && featureInLeftCopy ? -360 : 0
    const rightOffset = rightWorldCopy && !leftWorldCopy && featureInRightCopy ? 360 : 0
    return lon + leftOffset + rightOffset > west && lon + leftOffset + rightOffset < east
  })
}
