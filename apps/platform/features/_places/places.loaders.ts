import type { OceanAreaLocale, OceanAreaType } from '@globalfishingwatch/ocean-areas'

import { searchPlaces } from 'features/_places/places.serverfn'
import type { PlaceCategory } from 'features/_places/places.types'
import { PLACE_TYPES } from 'features/_places/places.types'
import { parsePlacesBounds } from 'features/_places/places.utils'
import { getActiveI18nLanguage } from 'features/i18n/i18n'
import type { QueryParams } from 'types'

export const getPlacesLocale = () => getActiveI18nLanguage() as OceanAreaLocale

/** Route loader deps: the list is server-rendered for whatever query and type the URL holds. */
export const getPlacesLoaderDeps = ({ search }: { search: QueryParams }) => ({
  locale: getPlacesLocale(),
  query: search.query,
  sortBy: search.placesSort,
  limit:
    Number.isInteger(search.placesLimit) && search.placesLimit! > 0
      ? search.placesLimit
      : undefined,
  bounds: search.filterByMap ? parsePlacesBounds(search.bounds) : undefined,
})

export const loadPlaces = (
  category: PlaceCategory,
  {
    locale,
    query,
    placeType,
    bounds,
    sortBy,
    limit,
  }: ReturnType<typeof getPlacesLoaderDeps> & { placeType?: OceanAreaType }
) => {
  const types = PLACE_TYPES[category]
  const type = placeType && types.includes(placeType) ? placeType : types[0]
  return searchPlaces({ data: { category, type, query, locale, bounds, sortBy, limit } })
}
