import { FeatureCollection, LineString, Feature } from 'geojson'
import { Segment } from '@globalfishingwatch/data-transforms'

export default (segments: Segment[]) => {
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
        coordinateProperties: {
          times,
        },
      },
    }
    return feature
  })

  return geoJSON
}
