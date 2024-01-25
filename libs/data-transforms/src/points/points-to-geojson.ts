import { Feature, FeatureCollection, Point } from 'geojson'
import { PointColumns } from '../types'
import { parseCoords } from '../coordinates'
import { getUTCDate } from '../list-to-track-segments'

export const pointsListToGeojson = (
  data: Record<string, any>[],
  { latitude, longitude, id, startTime, endTime }: PointColumns
) => {
  const features: Feature<Point>[] = data.flatMap((point, index) => {
    if (!point[latitude] || !point[longitude]) return []
    let coords
    try {
      coords = parseCoords(point[latitude] as number, point[longitude] as number)
    } catch (error) {}
    if (coords) {
      return {
        type: 'Feature',
        properties: {
          ...point,
          ...(startTime && { [startTime]: getUTCDate(point[startTime]).getTime() }),
          ...(endTime && { [endTime]: getUTCDate(point[endTime]).getTime() }),
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

export const pointsGeojsonToNormalizedGeojson = (
  data: FeatureCollection,
  { startTime, endTime }: Partial<PointColumns>
) => {
  return {
    type: 'FeatureCollection',
    features: data.features.map((feature) => ({
      ...feature,
      ...(feature?.properties && {
        properties: {
          ...feature.properties,
          ...(startTime && { [startTime]: getUTCDate(feature.properties[startTime]).getTime() }),
          ...(endTime && { [endTime]: getUTCDate(feature.properties[endTime]).getTime() }),
        },
      }),
    })),
  } as FeatureCollection
}
