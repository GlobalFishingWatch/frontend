import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import type { Polygon, MultiPolygon } from 'geojson'
import type { FourwingsFeature, FourwingsStaticFeature } from '@globalfishingwatch/deck-loaders'

export type FilteredPolygons = {
  contained: (FourwingsFeature | FourwingsStaticFeature)[]
  overlapping: (FourwingsFeature | FourwingsStaticFeature)[]
}

function isCellInPolygon(cellGeometry: Polygon, polygon: Polygon) {
  return cellGeometry?.coordinates[0].every((cellCorner) =>
    booleanPointInPolygon(cellCorner, polygon)
  )
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
        if (!cell?.geometry) {
          return acc
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [[minX, minY], _, [maxX, maxY]] = (cell.geometry as Polygon).coordinates[0]
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
                  isCellInPolygon(cell.geometry as Polygon, { type: 'Polygon', coordinates })
                )
              : isCellInPolygon(cell.geometry as Polygon, polygon as Polygon)

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
