import { uniq } from 'es-toolkit'
import { defineCachedFunction } from 'nitro/cache'
import { stringify } from 'qs'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { APIPagination, Dataset, Dataview } from '@globalfishingwatch/api-types'
import type { OceanAreaType } from '@globalfishingwatch/ocean-areas'

import { DEFAULT_PAGINATION_PARAMS, IS_DEVELOPMENT_ENV } from 'data/map/config'
import { getDatasetsInDataviews } from 'features/_map/datasets/datasets.utils'
import type { PlaceCategory } from 'features/_places/places.types'
import { PLACES_MAP_DATAVIEWS } from 'features/_places/places-map.config'
import type { Locale } from 'types'

const PLACES_MAP_CACHE_MAX_AGE_SECONDS = 60 * 60

export type PlacesMapDataviewsParams = {
  category: PlaceCategory
  type: OceanAreaType
  locale: Locale
}

export type PlacesMapDataviewsResponse = { dataviews: Dataview[]; datasets: Dataset[] }

// Stateless and anonymous on purpose: one cached response is served to every user, so it must
// never be fetched with a user's token. These are public dataviews and datasets.
const fetchPublic = <T>(url: string) => GFWAPI.fetch<T>(url, { token: '' })

/** Same requests as fetchDataviewsByIdsThunk + fetchDatasetsByIdsThunk, in one server round trip. */
const fetchPlacesMapDataviews = async ({
  category,
  type,
  locale,
}: PlacesMapDataviewsParams): Promise<PlacesMapDataviewsResponse> => {
  const instances = PLACES_MAP_DATAVIEWS[category][type] ?? []
  const dataviewIds = uniq(instances.flatMap((instance) => instance.dataviewId ?? []))
  const { entries: dataviews } = await fetchPublic<APIPagination<Dataview>>(
    `/dataviews?${stringify({ ids: dataviewIds, cache: false, ...DEFAULT_PAGINATION_PARAMS }, { arrayFormat: 'comma' })}`
  )
  const datasetIds = getDatasetsInDataviews(dataviews)
  if (!datasetIds.length) return { dataviews, datasets: [] }
  // ponytail: no relatedDatasets / deprecated-dataset handling, none of these context layers use them
  const { entries: datasets } = await fetchPublic<APIPagination<Dataset>>(
    `/datasets?${stringify(
      { ids: datasetIds, cache: false, locale: locale.toUpperCase(), ...DEFAULT_PAGINATION_PARAMS },
      { arrayFormat: 'comma' }
    )}&${stringify({ includes: ['I18N', 'DESCRIPTION'] }, { arrayFormat: 'indices' })}`
  )
  return { dataviews, datasets }
}

const fetchPlacesMapDataviewsFromCache = defineCachedFunction(fetchPlacesMapDataviews, {
  name: 'places-map-dataviews',
  maxAge: PLACES_MAP_CACHE_MAX_AGE_SECONDS,
  swr: true,
  getKey: ({ category, type, locale }: PlacesMapDataviewsParams) => `${category}:${type}:${locale}`,
})

export const getPlacesMapDataviewsCached = (params: PlacesMapDataviewsParams) =>
  IS_DEVELOPMENT_ENV ? fetchPlacesMapDataviews(params) : fetchPlacesMapDataviewsFromCache(params)
