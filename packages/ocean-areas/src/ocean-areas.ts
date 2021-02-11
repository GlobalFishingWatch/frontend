import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import explode from '@turf/explode'
import nearest from '@turf/nearest-point'
import { point as turfPoint } from '@turf/helpers'
import distance from '@turf/distance'
import bbox from '@turf/bbox'
import { matchSorter } from 'match-sorter'
import oceanAreas from './data'
import { OceanArea, OceanAreaProperties } from '.'

const MIN_ZOOM_NOT_GLOBAL = 3
const MIN_ZOOM_TO_PREFER_EEZS = 5
const MAX_RESULTS_NUMBER = 10

const searchOceanAreas = (query: string): OceanArea[] => {
  const matchingFeatures = matchSorter(oceanAreas.features, query, { keys: ['properties.name'] })
  return matchingFeatures.slice(0, MAX_RESULTS_NUMBER).map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      bounds: bbox(feature as any),
    },
  }))
}

interface LatLon {
  latitude: number
  longitude: number
}

interface Viewport extends LatLon {
  zoom: number
}

// Returns all overlapping areas, ordered from smallest to biggest
// If no overlapping area found, returns only the closest area
const getOceanAreas = ({ latitude, longitude }: LatLon): OceanAreaProperties[] => {
  const point = turfPoint([longitude, latitude])
  const matchingAreas = oceanAreas.features
    .flatMap((feature) => {
      return booleanPointInPolygon(point, feature as any) ? feature.properties : []
    })
    .sort((featureA, featureB) => {
      return featureA.area - featureB.area
    })

  if (!matchingAreas.length) {
    const filteredFeatures = oceanAreas.features.map((feature) => ({
      ...feature,
      distance: distance(point, nearest(point, explode(feature as any))),
    }))
    const closestFeature = filteredFeatures.sort((featureA, featureB) => {
      return featureA.distance - featureB.distance
    })[0].properties
    return [closestFeature]
  }
  return matchingAreas
}

const getOceanAreaName = ({ latitude, longitude, zoom }: Viewport, combineWithEEZ?: boolean) => {
  if (zoom <= MIN_ZOOM_NOT_GLOBAL) {
    return 'Global'
  }
  const areas = getOceanAreas({ latitude, longitude })
  const ocean = areas.find((area) => area.type !== 'eez')
  const eez = areas.find((area) => area.type === 'eez')

  if (!combineWithEEZ) {
    return eez && zoom > MIN_ZOOM_TO_PREFER_EEZS ? eez?.name : ocean?.name
  }

  const name = [ocean, eez]
    .filter(Boolean)
    .map((f) => f!.name)
    .join(', ')
  return name
}

export { getOceanAreaName, searchOceanAreas, OceanAreaProperties }
