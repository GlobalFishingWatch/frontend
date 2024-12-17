import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import type { Feature, Polygon, MultiPolygon, Point } from 'geojson'
import type { GeoJSONFeature } from '@globalfishingwatch/maplibre-gl'
import type { Bbox } from '@globalfishingwatch/data-transforms'

export type FilteredPolygons = {
  contained: Feature[]
  overlapping: Feature[]
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
  layersCells: GeoJSONFeature[][],
  polygon: Point | Polygon | MultiPolygon
): FilteredPolygons[] {
  const filtered = layersCells.map((layerCells) => {
    return layerCells.reduce(
      (acc, cell) => {
        if (!cell?.geometry) {
          return acc
        }
        if (!polygon) {
          acc.contained.push(cell as Feature)
          return acc
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [[minX, minY], [maxX], [_, maxY]] = (cell.geometry as Polygon).coordinates[0]
        const cellBbox: Bbox = [minX, minY, maxX, maxY]
        const bboxContained = isBboxContained(polygon?.bbox as Bbox, cellBbox)
        const isContained =
          bboxContained && polygon.type === 'MultiPolygon'
            ? polygon.coordinates.some((coordinates) =>
                isCellInPolygon(cell.geometry as Polygon, { type: 'Polygon', coordinates })
              )
            : isCellInPolygon(cell.geometry as Polygon, polygon as Polygon)

        if (isContained) {
          acc.contained.push(cell as Feature)
        } else {
          const center = {
            type: 'Point' as const,
            coordinates: [(minX + maxX) / 2, (minY + maxY) / 2],
          }
          const overlaps = booleanPointInPolygon(center, polygon as MultiPolygon)
          if (overlaps) {
            acc.overlapping.push(cell as Feature)
          }
        }
        return acc
      },
      { contained: [] as Feature[], overlapping: [] as Feature[] }
    )
  })
  return filtered
}
