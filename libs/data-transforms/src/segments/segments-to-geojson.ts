import type { FeatureCollection, LineString, Feature, Position, MultiLineString } from 'geojson'
import { lineString } from '@turf/helpers'
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
    const coordinateProperties = segment?.reduce((acc, point) => {
      const properties = point.coordinateProperties || {}
      Object.keys(properties).forEach((key) => {
        if (key === 'timestamp') return
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(properties[key])
      })
      return acc
    }, {} as Record<string, (string | number)[]>)
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

const segmentsToGeoJSON = (segments: Segment[] | Segment[][], metadata?: Record<string, any>) => {
  const geoJSON: FeatureCollection<LineString> & { metadata?: Record<string, any> } = {
    type: 'FeatureCollection',
    features: [],
  }
  geoJSON.features = segments.flatMap((segment) => {
    if (!segment.length) return []
    return segmentsToFeatures(segment)
  })

  geoJSON.metadata = metadata

  return geoJSON
}

export default segmentsToGeoJSON

export const geoJSONToSegments = (
  geoJSON: FeatureCollection,
  { onlyExtents }: { onlyExtents?: boolean } = {}
): Segment[] => {
  const lineStringGeoJSONFeatures =
    geoJSON.features[0]?.geometry?.type === 'MultiLineString'
      ? geoJSON.features.flatMap((multiline) => {
          const coordinateProperties = multiline.properties?.coordinateProperties
          const linestring = (multiline as Feature<MultiLineString>).geometry.coordinates.flatMap(
            (line, index) =>
              line.length < 2
                ? []
                : lineString(line, {
                    color: multiline.properties?.color,
                    id: multiline.properties?.id,
                    coordinateProperties:
                      coordinateProperties &&
                      Object.keys(coordinateProperties || {}).reduce(
                        (acc, prop) => ({
                          ...acc,
                          [prop]: coordinateProperties[prop][index],
                        }),
                        {}
                      ),
                  })
          )
          return linestring
        })
      : geoJSON.features
  return lineStringGeoJSONFeatures.map((feature) => {
    const coordinateProperties = feature.properties?.coordinateProperties
    const timestamps = feature.properties?.coordinateProperties?.times || []
    const id = feature.properties?.id
    const color = feature.properties?.color
    const coordinates = (feature.geometry as LineString).coordinates
    const segmentCoordinates = onlyExtents
      ? [coordinates[0], coordinates[coordinates.length - 1]]
      : coordinates
    const segment = segmentCoordinates.map((coordinate, i) => {
      const point: Point = {
        coordinateProperties: Object.keys(coordinateProperties || {}).reduce(
          (acc, prop) => ({
            ...acc,
            [prop]: coordinateProperties[prop][i],
          }),
          {}
        ),
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
