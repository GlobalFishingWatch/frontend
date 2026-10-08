import {
  bbox,
  bboxPolygon,
  booleanIntersects,
  booleanPointInPolygon,
  distance,
  explode,
  nearestPoint as nearest,
  point as turfPoint,
} from '@turf/turf'
import { uniqBy } from 'es-toolkit'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { MatchSorterOptions } from 'match-sorter'
import { matchSorter, rankings } from 'match-sorter'

let oceanAreas: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: [],
}
let oceanAreasLocales = {} as Record<OceanAreaLocale, Record<string, string>>

/** src/data/activity.json, written by scripts/activity.ts */
type OceanAreasActivity = {
  start: string
  end: string
  hours: Partial<Record<OceanAreaType, Record<string, number>>>
  visits?: Record<string, number>
}

const importOceanAreasData = async () => {
  if (!oceanAreas.features.length) {
    oceanAreas = (await import('./data')).default
    oceanAreasLocales = (await import('./locales')).default
    // Kept apart from the area data: it is refreshed on its own cadence, for a fixed time range
    const activity = (await import('./data/activity.json')).default as OceanAreasActivity
    oceanAreas.features.forEach(({ properties }) => {
      const id = String(properties.area)
      const hours = activity.hours[properties.type]?.[id]
      if (hours !== undefined) properties.activityHours = hours
      const visits = properties.type === 'port' ? activity.visits?.[id] : undefined
      if (visits !== undefined) properties.portVisits = visits
    })
  }
}

export type OceanAreaLocaleKey = string
export type OceanAreaType = 'eez' | 'mpa' | 'fao' | 'rfmo' | 'port'
export type OceanAreaBBox = [number, number, number, number]

// export type OceanAreaSource = 'ais' | 'vms'

export interface OceanAreaProperties {
  type: OceanAreaType
  name: string
  area?: number | string
  mrgid?: string
  bounds?: OceanAreaBBox
  /** Surface in m², precomputed from the full-resolution source geometry; polygons only */
  areaSize?: number
  /** Activity hours in the report over a fixed time range (data/activity.json); not all areas */
  activityHours?: number
  /** Ports only: port visits over the same time range (data/activity.json) */
  portVisits?: number
  /** ISO3 country code: the port's country, or the sovereign country of a territory's EEZ */
  flag?: string
  /** Ports only: comma-separated `OceanAreaSource` list, e.g. `'ais'` or `'ais,vms'` */
  // sources?: string
}

export type OceanArea = Feature<Geometry, OceanAreaProperties>

export enum OceanAreaLocale {
  en = 'en',
  es = 'es',
  fr = 'fr',
  id = 'id',
  pt = 'pt',
}

const MIN_ZOOM_NOT_GLOBAL = 3
const MIN_ZOOM_TO_PREFER_EEZS = 5
const MAX_RESULTS_NUMBER = 10

const SEARCH_TYPE_PRIORITY: Record<OceanAreaType, number> = {
  eez: 0,
  rfmo: 1,
  fao: 2,
  port: 3,
  mpa: 4,
}

type GetOceanAreaNameLocaleParam = {
  locale?: OceanAreaLocale
}

const localizeName = (name: OceanAreaLocaleKey, locale = OceanAreaLocale.en) => {
  if (!oceanAreasLocales?.[locale]) {
    return name
  }
  return (oceanAreasLocales?.[locale]?.[name] as OceanAreaLocaleKey) || name
}

const localizeFeatures = (features: OceanArea[], locale = OceanAreaLocale.en) => {
  if (!oceanAreasLocales?.[locale]) {
    return features
  }
  return features.map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      name: localizeName(feature.properties.name as OceanAreaLocaleKey, locale),
    },
  }))
}

type SearchOceanAreaParams = GetOceanAreaNameLocaleParam & {
  types?: readonly OceanAreaType[]
  limit?: number
  /** Values matched against the query besides the area name, e.g. a port's country */
  getExtraSearchValues?: (area: OceanArea) => string[]
  /** Only areas whose bbox intersects these `[west, south, east, north]` bounds */
  bounds?: OceanAreaBBox
  /** `area` and `activity` list the largest first; areas without the value go last */
  sortBy?: 'name' | 'area' | 'activity'
}

const getFeaturePartBBoxes = ({ geometry }: OceanArea): OceanAreaBBox[] =>
  geometry.type === 'MultiPolygon'
    ? geometry.coordinates.map(
        (coordinates) => bbox({ type: 'Polygon', coordinates }) as OceanAreaBBox
      )
    : [bbox(geometry) as OceanAreaBBox]

const getBoundsFilter = ([west, south, east, north]: OceanAreaBBox) => {
  const wrap = (lon: number) => ((((lon + 180) % 360) + 360) % 360) - 180
  const w = wrap(west)
  const e = wrap(east)
  const boxes: OceanAreaBBox[] =
    east - west >= 360
      ? [[-180, south, 180, north]]
      : w <= e
        ? [[w, south, e, north]]
        : [
            [w, south, 180, north],
            [-180, south, e, north],
          ]
  const boxPolygons = boxes.map((box) => bboxPolygon(box))
  const bboxIntersects = ([minX, minY, maxX, maxY]: OceanAreaBBox) =>
    boxes.some(
      ([boxWest, boxSouth, boxEast, boxNorth]) =>
        minX <= boxEast && maxX >= boxWest && minY <= boxNorth && maxY >= boxSouth
    )
  return (feature: OceanArea) => {
    if (!getFeaturePartBBoxes(feature).some(bboxIntersects)) return false
    if (feature.geometry.type === 'Point') return true
    return boxPolygons.some((boxPolygon) => booleanIntersects(feature as any, boxPolygon))
  }
}

/**
 * Every match, sorted, without `limit` or computed `bounds` — for listing and counting. Not deduped
 * by name: distinct places share names (113 ports, ~2.4k MPAs), and ids are unique per type.
 */
export const matchOceanAreas = async (
  query: string,
  {
    locale = OceanAreaLocale.en,
    types,
    getExtraSearchValues,
    bounds,
    sortBy = 'name',
  } = {} as Omit<SearchOceanAreaParams, 'limit'>
): Promise<OceanArea[]> => {
  await importOceanAreasData()
  const features = localizeFeatures(
    types?.length
      ? oceanAreas.features.filter((feature) => types.includes(feature.properties.type))
      : oceanAreas.features,
    locale
  )
  const matchOptions: MatchSorterOptions<OceanArea> = {
    keys: getExtraSearchValues ? ['properties.name', getExtraSearchValues] : ['properties.name'],
    baseSort: (a, b) => {
      const priorityDiff =
        SEARCH_TYPE_PRIORITY[a.item.properties.type] - SEARCH_TYPE_PRIORITY[b.item.properties.type]
      return priorityDiff !== 0
        ? priorityDiff
        : String(a.rankedValue).localeCompare(String(b.rankedValue))
    },
  }
  // Substring matches only; the default `MATCHES` also takes the query's letters in order anywhere
  // ("spain" → "Saint-Pierre and Miquelon"), so it is just the fallback for typos
  let matchingFeatures = matchSorter(features, query, {
    ...matchOptions,
    threshold: rankings.CONTAINS,
  })
  if (!matchingFeatures.length) {
    matchingFeatures = matchSorter(features, query, matchOptions)
  }
  if (bounds) {
    matchingFeatures = matchingFeatures.filter(getBoundsFilter(bounds))
  }
  // Before the limit, so "largest" means largest of all matches, not of the first page.
  // `areaSize` is precomputed by the data scripts (scripts/lib/prepare.ts)
  if (sortBy !== 'name') {
    // Activity is hours for areas and visits for ports
    const getValue = ({ properties }: OceanArea) =>
      (sortBy === 'area'
        ? properties.areaSize
        : (properties.activityHours ?? properties.portVisits)) ?? -1
    matchingFeatures = [...matchingFeatures].sort((a, b) => getValue(b) - getValue(a))
  }
  return matchingFeatures
}

export const searchOceanAreas = async (
  query: string,
  { limit = MAX_RESULTS_NUMBER, ...params } = {} as SearchOceanAreaParams
): Promise<OceanArea[]> => {
  const matches = await matchOceanAreas(query, params)
  // The search dropdowns show names only, so same-name results would look like duplicates
  return uniqBy(matches, (a) => a.properties?.name)
    .slice(0, limit)
    .map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        bounds: bbox(feature as any) as OceanAreaBBox,
      },
    }))
}

/** How many areas the data holds of `types`, e.g. the unfiltered total next to a search count. */
export const countOceanAreas = async (types: readonly OceanAreaType[]): Promise<number> => {
  await importOceanAreasData()
  return oceanAreas.features.filter(({ properties }) => types.includes(properties.type)).length
}

/** Exact lookup by type and id (`properties.area`), e.g. for a port page reached by its URL. */
export const getOceanAreaById = async (
  type: OceanAreaType,
  id: string | number,
  { locale = OceanAreaLocale.en } = {} as GetOceanAreaNameLocaleParam
): Promise<OceanAreaProperties | undefined> => {
  await importOceanAreasData()
  const feature = oceanAreas.features.find(
    ({ properties }) => properties.type === type && String(properties.area) === String(id)
  )
  return feature
    ? { ...feature.properties, name: localizeName(feature.properties.name, locale) }
    : undefined
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

type GetOceanAreaParams = GetOceanAreaNameLocaleParam & { types?: OceanAreaType[] }
const getOceanAreas = async (
  center: LatLon,
  { locale = OceanAreaLocale.en, types } = {} as GetOceanAreaParams
): Promise<OceanAreaProperties[]> => {
  await importOceanAreasData()
  let matchingAreas = getOverlappingAreas(oceanAreas, center)
  if (!matchingAreas.length) {
    const closestFeature = getAreasByDistance(oceanAreas, center)?.[0].properties
    matchingAreas = [
      {
        ...closestFeature,
        name: await localizeName(closestFeature?.name as OceanAreaLocaleKey, locale),
      },
    ]
  }
  if (types?.length) {
    matchingAreas = matchingAreas.filter((feature) => types.includes(feature.properties.type))
  }
  return matchingAreas.map((area) => ({
    ...area,
    name: localizeName(area.name as OceanAreaLocaleKey, locale),
  }))
}

type GetOceanAreaNameParams = GetOceanAreaNameLocaleParam & { combineWithEEZ?: boolean }
export const getOceanAreaName = async (
  { latitude, longitude, zoom }: Viewport,
  {
    locale = OceanAreaLocale.en,
    combineWithEEZ = false,
  }: GetOceanAreaNameParams = {} as GetOceanAreaNameParams
) => {
  if (zoom <= MIN_ZOOM_NOT_GLOBAL) {
    return 'Global'
  }
  const areas = await getOceanAreas({ latitude, longitude })
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
