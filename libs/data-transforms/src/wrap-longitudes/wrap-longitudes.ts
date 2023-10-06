import bbox from '@turf/bbox'
import { LineString, feature, geometry, polygon } from '@turf/helpers'
import { Feature, MultiPolygon, Polygon } from 'geojson'

export type Bbox = [number, number, number, number]

export const BUFFERED_ANTIMERIDIAN_LON = 179.5

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

export const wrapFeaturesLongitudes = (features: Feature<LineString | Polygon>[]) => {
  return features.map((feature) => wrapFeatureLongitudes(feature))
}

export const wrapFeatureLongitudes = (
  featureData: Feature<LineString | Polygon | MultiPolygon>
): Feature<LineString | Polygon | MultiPolygon> => {
  let coordinates = featureData.geometry.coordinates
  switch (featureData.geometry.type) {
    case 'LineString':
      coordinates = wrapLineStringFeatureCoordinates(featureData as Feature<LineString>)
      return feature(geometry('LineString', coordinates)) as Feature<LineString>
    case 'Polygon':
      coordinates = wrapPolygonFeatureCoordinates(featureData as Feature<Polygon>)
      return feature(geometry('Polygon', coordinates)) as Feature<Polygon>
    default: // MultiPolygon
      coordinates = wrapMultipolygonFeatureCoordinates(featureData as Feature<MultiPolygon>)
      return feature(geometry('MultiPolygon', coordinates)) as Feature<MultiPolygon>
  }
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

export const wrapPolygonFeatureCoordinates = (feature: Feature<Polygon>) => {
  return feature.geometry.coordinates.map((coords, index) => {
    return coords.map((pair) => {
      let lon = pair[0]
      if (lon > BUFFERED_ANTIMERIDIAN_LON) lon = 180
      else if (lon < -BUFFERED_ANTIMERIDIAN_LON) lon = -180
      if (lon < 0) return [lon + 360, pair[1]]
      return pair
    })
  })
}

export const wrapMultipolygonFeatureCoordinates = (feature: Feature<MultiPolygon>) => {
  return feature.geometry.coordinates.map((coords) => {
    return wrapPolygonFeatureCoordinates(polygon(coords))
  })
}
