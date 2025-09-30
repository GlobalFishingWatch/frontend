import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import simplify from '@turf/simplify'
import truncate from '@turf/truncate'
import type { Feature, MultiPolygon, Polygon } from 'geojson'

import type { AreaGeometryMode } from './types'

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
      return {
        type: 'Feature',
        properties: area.properties,
        geometry: {
          type: 'Polygon',
          coordinates: [bboxPolygon(bbox(area)).geometry.coordinates[0]],
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
