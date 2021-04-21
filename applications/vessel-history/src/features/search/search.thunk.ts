import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import GFWAPI from '@globalfishingwatch/api-client'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { BASE_DATASET, RESULTS_PER_PAGE, SEARCH_MIN_CHARACTERS } from 'data/constants'
import { selectQuery } from 'routes/routes.selectors'
import { AppState } from 'types/redux.types'
import {
  getLastQuery,
  getOffset,
  getVesselsFound,
  isSearching,
  setSearching,
  setVesselSearch,
} from './search.slice'

const fetchData = async (query: string, offset: number) => {
  return await GFWAPI.fetch<any>(
    `/v1/vessels/search?datasets=${encodeURIComponent(
      BASE_DATASET
    )}&limit=${RESULTS_PER_PAGE}&offset=${offset}&query=${encodeURIComponent(query)}`
  )
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

export const searchThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const query = selectQuery(state)
  const offset = getOffset(state)
  const vessels = getVesselsFound(state)
  const serching = isSearching(state)
  const lastQuery = getLastQuery(state)

  if (!serching && query && query.length > SEARCH_MIN_CHARACTERS) {
    dispatch(setSearching(true))
    if (query !== lastQuery) {
      const searchData = await fetchData(query, offset)
      if (searchData) {
        dispatch(
          setVesselSearch({
            ...searchData,
            vessels: offset > 0 ? [...vessels, ...searchData.vessels] : searchData.vessels,
          })
        )
      }
    }
    dispatch(setSearching(false))
  }
}
