import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { Polygon, MultiPolygon, BBox } from 'geojson'

type Feature = GeoJSON.Feature<GeoJSON.Geometry>
export type FilteredPolygons = {
  contained: Feature[]
  overlapping: Feature[]
}

function isBboxContained(container: BBox, cell: BBox) {
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
  layersCells: Feature[][],
  polygon: Polygon | MultiPolygon
): FilteredPolygons[] {
  const filtered = layersCells.map((layerCells) => {
    return layerCells.reduce(
      (acc, cell) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [[minX, minY], [maxX], [_, maxY]] = (cell.geometry as Polygon).coordinates[0]
        const cellBbox: BBox = [minX, minY, maxX, maxY]
        const bboxContained = isBboxContained(polygon.bbox as BBox, cellBbox)
        const isContained =
          bboxContained && polygon.type === 'MultiPolygon'
            ? polygon.coordinates.some((coordinates) =>
                isCellInPolygon(cell.geometry as Polygon, { type: 'Polygon', coordinates })
              )
            : isCellInPolygon(cell.geometry as Polygon, polygon as Polygon)

        if (isContained) {
          acc.contained.push(cell)
        } else {
          const center = {
            type: 'Point' as const,
            coordinates: [(minX + maxX) / 2, (minY + maxY) / 2],
          }
          const overlaps = booleanPointInPolygon(center, polygon)
          if (overlaps) {
            acc.overlapping.push(cell)
          }
        }
        return acc
      },
      { contained: [] as Feature[], overlapping: [] as Feature[] }
    )
  })
  return filtered
}
