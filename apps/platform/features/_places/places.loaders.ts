import { createServerFn } from '@tanstack/react-start'

import type { OceanAreaBBox, OceanAreaLocale, OceanAreaType } from '@globalfishingwatch/ocean-areas'

import { parsePlacesBounds } from 'features/_places/places.types'
import { getActiveI18nLanguage } from 'features/i18n/i18n'
import type { QueryParams } from 'types'

export type PlaceCategory = 'ports' | 'areas'

/** The first type of each category is the one its page loads by default. */
export const PLACE_TYPES: Record<PlaceCategory, OceanAreaType[]> = {
  ports: ['port'],
  areas: ['eez', 'fao', 'mpa', 'rfmo'],
}

export type Place = {
  /** The area's raw id, typed as in the map tiles (EEZ ids are numbers) so highlights match */
  id: string | number
  name: string
  type: OceanAreaType
  flag?: string
  /** Ports only: the map's point highlight is drawn at this position */
  coordinates?: [number, number]
}

// ponytail: first 100 matches only, paginate once the list must reach every item
const PLACES_LIMIT = 100

export const getPlacesLocale = () => getActiveI18nLanguage() as OceanAreaLocale

async function getFlagLabels(locale?: string): Promise<Map<string, string[]>> {
  const [{ default: flags }, { fetchServerPackageNamespace }, { normalizeI18nLanguage }] =
    await Promise.all([
      import('data/flags'),
      import('features/i18n/i18n.server'),
      import('features/i18n/i18n.config'),
    ])
  const translated = locale
    ? await fetchServerPackageNamespace(normalizeI18nLanguage(locale), 'flags')
    : {}
  return new Map(
    flags.map(({ id, label }) => {
      const translatedLabel = translated[id]
      return [id, typeof translatedLabel === 'string' ? [label, translatedLabel] : [label]]
    })
  )
}

export const searchPlaces = createServerFn({ method: 'GET' })
  .validator(
    (params: {
      category: PlaceCategory
      /** Narrows to one of the category's types; defaults to all of them. */
      type?: OceanAreaType
      query?: string
      locale?: OceanAreaLocale
      /** `[west, south, east, north]` of the map view; only places inside it. */
      bounds?: OceanAreaBBox
    }) => {
      if (!Object.hasOwn(PLACE_TYPES, params.category)) {
        throw new Error(`Unknown place category: ${params.category}`)
      }
      if (params.type && !PLACE_TYPES[params.category].includes(params.type)) {
        throw new Error(`Type ${params.type} is not in category ${params.category}`)
      }
      if (
        params.bounds &&
        !(
          Array.isArray(params.bounds) &&
          params.bounds.length === 4 &&
          params.bounds.every((value) => Number.isFinite(value))
        )
      ) {
        throw new Error('bounds must be [west, south, east, north] numbers')
      }
      return params
    }
  )
  .handler(async ({ data: { category, type, query = '', locale, bounds } }): Promise<Place[]> => {
    const { searchOceanAreas } = await import('@globalfishingwatch/ocean-areas')
    const flagLabels = category === 'ports' ? await getFlagLabels(locale) : undefined
    const areas = await searchOceanAreas(query, {
      types: type ? [type] : PLACE_TYPES[category],
      locale,
      limit: PLACES_LIMIT,
      bounds,
      // Ports also match by country: ISO3 code, English name and name in the request language
      getExtraSearchValues: flagLabels
        ? ({ properties: { flag } }) => (flag ? [flag, ...(flagLabels.get(flag) ?? [])] : [])
        : undefined,
    })
    // Geometries stay on the server — MPAs alone are ~4MB
    return areas.map(({ properties: { area, name, type, flag }, geometry }) => ({
      id: area ?? name,
      name,
      type,
      flag,
      ...(geometry.type === 'Point' && {
        coordinates: geometry.coordinates as [number, number],
      }),
    }))
  })

/** Route loader deps: the list is server-rendered for whatever query and type the URL holds. */
export const getPlacesLoaderDeps = ({ search }: { search: QueryParams }) => ({
  locale: getPlacesLocale(),
  query: search.query,
  placeType: search.placeType,
  // Only while filtering, so panning with the toggle off does not reload the list
  bounds: search.filterByMap ? parsePlacesBounds(search.bounds) : undefined,
})

export const loadPlaces = (
  category: PlaceCategory,
  { locale, query, placeType, bounds }: ReturnType<typeof getPlacesLoaderDeps>
) => {
  const types = PLACE_TYPES[category]
  // A type from another category (`/ports?placeType=eez`) would make the validator throw
  const type = placeType && types.includes(placeType) ? placeType : types[0]
  return searchPlaces({ data: { category, type, query, locale, bounds } })
}
