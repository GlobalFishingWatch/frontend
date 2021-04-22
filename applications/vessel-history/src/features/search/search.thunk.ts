import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import GFWAPI from '@globalfishingwatch/api-client'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { BASE_DATASET, RESULTS_PER_PAGE, SEARCH_MIN_CHARACTERS } from 'data/constants'
import { selectQuery } from 'routes/routes.selectors'
import { AppState } from 'types/redux.types'
import { CachedVesselSearch, getLastQuery, setSearching, setVesselSearch } from './search.slice'
import { getSearchMetadata, getSearchResults } from './search.selectors'

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
const searchNeedsFetch = (query: string, metadata: CachedVesselSearch | null): boolean => {
  console.log(metadata)
  if (!metadata) {
    return true
  }
  if (metadata.offset >= metadata.vessels.length) {
    return true
  }
  if (query && !metadata.vessels.length && query.length > SEARCH_MIN_CHARACTERS) {
    return true
  }

  return false
}

export const searchThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const query = selectQuery(state)
  const vessels = getSearchResults(state)
  const metadata = getSearchMetadata(state)

  const offset = metadata ? metadata.offset : 0
  if (searchNeedsFetch(query, metadata)) {
    dispatch(setSearching({ query, searching: true }))
    const searchData = await fetchData(query, offset)
    if (searchData) {
      dispatch(
        setVesselSearch({
          ...searchData,
          vessels: offset > 0 ? [...vessels, ...searchData.vessels] : searchData.vessels,
        })
      )
    }
    dispatch(setSearching({ query, searching: false }))
  }
}
