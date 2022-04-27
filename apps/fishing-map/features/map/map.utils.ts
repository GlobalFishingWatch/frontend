import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import type { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components'
import { Bbox } from 'types'

export const parsePropertiesBbox = (bbox: string) => {
  if (!bbox) return
  return wrapBBoxLongitudes(bbox.split(',').map((b) => parseFloat(b)) as Bbox)
}

export const filterByViewport = <P = unknown>(
  features: GeoJSONFeature<P>[],
  bounds: MiniglobeBounds
) => {
  if (!bounds) {
    return []
  }
  const { north, east, south, west } = bounds
  const leftWorldCopy = west <= -180
  const rightWorldCopy = east >= +180
  const width = Math.abs(west - east)

  return features.filter((f) => {
    const [lon, lat] = (f.geometry as any).coordinates[0][0]
    if (lat < south || lat > north) {
      return false
    }

    if (leftWorldCopy) {
      return (-180 <= lon && lon <= east) || (180 - width - east <= lon && lon <= 180)
    }
    if (rightWorldCopy) {
      return (west <= lon && lon <= 180) || (-180 <= lon && lon <= -360 - width + west)
    }
    return lon > west && lon < east

  })
}
