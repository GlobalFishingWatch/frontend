import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import type { MultiPolygon,Polygon } from 'geojson'

import type { FourwingsFeature, FourwingsStaticFeature } from '@globalfishingwatch/deck-loaders'

export type FilteredPolygons = {
  contained: (FourwingsFeature | FourwingsStaticFeature)[]
  overlapping: (FourwingsFeature | FourwingsStaticFeature)[]
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

export type FilterByPolygomParams = {
  layersCells: FourwingsFeature[][]
  polygon: Polygon | MultiPolygon
  mode?: 'cell' | 'point'
}
export function filterByPolygon({
  layersCells,
  polygon,
  mode = 'cell',
}: FilterByPolygomParams): FilteredPolygons[] {
  const filtered = layersCells.map((layerCells) => {
    return layerCells.reduce(
      (acc, cell) => {
        if (!cell?.coordinates) {
          return acc
        }
         
        const minX = cell.coordinates[0]
        const minY = cell.coordinates[1]
        const maxX = cell.coordinates[4]
        const maxY = cell.coordinates[5]
        if (mode === 'point') {
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
                  isCellInPolygon(cell, { type: 'Polygon', coordinates })
                )
              : isCellInPolygon(cell, polygon as Polygon)

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
