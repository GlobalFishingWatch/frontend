import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useLocationConnect } from 'routes/routes.hook'
import { selectSearchFilters } from 'features/app/app.selectors'
import {
  SearchFilter,
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

export const useSearchFiltersConnect = () => {
  const searchFilters = useSelector(selectSearchFilters)
  const { dispatchQueryParams } = useLocationConnect()

  const setSearchFilters = useCallback(
    (filter: SearchFilter) => {
      dispatchQueryParams(filter)
    },
    [dispatchQueryParams]
  )

  return {
    searchFilters,
    setSearchFilters,
  }
}
