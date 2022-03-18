import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  SearchFilter,
  selectSearchFilters,
  selectSearchPagination,
  selectSearchSuggestion,
  selectSearchSuggestionClicked,
  setFilters,
} from './search.slice'

export const useSearchConnect = () => {
  const searchPagination = useSelector(selectSearchPagination)
  const searchSuggestion = useSelector(selectSearchSuggestion)
  const searchSuggestionClicked = useSelector(selectSearchSuggestionClicked)
  return { searchPagination, searchSuggestion, searchSuggestionClicked }
}

export const useSearchFiltersConnect = () => {
  const searchFilters = useSelector(selectSearchFilters)
  const dispatch = useAppDispatch()

  const setSearchFilters = useCallback(
    (filter: SearchFilter) => {
      dispatch(setFilters(filter))
    },
    [dispatch]
  )

  return {
    searchFilters,
    setSearchFilters,
  }
}
