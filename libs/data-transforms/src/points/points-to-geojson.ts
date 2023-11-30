import { Feature, FeatureCollection, Point } from 'geojson'
import { getUTCDate, parseCoords } from '@globalfishingwatch/data-transforms'
import { SegmentColumns } from '../types'

export const pointsListToGeojson = (
  data: Record<string, any>[],
  { latitude, longitude, timestamp, id }: SegmentColumns
) => {
  const features: Feature<Point>[] = data.flatMap((point, index) => {
    const coords = parseCoords(point[latitude] as number, point[longitude] as number)
    if (coords) {
      return {
        type: 'Feature',
        properties: {
          ...point,
          timestamp:
            timestamp && point[timestamp] ? getUTCDate(point[timestamp]).getTime() : undefined,
          id: id && point[id] ? point[id] : index,
        },
        geometry: {
          type: 'Point',
          coordinates: [coords.longitude, coords.latitude],
        },
      }
    } else {
      return []
    }
  })
  return {
    type: 'FeatureCollection',
    features,
  } as FeatureCollection
}
