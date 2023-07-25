import bbox from '@turf/bbox'
import { Feature, LineString, MultiPolygon, Point, Polygon } from 'geojson'

export type Bbox = [number, number, number, number]

export const wrapBBoxLongitudes = (bbox: Bbox) => {
  // Hack for renderers like mapbox gl or leaflet to fix antimeridian issues
  // https://macwright.org/2016/09/26/the-180th-meridian.html ("Using longitudes above and below 180 and -180**")
  let currentLon: number
  let lonOffset = 0
  return bbox.map((coordinate, index) => {
    // only needed for longitudes wich
    if (index === 0 || index === 2) {
      if (currentLon) {
        if (coordinate - currentLon < -180) {
          lonOffset += 360
        } else if (coordinate - currentLon > 180) {
          lonOffset -= 360
        }
      }
      currentLon = coordinate
      return coordinate + lonOffset
    }
    return coordinate
  }) as Bbox
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

export function wrapGeometryBbox(geometry: Polygon | MultiPolygon): Bbox {
  let [minX, minY, maxX, maxY] = bbox(geometry)
  if (minX === -180 && maxX === 180) {
    geometry.coordinates.forEach((polygon) => {
      const polygonBbox = bbox({ type: 'Polygon', coordinates: polygon })
      if (polygonBbox[2] === 180 && (minX === -180 || polygonBbox[0] < minX)) {
        minX = polygonBbox[0]
      } else if (polygonBbox[0] === -180 && (maxX === 180 || polygonBbox[2] + 360 > maxX)) {
        maxX = polygonBbox[2] + 360
      }
    })
  }
  return [minX, minY, maxX, maxY]
}
