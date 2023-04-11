import { createAsyncThunk } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { event as uaEvent } from 'react-ga'
import {
  GFWAPI,
  AdvancedSearchQueryField,
  getAdvancedSearchQuery,
} from '@globalfishingwatch/api-client'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { BASE_DATASET, RESULTS_PER_PAGE, SEARCH_MIN_CHARACTERS } from 'data/constants'
import { RootState } from 'features/app/app.hooks'
import { SearchResults } from 'types'
import { API_VERSION } from 'data/config'
import { CachedVesselSearch } from './search.slice'

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
      key: 'lastTransmissionDate',
      value: advancedSearch?.lastTransmissionDate,
    },
    {
      key: 'firstTransmissionDate',
      value: advancedSearch?.firstTransmissionDate,
    },
  ]
  return getAdvancedSearchQuery(fields)
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
    'use-tmt': true,
  })

  const url = `/vessels/advanced-search-tmt?${urlQuery}`

  return await GFWAPI.fetch<any>(url, {
    signal,
  })
    .then((json: any) => {
      const resultVessels: Array<VesselSearch> = json.entries
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
    uaEvent({
      category: 'Search Vessel VV',
      action: 'Click Search',
      label: JSON.stringify({ ...query, vessels }),
      value: results?.total,
    })
  } else {
    uaEvent({
      category: 'Search Vessel VV',
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
