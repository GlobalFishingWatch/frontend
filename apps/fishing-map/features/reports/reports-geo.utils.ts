import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { Polygon, MultiPolygon } from 'geojson'
import { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { Bbox } from 'types'

export type FilteredPolygons = {
  contained: FourwingsFeature[]
  overlapping: FourwingsFeature[]
}

function isBboxContained(container: Bbox, cell: Bbox) {
  if (cell[0] < container[0]) {
    return false
  }
  if (cell[2] > container[2]) {
    return false
  }
  if (cell[1] < container[1]) {
    return false
  }
  if (cell[3] > container[3]) {
    return false
  }
  return true
}

function isCellInPolygon(cellGeometry: Polygon, polygon: Polygon) {
  return cellGeometry?.coordinates[0].every((cellCorner) =>
    booleanPointInPolygon(cellCorner, polygon)
  )
}

export function filterByPolygon(
  layersCells: FourwingsFeature[][],
  polygon: Polygon | MultiPolygon,
  mode: 'cell' | 'point' = 'cell'
): FilteredPolygons[] {
  const filtered = layersCells.map((layerCells) => {
    return layerCells.reduce(
      (acc, cell) => {
        if (!cell?.geometry) {
          return acc
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [[minX, minY], [maxX], [_, maxY]] = (cell.geometry as Polygon).coordinates[0]
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
          const cellBbox: Bbox = [minX, minY, maxX, maxY]
          const bboxContained = isBboxContained(polygon.bbox as Bbox, cellBbox)
          if (!bboxContained) {
            return acc
          }
          const isContained =
            bboxContained && polygon.type === 'MultiPolygon'
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
