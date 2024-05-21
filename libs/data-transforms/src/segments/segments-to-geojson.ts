import type { FeatureCollection, LineString, Feature, Position, MultiLineString } from 'geojson'
import { lineString } from '@turf/helpers'
import { TrackSegment, TrackPoint } from '@globalfishingwatch/api-types'

const segmentsToFeatures = (segment: TrackSegment | TrackSegment[]): Feature<LineString>[] => {
  // This checks converts always to bi-dimensional array
  const arraySegment: TrackSegment[] = Array.isArray(segment?.[0])
    ? (segment as TrackSegment[])
    : [segment as TrackSegment]

  const features = arraySegment.flatMap((segment) => {
    if (!segment.length || segment.length <= 1) {
      return []
    }
    const times = segment.map((point) => point.timestamp)
    const speeds = segment.map((point) => point.speed)
    const elevations = segment.map((point) => point.elevation)
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
          times: times.some((time) => !!time) ? times : undefined,
          speed: speeds.some((speed) => !!speed) ? speeds : undefined,
          elevation: elevations.some((elevation) => !!elevation) ? elevations : undefined,
          ...coordinateProperties,
        },
      },
    }
    return feature
  })
  return features
}

const segmentsToGeoJSON = (segments: TrackSegment[] | TrackSegment[][]) => {
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
): TrackSegment[] => {
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
      const point: TrackPoint = {
        coordinateProperties: Object.keys(coordinateProperties || {}).reduce(
          (acc, prop) => ({
            ...acc,
            [prop]: coordinateProperties?.[prop]?.[i],
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

export const getSegmentExtents = (segments: TrackSegment[]) => {
  return segments.map((segment) => [segment[0], segment[segment.length - 1]])
}
