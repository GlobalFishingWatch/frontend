import type { MapboxGeoJSONFeature } from '@globalfishingwatch/mapbox-gl'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components/src/miniglobe'

export const filterByViewport = (features: MapboxGeoJSONFeature[], bounds: MiniglobeBounds) => {
  if (!bounds) {
    return []
  }
  const { north, east, south, west } = bounds
  const leftWorldCopy = east >= 180
  const rightWorldCopy = west <= -180
  return features.filter((f) => {
    const [lon, lat] = (f.geometry as any).coordinates[0][0]
    const rightOffset = rightWorldCopy && !leftWorldCopy && lon > 0 ? -360 : 0
    const leftOffset = leftWorldCopy && !rightWorldCopy && lon < 0 ? 360 : 0
    return (
      lon + rightOffset + leftOffset > west &&
      lon + rightOffset + leftOffset < east &&
      lat > south &&
      lat < north
    )
  })
}
