import { Feature, FeatureCollection, Geometry } from 'geojson'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import explode from '@turf/explode'
import nearest from '@turf/nearest-point'
import { point as turfPoint } from '@turf/helpers'
import distance from '@turf/distance'
import bbox from '@turf/bbox'
import { matchSorter } from 'match-sorter'
import oceanAreas from './data/geometries'
import oceanAreasLocales from './data/locales'
import sourceLocales from './data/locales/source.json'

export type OceanAreaLocaleKey = keyof typeof sourceLocales
export type OceanAreaType = 'ocean' | 'eez' | 'mpa'
export type OceanAreaBBox = [number, number, number, number]

export interface OceanAreaProperties {
  type: OceanAreaType
  name: string
  /* Extension of the area in kilometers */
  area?: number
  mrgid?: string
  bounds?: OceanAreaBBox
}

export type OceanArea = Feature<Geometry, OceanAreaProperties>

export enum OceanAreaLocale {
  en = 'en',
  es = 'es',
  fr = 'fr',
  id = 'id',
}

const MIN_ZOOM_NOT_GLOBAL = 3
const MIN_ZOOM_TO_PREFER_EEZS = 5
const MAX_RESULTS_NUMBER = 10

type GetOceanAreaNameLocaleParam = {
  locale: OceanAreaLocale
}

const localizeName = (name: OceanAreaLocaleKey, locale = OceanAreaLocale.en) => {
  if (!oceanAreasLocales[locale]) {
    return name
  }
  return (oceanAreasLocales[locale][name] as OceanAreaLocaleKey) || name
}

const localizeArea = (area: typeof oceanAreas, locale = OceanAreaLocale.en) => {
  if (!oceanAreasLocales[locale]) {
    return area
  }

  return {
    ...area,
    features: area.features?.map((feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          name: localizeName(feature.properties.name as OceanAreaLocaleKey, locale),
        },
      }
    }),
  }
}

const searchOceanAreas = (
  query: string,
  { locale = OceanAreaLocale.en }: GetOceanAreaNameLocaleParam = {} as GetOceanAreaNameLocaleParam
): OceanArea[] => {
  const localizedAreas = localizeArea(oceanAreas, locale)
  const matchingFeatures = matchSorter(localizedAreas.features, query, {
    keys: ['properties.name'],
  })
  const areas = matchingFeatures.slice(0, MAX_RESULTS_NUMBER).map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      bounds: bbox(feature as any) as OceanAreaBBox,
    },
  }))
  return areas
}

interface LatLon {
  latitude: number
  longitude: number
}

interface Viewport extends LatLon {
  zoom: number
}

export const getOverlappingAreas = (areas: FeatureCollection, { latitude, longitude }: LatLon) => {
  const point = turfPoint([longitude, latitude])
  const matchingAreas = areas.features
    .flatMap((feature) => {
      return booleanPointInPolygon(point, feature as any) ? feature.properties : []
    })
    .sort((featureA, featureB) => {
      if (featureA.area && featureB.area) return featureA.area - featureB.area
      else return -1
    })
  return matchingAreas
}

export const getAreasByDistance = (areas: FeatureCollection, { latitude, longitude }: LatLon) => {
  const point = turfPoint([longitude, latitude])
  const filteredFeatures = areas.features.map((feature) => ({
    ...feature,
    distance: distance(point, nearest(point, explode(feature as any)) as any),
  }))
  const closestFeatures = filteredFeatures.sort((featureA, featureB) => {
    return featureA.distance - featureB.distance
  })
  return closestFeatures
}

// Returns all overlapping areas, ordered from smallest to biggest
// If no overlapping area found, returns only the closest area
const getOceanAreas = (
  center: LatLon,
  { locale = OceanAreaLocale.en }: GetOceanAreaNameLocaleParam = {} as GetOceanAreaNameLocaleParam
): OceanAreaProperties[] => {
  let matchingAreas = getOverlappingAreas(oceanAreas, center)
  if (!matchingAreas.length) {
    const closestFeature = getAreasByDistance(oceanAreas, center)?.[0].properties
    matchingAreas = [
      { ...closestFeature, name: localizeName(closestFeature?.name as OceanAreaLocaleKey, locale) },
    ]
  }
  return matchingAreas.map((area) => ({
    ...area,
    name: localizeName(area.name as OceanAreaLocaleKey, locale),
  }))
}

type GetOceanAreaNameParams = GetOceanAreaNameLocaleParam & { combineWithEEZ?: boolean }
const getOceanAreaName = (
  { latitude, longitude, zoom }: Viewport,
  {
    locale = OceanAreaLocale.en,
    combineWithEEZ = false,
  }: GetOceanAreaNameParams = {} as GetOceanAreaNameParams
) => {
  if (zoom <= MIN_ZOOM_NOT_GLOBAL) {
    return 'Global'
  }
  const areas = getOceanAreas({ latitude, longitude })
  const ocean = areas.find((area) => area.type !== 'eez')
  const eez = areas.find((area) => area.type === 'eez')

  if (!combineWithEEZ) {
    const name = eez && zoom > MIN_ZOOM_TO_PREFER_EEZS ? eez?.name : ocean?.name
    return localizeName(name as OceanAreaLocaleKey, locale)
  }

  const name = [ocean, eez]
    .filter(Boolean)
    .flatMap((f) => (f?.name ? localizeName(f.name as OceanAreaLocaleKey, locale) : []))
    .join(', ')
  return name
}

export { getOceanAreaName, searchOceanAreas }
