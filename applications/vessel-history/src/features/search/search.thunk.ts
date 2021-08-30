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

const fetchData = async (
  query: string,
  offset: number,
  signal?: AbortSignal | null,
  advancedSearch?: Record<string, any>
) => {
  const endpoint = advancedSearch ? 'advanced-search' : 'search'

  let advancedQuery
  if (advancedSearch) {
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
      // {
      //   key: 'fleet',
      //   value: filters.fleets,
      // },
      // {
      //   key: 'origin',
      //   value: filters.origins,
      // },
      // {
      //   key: 'lastTransmissionDate',
      //   value: filters.activeAfterDate,
      // },
      // {
      //   key: 'firstTransmissionDate',
      //   value: filters.activeBeforeDate,
      // },
    ]
    advancedQuery = getAdvancedSearchQuery(fields)
  }

  const urlQuery = stringify({
    datasets: BASE_DATASET,
    limit: RESULTS_PER_PAGE,
    offset,
    query: advancedQuery || query,
    useTMT: !advancedQuery,
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
const searchNeedsFetch = (
  query: string,
  offset: number,
  metadata: CachedVesselSearch | null
): boolean => {
  if (query.length <= SEARCH_MIN_CHARACTERS) {
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
  advancedSearch: Record<string, any>
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
    condition: ({ query, offset }, { getState, extra }) => {
      const { search } = getState() as RootState
      const metadata: CachedVesselSearch = search.queries[query]

      return searchNeedsFetch(query, offset, metadata)
    },
  }
)
