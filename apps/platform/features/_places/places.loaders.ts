import type { OceanAreaLocale, OceanAreaType } from '@globalfishingwatch/ocean-areas'

import {
  selectById as selectDatasetById,
  upsertDatasets,
} from 'features/_map/datasets/datasets.slice'
import { getDatasetsInDataviews } from 'features/_map/datasets/datasets.utils'
import { selectDataviewBySlug, upsertDataviews } from 'features/_map/dataviews/dataviews.slice'
import { getPlacesMapDataviews, searchPlaces } from 'features/_places/places.serverfn'
import type { PlaceCategory } from 'features/_places/places.types'
import { PLACE_TYPES } from 'features/_places/places.types'
import { parsePlacesBounds } from 'features/_places/places.utils'
import { PLACES_MAP_DATAVIEWS } from 'features/_places/places-map.config'
import { getActiveI18nLanguage } from 'features/i18n/i18n'
import type { AppRouterContext } from 'router/app-router-context'
import { getAppRouterStore } from 'router/app-router-context'
import type { AppStore } from 'store'
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

/**
 * Puts the map's dataviews and datasets in the store, so `usePlacesMapDataviews` finds them on
 * mount. On the server it is awaited and reaches the client through the dehydrated `dataviews`
 * and `datasets` slices; on the client it never blocks the list, and is skipped once loaded.
 */
const loadPlacesMapDataviews = async (
  store: AppStore,
  category: PlaceCategory,
  type: OceanAreaType,
  locale: string
) => {
  const instances = PLACES_MAP_DATAVIEWS[category][type] ?? []
  const state = store.getState()
  const slugs = instances.flatMap(({ dataviewId }) => (dataviewId ? String(dataviewId) : []))
  const loadedDataviews = slugs.flatMap((slug) => selectDataviewBySlug(slug)(state) ?? [])
  const isLoaded =
    loadedDataviews.length === slugs.length &&
    getDatasetsInDataviews(loadedDataviews).every((id) => selectDatasetById(state, id))
  if (isLoaded) return
  try {
    const response = await getPlacesMapDataviews({ data: { category, type, locale } })
    store.dispatch(upsertDataviews(response.dataviews))
    store.dispatch(upsertDatasets(response.datasets))
  } catch (error) {
    // The list must render even when the map can't
    console.warn('Places map: could not load dataviews', error)
  }
}

export const loadPlaces = async (
  category: PlaceCategory,
  {
    locale,
    query,
    placeType,
    bounds,
    sortBy,
    limit,
  }: ReturnType<typeof getPlacesLoaderDeps> & { placeType?: OceanAreaType },
  // `unknown`: a route with a `beforeLoad` that returns nothing types its context as `void`
  context?: unknown
) => {
  const store = getAppRouterStore(context as AppRouterContext)
  const types = PLACE_TYPES[category]
  const type = placeType && types.includes(placeType) ? placeType : types[0]
  const mapDataviews = store && loadPlacesMapDataviews(store, category, type, locale)
  const [result] = await Promise.all([
    searchPlaces({ data: { category, type, query, locale, bounds, sortBy, limit } }),
    // Awaited only on the server: dehydration snapshots the store when loaders settle
    import.meta.env.SSR && mapDataviews,
  ])
  return result
}
