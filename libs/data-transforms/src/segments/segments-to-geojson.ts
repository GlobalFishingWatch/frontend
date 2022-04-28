import type { FeatureCollection, LineString, Feature } from 'geojson'
import { Segment, Point } from '../track-value-array-to-segments/types'

const segmentsToGeoJSON = (segments: Segment[]) => {
  const geoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }
  geoJSON.features = segments.map((segment) => {
    const coordinates = segment.map((point) => [
      point.longitude as number,
      point.latitude as number,
    ])
    const geometry: LineString = {
      type: 'LineString',
      coordinates,
    }
    const times = segment.map((point) => point.timestamp)
    const feature: Feature = {
      type: 'Feature',
      geometry,
      properties: {
        id: segment[0].id,
        coordinateProperties: {
          times,
        },
      },
    }
    return feature
  })

  return geoJSON
}

export default segmentsToGeoJSON

export const geoJSONToSegments = (geoJSON: FeatureCollection): Segment[] => {
  return geoJSON.features.map((feature) => {
    const timestamps = feature.properties?.coordinateProperties.times
    const id = feature.properties?.id
    const color = feature.properties?.color
    const segment = (feature.geometry as LineString).coordinates.map((coordinate, i) => {
      const point: Point = {
        longitude: coordinate[0],
        latitude: coordinate[1],
      }
      point.timestamp = timestamps[i]
      return point
    })
    segment[0].id = id
    segment[0].color = color
    return segment
  })
}
