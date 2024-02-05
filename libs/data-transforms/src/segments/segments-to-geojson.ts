import type { FeatureCollection, LineString, Feature, Position } from 'geojson'
import { Segment, Point } from '@globalfishingwatch/api-types'

const segmentsToFeatures = (segment: Segment | Segment[]): Feature<LineString>[] => {
  // This checks converts always to bi-dimensional array
  const arraySegment: Segment[] = Array.isArray(segment?.[0])
    ? (segment as Segment[])
    : [segment as Segment]

  const features = arraySegment.flatMap((segment) => {
    if (!segment.length || segment.length <= 1) {
      return []
    }
    const times = segment.map((point) => point.timestamp)
    const coordinateProperties = segment?.reduce(
      (acc, point) => {
        const properties = point.coordinateProperties || {}
        Object.keys(properties).forEach((key) => {
          if (key === 'timestamp') return
          if (!acc[key]) {
            acc[key] = []
          }
          acc[key].push(properties[key])
        })
        return acc
      },
      {} as Record<string, (string | number)[]>
    )
    const feature: Feature<LineString> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: segment.map((point) => {
          return [point.longitude as number, point.latitude as number] as Position
        }),
      },
      properties: {
        id: segment[0]?.id,
        ...(segment[0].properties && { ...segment[0].properties }),
        coordinateProperties: {
          ...coordinateProperties,
          times: times.some((time) => !!time) ? times : undefined,
        },
      },
    }
    return feature
  })
  return features
}

const segmentsToGeoJSON = (segments: Segment[] | Segment[][]) => {
  const geoJSON: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [],
  }
  geoJSON.features = segments.flatMap((segment) => {
    if (!segment.length) return []
    return segmentsToFeatures(segment)
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
      if (onlyExtents && i === 1) {
        point.timestamp = timestamps[coordinates.length - 1]
      } else {
        point.timestamp = timestamps[i]
      }
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
