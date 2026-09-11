import { bbox, feature, geometry, polygon } from '@turf/turf'
import type { Feature, LineString, MultiPolygon, Point, Polygon, Position } from 'geojson'

import type { Bbox } from '../types'

// Used to detect antimeridian issues in dissolve
export const BUFFERED_ANTIMERIDIAN_LON = 179.5
// Used to normalize longitudes to avoid antimeridian issues
export const BUFFERED_ANTIMERIDIAN_NORMALIZED = 180.1

export const wrapLongitudes = (longitudes: number[]) => {
  // Hack for renderers like mapbox gl or leaflet to fix antimeridian issues
  // https://macwright.org/2016/09/26/the-180th-meridian.html ("Using longitudes above and below 180 and -180**")
  let currentLon: number
  let lonOffset = 0
  return longitudes.map((coordinate) => {
    if (currentLon) {
      if (coordinate - currentLon < -180) {
        lonOffset += 360
      } else if (coordinate - currentLon > 180) {
        lonOffset -= 360
      }
    }
    currentLon = coordinate
    return coordinate + lonOffset
  })
}

export const wrapBBoxLongitudes = (bbox: Bbox): Bbox => {
  const [minX, minY, maxX, maxY] = bbox
  const [wrappedMinX, wrappedMaxX] = wrapLongitudes([minX, maxX])
  return [wrappedMinX, minY, wrappedMaxX, maxY]
}

export const wrapPointLongitudes = (features: Feature<Point>[]) => {
  let prevLon: number
  let lonOffset = 0
  return features.map((feature) => {
    const [currentLon, currentLat] = feature.geometry.coordinates
    if (prevLon) {
      if (currentLon - prevLon < -180) {
        lonOffset += 360
      } else if (currentLon - prevLon > 180) {
        lonOffset -= 360
      }
    }
    prevLon = currentLon
    const wrappedCoordinates = [currentLon + lonOffset, currentLat]
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates:
          feature.geometry.type !== 'Point' ? feature.geometry.coordinates : wrappedCoordinates,
      },
    }
  })
}

export const wrapLineStringLongitudes = (features: Feature<LineString>[]) => {
  let prevLon: number
  let lonOffset = 0
  return features.map((feature) => {
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates:
          feature.geometry.type !== 'LineString'
            ? feature.geometry.coordinates
            : feature.geometry.coordinates.map((coords) => {
                const [currentLon, currentLat] = coords
                if (prevLon) {
                  if (currentLon - prevLon < -180) {
                    lonOffset += 360
                  } else if (currentLon - prevLon > 180) {
                    lonOffset -= 360
                  }
                }
                prevLon = currentLon
                return [currentLon + lonOffset, currentLat]
              }),
      },
    }
  })
}

type WrapLongitudesParams = {
  normalize?: boolean
}

export const wrapLineStringFeatureCoordinates = (feature: Feature<LineString>) => {
  let prevLon: number
  let lonOffset = 0
  return feature.geometry.coordinates.map((coords) => {
    const [currentLon, currentLat] = coords
    if (prevLon) {
      if (currentLon - prevLon < -180) {
        lonOffset += 360
      } else if (currentLon - prevLon > 180) {
        lonOffset -= 360
      }
    }
    prevLon = currentLon
    return [currentLon + lonOffset, currentLat]
  })
}

export const normalizeLongitude = (longitude: number) => {
  if (longitude > BUFFERED_ANTIMERIDIAN_LON) return BUFFERED_ANTIMERIDIAN_NORMALIZED
  else if (longitude < -BUFFERED_ANTIMERIDIAN_LON) return -BUFFERED_ANTIMERIDIAN_NORMALIZED
  return longitude
}

export const wrapPolygonFeatureCoordinates = (
  feature: Feature<Polygon>,
  { normalize = true }: WrapLongitudesParams
) => {
  return feature.geometry.coordinates.map((coords) => {
    return coords.map((pair) => {
      const lon = normalize ? normalizeLongitude(pair[0]) : pair[0]
      if (lon < 0) return [lon + 360, pair[1]]
      return pair
    })
  })
}

export const wrapMultipolygonFeatureCoordinates = (
  feature: Feature<MultiPolygon>,
  params: WrapLongitudesParams
) => {
  return feature.geometry.coordinates.map((coords) => {
    return wrapPolygonFeatureCoordinates(polygon(coords), params)
  })
}

export const wrapFeatureLongitudes = (
  featureData: Feature<LineString | Polygon | MultiPolygon>,
  params: WrapLongitudesParams = {}
): Feature<LineString | Polygon | MultiPolygon> => {
  switch (featureData.geometry.type) {
    case 'LineString': {
      const coordinates = wrapLineStringFeatureCoordinates(featureData as Feature<LineString>)
      return feature(geometry('LineString', coordinates)) as Feature<LineString>
    }
    case 'Polygon': {
      const coordinates = wrapPolygonFeatureCoordinates(featureData as Feature<Polygon>, params)
      return feature(geometry('Polygon', coordinates)) as Feature<Polygon>
    }
    default: {
      // MultiPolygon
      const coordinates = wrapMultipolygonFeatureCoordinates(
        featureData as Feature<MultiPolygon>,
        params
      )
      return feature(geometry('MultiPolygon', coordinates)) as Feature<MultiPolygon>
    }
  }
}

/**
 * The only bbox safe to store as a geometry's `bbox` member.
 *
 * turf trusts `bbox` to reject points before doing any real work, so it has to agree with the coordinates.
 * {@link wrapGeometryBbox} deliberately does not — its span is unwrapped past ±180 so fitBounds gets a continuous range
 */
export function getTurfBbox(geometry: Polygon | MultiPolygon): Bbox {
  return bbox(geometry, { recompute: true }) as Bbox
}

export function wrapGeometryBbox(geometry: Polygon | MultiPolygon): Bbox {
  const fullBbox = bbox(geometry)
  let minX = fullBbox[0]
  const minY = fullBbox[1]
  let maxX = fullBbox[2]
  const maxY = fullBbox[3]
  if (minX === -180 && maxX === 180) {
    geometry.coordinates.forEach((polygon) => {
      const polygonBbox = bbox({ type: 'Polygon', coordinates: polygon as Position[][] })
      if (polygonBbox[2] === 180 && (minX === -180 || polygonBbox[0] < minX)) {
        minX = polygonBbox[0]
      } else if (polygonBbox[0] === -180 && (maxX === 180 || polygonBbox[2] + 360 > maxX)) {
        maxX = polygonBbox[2] + 360
      }
    })
  }
  return [minX, minY, maxX, maxY]
}

export const wrapFeaturesLongitudes = (features: Feature<LineString | Polygon>[]) => {
  return features.map((feature) => wrapFeatureLongitudes(feature))
}

const WORLD_LONGITUDES = 360

/** Shifts one run of positions back by whole worlds, so its mean longitude lands in [-180, 180]. */
const unwrapPositions = (positions: Position[]): Position[] => {
  const meanLon = positions.reduce((acc, position) => acc + position[0], 0) / positions.length
  const offset = Math.round(meanLon / WORLD_LONGITUDES) * WORLD_LONGITUDES
  return offset === 0 ? positions : positions.map(([lon, ...rest]) => [lon - offset, ...rest])
}

const unwrapCoordinates = (coordinates: any): any => {
  if (typeof coordinates[0] === 'number') {
    const offset = Math.round(coordinates[0] / WORLD_LONGITUDES) * WORLD_LONGITUDES
    return offset === 0 ? coordinates : [coordinates[0] - offset, ...coordinates.slice(1)]
  }
  if (typeof coordinates[0]?.[0] === 'number') {
    return unwrapPositions(coordinates)
  }
  let changed = false
  const unwrapped = coordinates.map((part: any) => {
    const next = unwrapCoordinates(part)
    changed ||= next !== part
    return next
  })
  return changed ? unwrapped : coordinates
}

/**
 * The inverse of {@link wrapFeatureLongitudes}: brings coordinates back into [-180, 180].
 *
 * A viewport can span more than one copy of the world, and a tiled source then hands back the
 * same feature in each copy — a Fiji polygon arrives at -180.8 rather than 179.2. Anything that
 * tests a feature against a geometry split at the antimeridian (a report area is a part ending
 * at 180 plus a part starting at -180) matches neither and silently drops it.
 */
export const unwrapFeatureLongitudes = <T extends Feature>(featureData: T): T => {
  const geometry = featureData.geometry as { type: string; coordinates?: any }
  if (!geometry?.coordinates?.length) {
    return featureData
  }
  const coordinates = unwrapCoordinates(geometry.coordinates)
  if (coordinates === geometry.coordinates) {
    // Nothing moved, so hand the caller its own feature back rather than a copy of it.
    return featureData
  }
  return { ...featureData, geometry: { ...geometry, coordinates } } as T
}
