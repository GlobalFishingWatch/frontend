import { bboxPolygon, simplify, truncate } from '@turf/turf'
import type { Feature, MultiPolygon, Polygon } from 'geojson'

import type { AreaGeometryMode } from './types'
import { getAntimeridianBBox } from './utils.ts'

export function simplifyArea(
  feature: Feature,
  idProperty?: string,
  geometryMode: AreaGeometryMode = 'simplify'
) {
  if (!feature.geometry || !('coordinates' in feature.geometry)) {
    return null
  }

  const area = {
    type: 'Feature',
    geometry: {
      type: feature.geometry.type,
      coordinates:
        // Get the first polygon from each MultiPolygon to remove the holes
        feature.geometry.type === 'MultiPolygon'
          ? feature.geometry.coordinates.map((polygon) => [polygon[0]])
          : (feature as Feature<Polygon>).geometry.coordinates,
    },
    properties: feature.properties,
  } as Feature<Polygon | MultiPolygon>

  try {
    if (geometryMode === 'point') {
      return {
        type: 'Feature',
        properties: area.properties,
        geometry: {
          type: 'Point',
          coordinates: [area.geometry.coordinates[0], area.geometry.coordinates[1]],
        },
      }
    }

    if (geometryMode === 'bbox') {
      const [west, south, east, north] = getAntimeridianBBox(
        area.geometry.type === 'MultiPolygon'
          ? area.geometry.coordinates.map((polygon) => polygon.flat())
          : [area.geometry.coordinates.flat()]
      )
      return {
        type: 'Feature',
        properties: area.properties,
        // Split at 180°: one box from 163° to 183° would be read as spanning the globe instead
        geometry:
          east > 180
            ? {
                type: 'MultiPolygon',
                coordinates: [
                  bboxPolygon([west, south, 180, north]).geometry.coordinates,
                  bboxPolygon([-180, south, east - 360, north]).geometry.coordinates,
                ],
              }
            : {
                type: 'Polygon',
                coordinates: bboxPolygon([west, south, east, north]).geometry.coordinates,
              },
      }
    }

    const simplified = simplify(area, {
      tolerance: 0.3,
      highQuality: true,
    })
    const truncated = truncate(simplified, {
      precision: 2,
    })
    return truncated
  } catch (error) {
    if (process.env.DEBUG) {
      const id = area.properties?.[idProperty || 'id']
      console.error(`❌ Error simplifying area: ${id}`, error)
    }
    return null
  }
}
