import { LineString } from '@turf/helpers'
import { Feature } from 'geojson'

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
