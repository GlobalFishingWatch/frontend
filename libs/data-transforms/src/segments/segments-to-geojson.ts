import type { FeatureCollection, LineString, Feature, MultiLineString, Position } from 'geojson'
import { Segment, Point } from '@globalfishingwatch/api-types'

const segmentToFeature = (segment: Segment | Segment[]): Feature<MultiLineString> => {
  const arraySegment: Point[] = Array.isArray(segment) ? segment : [segment]
  const coordinates: Position[][] = [
    arraySegment.map(
      (point: Point) => [point.longitude as number, point.latitude as number] as Position
    ),
  ]
  const geometry: MultiLineString = {
    type: 'MultiLineString',
    coordinates,
  }
  const times = arraySegment.flatMap((point: Point) => point.timestamp || [])
  const feature: Feature<MultiLineString> = {
    type: 'Feature',
    geometry,
    properties: {
      id: arraySegment[0].id,
      ...arraySegment[0].properties,
      coordinateProperties: {
        times,
      },
    },
  }
  return feature
}

const segmentsToGeoJSON = (segments: Segment[] | Segment[][]) => {
  const geoJSON: FeatureCollection<MultiLineString> = {
    type: 'FeatureCollection',
    features: [],
  }
  geoJSON.features = segments.flatMap((segment) => {
    if (!segment.length) return []
    return segmentToFeature(segment)
  })

  return geoJSON
}

export default segmentsToGeoJSON

export const geoJSONToSegments = (
  geoJSON: FeatureCollection,
  { onlyExtents }: { onlyExtents?: boolean } = {}
): Segment[] => {
  return geoJSON.features.map((feature) => {
    const timestamps = feature.properties?.coordinateProperties?.times || []
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
