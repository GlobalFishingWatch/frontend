import { createAsyncThunk } from '@reduxjs/toolkit'
import { GFWApiClient } from 'http-client/http-client'
import { stringify } from 'qs'
import type { RootState } from 'store'
import type { SearchResults } from 'types'

import type { AdvancedSearchQueryField} from '@globalfishingwatch/api-client';
import { getAdvancedSearchQuery } from '@globalfishingwatch/api-client'
import type { VesselSearch } from '@globalfishingwatch/api-types'

import { IS_STANDALONE_APP } from 'data/config'
import { BASE_DATASET, RESULTS_PER_PAGE, SEARCH_MIN_CHARACTERS } from 'data/constants'
import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'

import type { CachedVesselSearch } from './search.slice'

export const getSerializedQuery = (query: string, advancedSearch?: Record<string, any>) => {
  const fields: AdvancedSearchQueryField[] = [
    {
      key: 'shipname',
      value: query,
    },
    {
      key: 'mmsi',
      value: advancedSearch?.mmsi,
    },
    {
      key: 'imo',
      value: advancedSearch?.imo,
    },
    {
      key: 'callsign',
      value: advancedSearch?.callsign,
    },
    {
      key: 'flag',
      value: advancedSearch?.flags?.map((f: string) => ({ id: f })),
    },
    {
      key: 'lastTransmissionDate' as any,
      value: advancedSearch?.lastTransmissionDate,
    },
    {
      key: 'firstTransmissionDate' as any,
      value: advancedSearch?.firstTransmissionDate,
    },
  ]
  return getAdvancedSearchQuery(fields, {})
}

export const fetchData = async (
  query: string,
  offset: number,
  signal?: AbortSignal | null,
  advancedSearch?: Record<string, any>
) => {
  const serializedQuery = getSerializedQuery(query, advancedSearch)

  const urlQuery = stringify({
    datasets: BASE_DATASET,
    limit: RESULTS_PER_PAGE,
    offset,
    query: serializedQuery,
    ...(!IS_STANDALONE_APP && { 'use-tmt': true }),
  })

  const url = IS_STANDALONE_APP
    ? `/v2/vessels/advanced-search?${urlQuery}` // TODO: why advance search return 403?
    : `/v2/vessels/advanced-search-tmt?${urlQuery}`

  return await GFWApiClient.fetch<any>(url, {
    signal,
  })
    .then((json: any) => {
      const resultVessels: VesselSearch[] = json.entries
      return {
        success: true,
        error: null,
        vessels: resultVessels,
        query,
        offset: json.offset,
        total: json.total,
        searching: false,
        sources: json.metadata.sources,
      }
    })
    .catch((error) => {
      return {
        success: false,
        error,
        vessels: [],
        query,
        offset: 0,
        total: 0,
        searching: false,
        sources: [],
      }
    })
}
const getSearchNeedsFetch = (
  query: string,
  offset: number,
  metadata: CachedVesselSearch | null
): boolean => {
  if (query.length < SEARCH_MIN_CHARACTERS) {
    return false
  }
  if (!metadata) {
    return true
  }
  if (metadata.searching) {
    return false
  }
  if (query && !metadata.vessels) {
    return true
  }
  if (!metadata.vessels || offset >= metadata.vessels.length) {
    return true
  }

  return false
}

export type VesselSearchThunk = {
  query: string
  offset: number
  advancedSearch?: Record<string, any>
}

const trackData = (query: any, results: SearchResults | null, actualResults: number) => {
  if (!query.offset || query.offset === 0) {
    const vessels = results?.vessels.slice(0, 5).map((vessel) => {
      return {
        gfw: vessel.id,
        tmt: vessel.vesselMatchId,
      }
    })
    trackEvent({
      category: TrackCategory.SearchVesselVV,
      action: 'Click Search',
      label: JSON.stringify({ ...query, vessels }),
      value: results?.total,
    })
  } else {
    trackEvent({
      category: TrackCategory.SearchVesselVV,
      action: 'Click Load More',
      label: actualResults.toString(),
      value: results?.total,
    })
  }
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/vessels',
  async ({ query, offset, advancedSearch }: VesselSearchThunk, { signal, rejectWithValue }) => {
    const searchData = await fetchData(query, offset, signal, advancedSearch)
    if (!searchData.success) {
      return rejectWithValue(searchData.error)
    }
    trackData({ query: query, ...advancedSearch }, searchData, 5)
    return searchData
  },
  {
    condition: ({ query, offset, advancedSearch }, { getState, extra }) => {
      const serializedQuery = getSerializedQuery(query, advancedSearch)
      const { search } = getState() as RootState
      const metadata: CachedVesselSearch = search.queries[serializedQuery]
      const searchNeedsFetch = getSearchNeedsFetch(serializedQuery, offset, metadata)
      return searchNeedsFetch
    },
  }
)
