import {
  booleanPointInPolygon,
  explode,
  nearest,
  point as turfPoint,
  distance,
  bbox,
} from '@turf/turf'
import { matchSorter } from 'match-sorter'
import { OceanArea, OceanAreaProperties } from '.'

const MIN_ZOOM_TO_PREFER_EEZS = 4
const MAX_RESULTS_NUMBER = 10

const searchOceanAreas = async (query: string): Promise<OceanArea[]> => {
  const oceanAreas = await import('./data').then((areas) => areas.default)
  const matchingFeatures = matchSorter(oceanAreas.features, query, { keys: ['properties.name'] })
  return matchingFeatures.slice(0, MAX_RESULTS_NUMBER).map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      bounds: bbox(feature as any),
    },
  }))
}

export interface OceanAreaParams {
  latitude: number
  longitude: number
  zoom: number
}

const getOceanAreaName = async ({ latitude, longitude, zoom }: OceanAreaParams) => {
  const oceanAreas = await import('./data').then((areas) => areas.default)
  let selectedArea: OceanAreaProperties | undefined
  const point = turfPoint([longitude, latitude])
  const matchingAreas = oceanAreas.features.flatMap((feature) => {
    return booleanPointInPolygon(point, feature as any) ? feature.properties : []
  })

  if (!matchingAreas.length) {
    const filteredFeatures = oceanAreas.features
      .filter((feature) =>
        zoom >= MIN_ZOOM_TO_PREFER_EEZS
          ? feature.properties.type === 'EEZ'
          : feature.properties.type !== 'EEZ'
      )
      .map((feature) => ({
        ...feature,
        distance: distance(point, nearest(point, explode(feature as any))),
      }))
    const closestFeature = filteredFeatures.sort((featureA, featureB) => {
      return featureA.distance - featureB.distance
    })[0]
    selectedArea = closestFeature.properties
  } else {
    if (zoom >= MIN_ZOOM_TO_PREFER_EEZS) {
      const matchingEEZ = matchingAreas.find((area) => area.type === 'EEZ')
      selectedArea = matchingEEZ || matchingAreas[0]
    } else {
      selectedArea = matchingAreas.find((area) => area.type !== 'EEZ')
    }
  }
  return selectedArea?.name
}

export { getOceanAreaName, searchOceanAreas, OceanAreaProperties }
