import {
  booleanPointInPolygon,
  explode,
  nearest,
  point as turfPoint,
  distance,
  bbox,
} from '@turf/turf'
import oceanAreas, { AreaProperties } from './ocean-areas'

const MIN_ZOOM_TO_PREFER_EEZS = 4

interface OceanAreaConfig {
  latitude: number
  longitude: number
  zoom: number
}

const searchOceanAreas = (query: string) => {
  const matchingAreas: AreaProperties[] = []
  oceanAreas.features.forEach((feature) => {
    if (feature.properties.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
      const area: AreaProperties = {
        ...feature.properties,
        bounds: bbox(feature as any),
      }
      matchingAreas.push(area)
    }
  })
  return matchingAreas.slice(0, 10)
}

const getOceanAreaName = ({ latitude, longitude, zoom }: OceanAreaConfig) => {
  let selectedArea: AreaProperties | undefined
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

export { getOceanAreaName, searchOceanAreas, AreaProperties }
export default oceanAreas
