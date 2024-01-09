import type { FeatureCollection, LineString, Feature } from 'geojson'
import { Segment, Point } from '@globalfishingwatch/api-types'

const segmentsToGeoJSON = (segments: Segment[]) => {
  const geoJSON: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [],
  }
  geoJSON.features = segments.flatMap((segment) => {
    if (!segment.length) return []

    const coordinates = segment.map((point) => [
      point.longitude as number,
      point.latitude as number,
    ])
    const geometry: LineString = {
      type: 'LineString',
      coordinates,
    }
    const times = segment.flatMap((point) => point.timestamp || [])
    const feature: Feature<LineString> = {
      type: 'Feature',
      geometry,
      properties: {
        id: segment[0].id,
        ...segment[0].properties,
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

// import type { FeatureCollection, LineString, Feature } from 'geojson'
// import { Segment, Point } from '@globalfishingwatch/api-types'

// const segmentToFeature = (segment: Segment) => {
//   const arraySegment = Array.isArray(segment) ? segment : [segment]
//   const coordinates = arraySegment.map((point) => [
//     point.longitude as number,
//     point.latitude as number,
//   ])
//   const geometry: LineString = {
//     type: 'LineString',
//     coordinates,
//   }
//   const times = arraySegment.map((point) => point.timestamp)
//   const feature: Feature<LineString> = {
//     type: 'Feature',
//     geometry,
//     properties: {
//       id: arraySegment[0].id,
//       ...arraySegment[0].properties,
//       coordinateProperties: {
//         times,
//       },
//     },
//   }
//   return feature
// }

// const segmentsToGeoJSON = (segments: Segment[] | Segment[][]) => {
//   const geoJSON: FeatureCollection<LineString> = {
//     type: 'FeatureCollection',
//     features: [],
//   }
//   geoJSON.features = segments.flatMap((segment) => {
//     if (!segment.length) return []
//     const isSegmentsArray = Array.isArray(segment)
//     if (isSegmentsArray) {
//       return segment.map(segmentToFeature)
//     } else {
//       return segmentToFeature(segment)
//     }
//   })

//   return geoJSON
// }

// export default segmentsToGeoJSON

// export const geoJSONToSegments = (
//   geoJSON: FeatureCollection,
//   { onlyExtents }: { onlyExtents?: boolean } = {}
// ): Segment[] => {
//   return geoJSON.features.map((feature) => {
//     const timestamps = feature.properties?.coordinateProperties?.times || []
//     const id = feature.properties?.id
//     const color = feature.properties?.color
//     const coordinates = (feature.geometry as LineString).coordinates
//     const segmentCoordinates = onlyExtents
//       ? [coordinates[0], coordinates[coordinates.length - 1]]
//       : coordinates
//     const segment = segmentCoordinates.map((coordinate, i) => {
//       const point: Point = {
//         longitude: coordinate[0],
//         latitude: coordinate[1],
//       }
//       point.timestamp = timestamps[i]
//       return point
//     })
//     segment[0].id = id
//     segment[0].color = color
//     return segment
//   })
// }

// export const getSegmentExtents = (segments: Segment[]) => {
//   return segments.map((segment) => [segment[0], segment[segment.length - 1]])
// }
