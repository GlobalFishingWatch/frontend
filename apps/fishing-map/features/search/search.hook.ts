import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useLocationConnect } from 'routes/routes.hook'
import { selectSearchFilters } from 'features/search/search.config.selectors'
import { VesselSearchState } from 'types'
import {
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

const FIRST_FETCH_FILTERS_TO_IGNORE = ['lastTransmissionDate', 'firstTransmissionDate']

export const useSearchFiltersConnect = () => {
  const searchFilters = useSelector(selectSearchFilters)
  const { dispatchQueryParams } = useLocationConnect()

  const setSearchFilters = useCallback(
    (filter: VesselSearchState) => {
      dispatchQueryParams(filter)
    },
    [dispatchQueryParams]
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
