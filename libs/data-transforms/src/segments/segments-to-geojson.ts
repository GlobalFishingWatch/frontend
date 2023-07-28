import type { FeatureCollection, LineString, Feature } from 'geojson'
import { Segment, Point } from '@globalfishingwatch/api-types'

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

export const geoJSONToSegments = (
  geoJSON: FeatureCollection,
  { onlyExtents }: { onlyExtents?: boolean } = {}
): Segment[] => {
  console.log('onlyExtents:', onlyExtents)
  return geoJSON.features.map((feature) => {
    const timestamps = feature.properties?.coordinateProperties.times
    const id = feature.properties?.id
    const color = feature.properties?.color
    const coordinates = (feature.geometry as LineString).coordinates
    const segmentCoordinates = onlyExtents
      ? [coordinates[0], coordinates[coordinates.length - 1]]
      : coordinates
    const segment = segmentCoordinates.map((coordinate, i) => {
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

export const getSegmentExtents = (segments: Segment[]) => {
  return segments.map((segment) => [segment[0], segment[segment.length - 1]])
}
