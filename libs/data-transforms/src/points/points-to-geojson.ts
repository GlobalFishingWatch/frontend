import { Feature, FeatureCollection, Point } from 'geojson'
import { SegmentColumns } from '../types'

export const pointsListToGeojson = (
  data: Record<string, any>[],
  { latitude, longitude, timestamp, id }: SegmentColumns
) => {
  const features: Feature<Point>[] = data.map((point) => ({
    type: 'Feature',
    properties: {
      timestamp: timestamp && point[timestamp],
      id: id && point[id],
      ...point,
    },
    geometry: {
      type: 'Point',
      coordinates: [point[longitude] as number, point[latitude] as number],
    },
  }))
  return {
    type: 'FeatureCollection',
    features,
  } as FeatureCollection
}
