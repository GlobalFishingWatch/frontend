import type { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'

export const filterFeaturesByBounds = <P = unknown>(
  features: GeoJSONFeature<P>[],
  bounds: MiniglobeBounds
) => {
  if (!bounds) {
    return []
  }
  const { north, east, south, west } = bounds
  const rightWorldCopy = east >= 180
  const leftWorldCopy = west <= -180
  return features.filter((f) => {
    const [lon, lat] = (f.geometry as any).coordinates[0][0]
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
