import { FeatureCollection, LineString, Feature } from 'geojson'

type Point = {
  latitude: number
  longitude: number
  timestamp: number
}
export type Segment = Point[]

export default (segments: Segment[]) => {
  const geoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }
  geoJSON.features = segments.map((segment) => {
    const coordinates = segment.map((point) => [point.longitude, point.latitude])
    const geometry: LineString = {
      type: 'LineString',
      coordinates,
    }
    const times = segment.map((point) => point.timestamp)
    const feature: Feature = {
      type: 'Feature',
      geometry,
      properties: {
        coordinateProperties: {
          times,
        },
      },
    }
    return feature
  })

  return geoJSON
}
