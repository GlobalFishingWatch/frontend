import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import type { Feature, MultiPolygon, Point, Polygon } from 'geojson'

import type { FourwingsFeature, FourwingsStaticFeature } from '@globalfishingwatch/deck-loaders'

export type FilteredPolygons = {
  contained: (FourwingsFeature | FourwingsStaticFeature | Feature<Point>)[]
  overlapping: (FourwingsFeature | FourwingsStaticFeature | Feature<Point>)[]
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

export type FilterByPolygonMode = 'cell' | 'cellCenter' | 'point'
export type FilterByPolygomParams = {
  layersCells: (FourwingsFeature | Feature<Point>)[][]
  polygon: Polygon | MultiPolygon
  mode?: FilterByPolygonMode
}
export function filterByPolygon({
  layersCells,
  polygon,
  mode = 'cell',
}: FilterByPolygomParams): FilteredPolygons[] {
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
      { contained: [] as FourwingsFeature[], overlapping: [] as FourwingsFeature[] }
    )
  })
  return filtered
}
