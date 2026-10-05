import { createServerFn } from '@tanstack/react-start'

import type { OceanAreaLocale, OceanAreaType } from '@globalfishingwatch/ocean-areas'

import { getActiveI18nLanguage } from 'features/i18n/i18n'

export type PlaceCategory = 'ports' | 'areas'

/** The first type of each category is the one its page loads by default. */
export const PLACE_TYPES: Record<PlaceCategory, OceanAreaType[]> = {
  ports: ['port'],
  areas: ['eez', 'fao', 'mpa', 'rfmo'],
}

export type Place = {
  id: string
  name: string
  type: OceanAreaType
  flag?: string
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
    }) => {
      if (!Object.hasOwn(PLACE_TYPES, params.category)) {
        throw new Error(`Unknown place category: ${params.category}`)
      }
      if (params.type && !PLACE_TYPES[params.category].includes(params.type)) {
        throw new Error(`Type ${params.type} is not in category ${params.category}`)
      }
      return params
    }
  )
  .handler(async ({ data: { category, type, query = '', locale } }): Promise<Place[]> => {
    const { searchOceanAreas } = await import('@globalfishingwatch/ocean-areas')
    const flagLabels = category === 'ports' ? await getFlagLabels(locale) : undefined
    const areas = await searchOceanAreas(query, {
      types: type ? [type] : PLACE_TYPES[category],
      locale,
      limit: PLACES_LIMIT,
      // Ports also match by country: ISO3 code, English name and name in the request language
      getExtraSearchValues: flagLabels
        ? ({ properties: { flag } }) => (flag ? [flag, ...(flagLabels.get(flag) ?? [])] : [])
        : undefined,
    })
    // Geometries stay on the server — MPAs alone are ~4MB
    return areas.map(({ properties: { area, name, type, flag } }) => ({
      id: String(area ?? name),
      name,
      type,
      flag,
    }))
  })
