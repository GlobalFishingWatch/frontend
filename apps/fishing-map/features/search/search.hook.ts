import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useLocationConnect } from 'routes/routes.hook'
import { selectSearchFilters } from 'features/search/search.config.selectors'
import { VesselSearchState } from 'types'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  cleanVesselSearchResults,
  selectSearchPagination,
  selectSearchSuggestion,
  selectSearchSuggestionClicked,
} from './search.slice'

export const useSearchConnect = () => {
  const searchPagination = useSelector(selectSearchPagination)
  const searchSuggestion = useSelector(selectSearchSuggestion)
  const searchSuggestionClicked = useSelector(selectSearchSuggestionClicked)
  return { searchPagination, searchSuggestion, searchSuggestionClicked }
}

const FIRST_FETCH_FILTERS_TO_IGNORE = [
  'transmissionDateFrom',
  'transmissionDateTo',
  'infoSource',
  'sources',
]

export const useSearchFiltersConnect = () => {
  const dispatch = useAppDispatch()
  const searchFilters = useSelector(selectSearchFilters)
  const { dispatchQueryParams } = useLocationConnect()

  const setSearchFilters = useCallback(
    (filter: VesselSearchState) => {
      dispatchQueryParams(filter)
      dispatch(cleanVesselSearchResults())
    },
    [dispatch, dispatchQueryParams]
  )

  const hasFilters =
    Object.entries(searchFilters).filter(([key]) => {
      return (
        !FIRST_FETCH_FILTERS_TO_IGNORE.includes(key) &&
        searchFilters[key] !== undefined &&
        searchFilters[key] !== ''
      )
    }).length > 0

  return {
    hasFilters,
    searchFilters,
    setSearchFilters,
  }
}
