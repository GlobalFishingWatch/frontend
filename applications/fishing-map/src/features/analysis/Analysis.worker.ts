import type { Geometry, Polygon, MultiPolygon } from 'geojson'
import booleanContains from '@turf/boolean-contains'
import booleanOverlap from '@turf/boolean-overlap'
import simplify from '@turf/simplify'

type Feature = GeoJSON.Feature<GeoJSON.Geometry>
export type FilteredPolygons = {
  contained: Feature[]
  overlapping: Feature[]
}

export function filterByPolygon(features: Feature[], polygon: Geometry): FilteredPolygons {
  const simplifiedPoly = simplify(polygon as Polygon | MultiPolygon, { tolerance: 0.1 })
  const filtered = features.reduce(
    (acc, feature) => {
      const isContained =
        simplifiedPoly.type === 'MultiPolygon'
          ? simplifiedPoly.coordinates.some((coordinates) =>
              booleanContains({ type: 'Polygon', coordinates }, feature.geometry as Polygon)
            )
          : booleanContains(simplifiedPoly, feature.geometry as Polygon)

      if (isContained) {
        acc.contained.push(feature)
      } else {
        // TODO try to get the % of overlapping to use it in the value calculation
        const overlaps = booleanOverlap(feature.geometry as Polygon, simplifiedPoly)
        if (overlaps) {
          acc.overlapping.push(feature)
        }
      }

      return acc
    },
    { contained: [] as Feature[], overlapping: [] as Feature[] }
  )

  return filtered
}
