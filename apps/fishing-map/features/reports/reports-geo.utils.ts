import bbox from '@turf/bbox'
import booleanContains from '@turf/boolean-contains'
import booleanIntersects from '@turf/boolean-intersects'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import type { Feature, Geometry, MultiPolygon, Point, Polygon } from 'geojson'

import type { FourwingsFeature, FourwingsStaticFeature } from '@globalfishingwatch/deck-loaders'

export type FilteredPolygons = {
  instanceId: string
  contained: (FourwingsFeature | FourwingsStaticFeature | Feature<Point> | Feature<Geometry>)[]
  overlapping: (FourwingsFeature | FourwingsStaticFeature | Feature<Point> | Feature<Geometry>)[]
  error?: string
}

function isCellInPolygon(cellGeometry: FourwingsFeature, polygon: Polygon) {
  const corners = [
    [cellGeometry.coordinates[0], cellGeometry.coordinates[1]],
    [cellGeometry.coordinates[2], cellGeometry.coordinates[3]],
    [cellGeometry.coordinates[4], cellGeometry.coordinates[5]],
    [cellGeometry.coordinates[6], cellGeometry.coordinates[7]],
  ]
  return corners.every((corner) => booleanPointInPolygon(corner, polygon))
}

export type FilterByPolygonMode = 'cell' | 'cellCenter' | 'point' | 'polygon'
export type FilterByPolygomParams = {
  instanceId: string
  layersCells: (FourwingsFeature | Feature<Point> | Feature<Geometry>)[][]
  polygon: Polygon | MultiPolygon
  mode?: FilterByPolygonMode
}
export function filterByPolygon({
  instanceId,
  layersCells,
  polygon,
  mode = 'cell',
}: FilterByPolygomParams): FilteredPolygons[] {
  const [px1, py1, px2, py2] = bbox(polygon)
  const filtered = layersCells.map((layerCells) => {
    return layerCells.reduce(
      (acc, cell) => {
        if (!(cell as FourwingsFeature)?.coordinates && !(cell as Feature<Point>)?.geometry) {
          return acc
        }
        if (mode === 'point') {
          if (booleanPointInPolygon((cell as Feature<Point>)?.geometry, polygon)) {
            acc.contained.push(cell as FourwingsFeature)
          }
          return acc
        }
        if (mode === 'polygon') {
          const feature = cell as Feature<Geometry>
          if (!feature?.geometry) return acc
          if (booleanContains(polygon, feature)) {
            acc.contained.push(feature)
          } else {
            const [fx1, fy1, fx2, fy2] = bbox(feature)
            if (
              fx2 >= px1 &&
              fx1 <= px2 &&
              fy2 >= py1 &&
              fy1 <= py2 &&
              booleanIntersects(polygon, feature)
            ) {
              acc.overlapping.push(feature)
            }
          }
          return acc
        }
        const coordinates = (cell as FourwingsFeature)?.coordinates

        const minX = coordinates[0]
        const minY = coordinates[1]
        const maxX = coordinates[4]
        const maxY = coordinates[5]
        if (mode === 'cellCenter') {
          const center = {
            type: 'Point' as const,
            coordinates: [(minX + maxX) / 2, (minY + maxY) / 2],
          }
          if (booleanPointInPolygon(center, polygon)) {
            acc.contained.push(cell as FourwingsFeature)
          } else {
            return acc
          }
        } else {
          const isContained =
            polygon.type === 'MultiPolygon'
              ? polygon.coordinates.some((coordinates) =>
                  isCellInPolygon(cell as FourwingsFeature, { type: 'Polygon', coordinates })
                )
              : isCellInPolygon(cell as FourwingsFeature, polygon as Polygon)

          if (isContained) {
            acc.contained.push(cell as FourwingsFeature)
          } else {
            const center = {
              type: 'Point' as const,
              coordinates: [(minX + maxX) / 2, (minY + maxY) / 2],
            }
            const overlaps = booleanPointInPolygon(center, polygon)
            if (overlaps) {
              acc.overlapping.push(cell as FourwingsFeature)
            }
          }
        }
        return acc
      },
      {
        contained: [] as FilteredPolygons['contained'],
        overlapping: [] as FilteredPolygons['overlapping'],
        instanceId,
      }
    )
  })
  return filtered
}
