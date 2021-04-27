import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { BASE_DATASET, RESULTS_PER_PAGE, SEARCH_MIN_CHARACTERS } from 'data/constants'
import { RootState } from 'store'
import { CachedVesselSearch, getSearchMetadata, getSearchResults } from './search.slice'

const fetchData = async (query: string, offset: number, signal?: AbortSignal | null) => {
  return await GFWAPI.fetch<any>(
    `/v1/vessels/search?datasets=${encodeURIComponent(
      BASE_DATASET
    )}&limit=${RESULTS_PER_PAGE}&offset=${offset}&query=${encodeURIComponent(query)}`,
    {
      signal,
    }
  )
    .then((json: any) => {
      const resultVessels: Array<VesselSearch> = json.entries

      return {
        vessels: resultVessels,
        query,
        offset: json.offset,
        total: json.total,
        canSearch: true,
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
  if (!metadata) {
    return true
  }
  if (query && !metadata.vessels && query.length > SEARCH_MIN_CHARACTERS) {
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
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/vessels',
  async ({ query, offset }: VesselSearchThunk, { rejectWithValue, getState, signal }) => {
    const state = getState() as RootState
    const vessels: VesselSearch[] = getSearchResults(state)
    const metadata = getSearchMetadata(state)
    if (searchNeedsFetch(query, offset, metadata)) {
      const searchData = await fetchData(query, offset, signal)
      if (searchData) {
        return {
          ...searchData,
          vessels: offset > 0 ? [...vessels, ...searchData.vessels] : searchData.vessels,
        }
      }
    }
  },
  {
    condition: ({ query }, { getState, extra }) => {
      const { search } = getState() as RootState
      const fetchStatus: CachedVesselSearch = search.queries[query]
      if (!fetchStatus) {
        return true
      }
      if (fetchStatus.searching) {
        return false
      }
    },
  }
)
