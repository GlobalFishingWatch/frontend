import { createAsyncThunk } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import GFWAPI, {
  AdvancedSearchQueryField,
  getAdvancedSearchQuery,
} from '@globalfishingwatch/api-client'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { BASE_DATASET, RESULTS_PER_PAGE, SEARCH_MIN_CHARACTERS } from 'data/constants'
import { RootState } from 'store'
import { CachedVesselSearch } from './search.slice'

export const getSerializedQuery = (query: string, advancedSearch?: Record<string, any>) => {
  if (!advancedSearch) return query
  const fields: AdvancedSearchQueryField[] = [
    {
      key: 'shipname',
      value: query,
    },
    {
      key: 'mmsi',
      value: advancedSearch.mmsi,
    },
    {
      key: 'imo',
      value: advancedSearch.imo,
    },
    {
      key: 'callsign',
      value: advancedSearch.callsign,
    },
    {
      key: 'flag',
      value: advancedSearch.flags.map((f: string) => ({ id: f })),
    },
    {
      key: 'lastTransmissionDate',
      value: advancedSearch.lastTransmissionDate,
    },
    {
      key: 'firstTransmissionDate',
      value: advancedSearch.firstTransmissionDate,
    },
  ]
  return getAdvancedSearchQuery(fields)
}

const fetchData = async (
  query: string,
  offset: number,
  signal?: AbortSignal | null,
  advancedSearch?: Record<string, any>
) => {
  const serializedQuery = getSerializedQuery(query, advancedSearch)
  const endpoint = advancedSearch ? 'advanced-search' : 'search'

  const urlQuery = stringify({
    datasets: BASE_DATASET,
    limit: RESULTS_PER_PAGE,
    offset,
    query: serializedQuery,
    useTMT: true,
  })

  const url = `/v1/vessels/${endpoint}?${urlQuery}`

  return await GFWAPI.fetch<any>(url, {
    signal,
  })
    .then((json: any) => {
      const resultVessels: Array<VesselSearch> = json.entries

      return {
        vessels: resultVessels,
        query,
        offset: json.offset,
        total: json.total,
        searching: false,
      }
    })
    .catch((error) => {
      return null
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

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/vessels',
  async (
    { query, offset, advancedSearch }: VesselSearchThunk,
    { rejectWithValue, getState, signal }
  ) => {
    const searchData = await fetchData(query, offset, signal, advancedSearch)
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
