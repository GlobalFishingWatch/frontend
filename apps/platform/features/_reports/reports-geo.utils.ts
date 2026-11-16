import {
  area,
  bbox,
  bboxClip,
  booleanContains,
  booleanIntersects,
  booleanPointInPolygon,
} from '@turf/turf'
import type { Feature, Geometry, MultiPolygon, Point, Polygon, Position } from 'geojson'

import type { Bbox } from '@globalfishingwatch/data-transforms'
import { toFiniteNumber } from '@globalfishingwatch/data-transforms'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'

import type { PolygonsCoverage } from 'features/_reports/reports-polygons.utils'

/** Precomputed polygon area some context and user datasets ship as a feature property. */
export const AREA_KM2_PROPERTY = 'area_km2'

/**
 * Area of a polygon in km².
 * Prefers the dataset's own `area_km2` over measuring the geometry, which is only ever an
 * approximation here: tile geometry is simplified per zoom level and stitched back together
 * across tile borders.
 */
export function getAreaKm2({
  geometry,
  properties,
}: {
  geometry: Polygon | MultiPolygon | undefined
  properties?: Record<string, any> | null
}): number {
  const precomputed = toFiniteNumber(properties?.[AREA_KM2_PROPERTY])
  if (precomputed !== undefined) return precomputed
  if (!geometry) return 0
  return area({ type: 'Feature', geometry, properties: {} } as Feature) / 1_000_000
}

/**
 * The area's polygons, each with a bbox of its own. turf splits a MultiPolygon into parts without
 * one on every predicate call and walks the whole part to get it, once per feature tested. The
 * parts' bboxes are also far tighter than the area's: one split at ±180 spans every longitude.
 */
function getAreaParts(geometry: Polygon | MultiPolygon): Polygon[] {
  return (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates).map(
    (coordinates) => {
      const part: Polygon = { type: 'Polygon', coordinates }
      return { ...part, bbox: bbox(part) }
    }
  )
}

function bboxesOverlap([ax1, ay1, ax2, ay2]: Bbox, [bx1, by1, bx2, by2]: Bbox) {
  return bx2 >= ax1 && bx1 <= ax2 && by2 >= ay1 && by1 <= ay2
}

/** Degrees added around a feature's bbox, so the cut's straight edges stay off its outline */
const BBOX_CLIP_PAD = 0.001

/**
 * The polygons of `geometry` that lie inside a feature's bbox, padded.
 * turf's predicates and polyclip-ts walk every vertex of both inputs, so cutting a large area
 * down to one feature's surroundings first, a single linear pass, makes them far cheaper. The
 * answer does not change, since the feature lies inside its own bbox.
 */
export function clipToFeatureBbox(
  geometry: Polygon | MultiPolygon,
  [x1, y1, x2, y2]: Bbox
): Position[][][] {
  const cut = bboxClip(geometry, [
    x1 - BBOX_CLIP_PAD,
    y1 - BBOX_CLIP_PAD,
    x2 + BBOX_CLIP_PAD,
    y2 + BBOX_CLIP_PAD,
  ]).geometry as Polygon | MultiPolygon
  // turf leaves an empty polygon in place of every part that falls outside
  return (cut.type === 'Polygon' ? [cut.coordinates] : cut.coordinates).filter(
    (polygon) => polygon.length
  )
}

export type FilteredPolygons = {
  instanceId: string
  contained: (FourwingsFeature | Feature<Point> | Feature<Geometry>)[]
  overlapping: (FourwingsFeature | Feature<Point> | Feature<Geometry>)[]
  error?: string
  coverage?: PolygonsCoverage
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
  // turf reads the member and every predicate below then skips its own walk.
  // Areas do attach one (see areas.slice / selectReportBufferArea).
  const [bx1, by1, bx2, by2] = bbox(polygon)
  // A bbox unwrapped past ±180 belongs to fitBounds, not to turf: it rejects everything on the far side of the antimeridian.
  const isUnwrapped = bx2 > 180 || bx1 < -180 || bx2 < bx1
  if (isUnwrapped || !polygon.bbox) {
    const widened: Bbox = isUnwrapped
      ? [Math.min(bx1, -180), by1, Math.max(bx2, 180), by2]
      : [bx1, by1, bx2, by2]
    // Copied rather than mutated: the caller's geometry is shared app state.
    polygon = { ...polygon, bbox: widened }
  }
  const [px1, py1, px2, py2] = polygon.bbox as Bbox
  const areaParts = mode === 'polygon' ? getAreaParts(polygon) : []
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
          if (!feature?.geometry) {
            return acc
          }
          if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
            const featureBbox = bbox(feature) as Bbox
            const parts: Polygon[] = areaParts.flatMap((part) =>
              // Only parts whose bbox reaches the feature can contain or touch it
              bboxesOverlap(part.bbox as Bbox, featureBbox)
                ? clipToFeatureBbox(part, featureBbox).map((coordinates) => ({
                    type: 'Polygon' as const,
                    coordinates,
                  }))
                : []
            )
            if (!parts.length) {
              return acc
            }
            const featureParts: Polygon[] =
              feature.geometry.type === 'MultiPolygon'
                ? feature.geometry.coordinates.map((coordinates) => ({
                    type: 'Polygon',
                    coordinates,
                  }))
                : [feature.geometry]
            if (featureParts.every((p) => parts.some((part) => booleanContains(part, p)))) {
              acc.contained.push(feature)
            } else if (parts.some((part) => booleanIntersects(part, feature))) {
              acc.overlapping.push(feature)
            }
            return acc
          }
          // Point-represented areas, see getPolygonsCoverage
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
        if (!coordinates || coordinates.length < 6) {
          return acc
        }

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
