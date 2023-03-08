import bbox from '@turf/bbox'
import { LineString } from '@turf/helpers'
import { Feature, MultiPolygon } from 'geojson'

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

export const wrapFeaturesLongitudes = (features: Feature<LineString>[]) => {
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

export function wrapGeometryBbox(geometry: MultiPolygon): [number, number, number, number] {
  let minY: number = 0
  let maxY: number = 0
  let minX: number = 0
  let maxX: number = 0
  geometry.coordinates.forEach((polygon) => {
    polygon.forEach((points) => {
      points.forEach(([x, y]) => {
        if (!minY || y < minY) minY = y
        if (!maxY || y > maxY) maxY = y
        if (!minX || x < minX) minX = x
        if (!maxX || x > maxX) maxX = x
      })
    })
  })

  if (minX === -180 && maxX === 180) {
    geometry.coordinates.forEach((polygon) => {
      const polygonBbox = bbox({ type: 'Polygon', coordinates: polygon })
      if (polygonBbox[2] === 180 && (minX === -180 || polygonBbox[0] < (minX as number))) {
        minX = polygonBbox[0]
      }
      if (polygonBbox[0] === -180 && (maxX === 180 || polygonBbox[2] + 360 > (maxX as number))) {
        maxX = polygonBbox[2] + 360
      }
    })
  }
  return [minX, minY, maxX, maxY]
}
