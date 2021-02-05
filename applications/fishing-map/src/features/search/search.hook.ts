import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import {
  SearchFilter,
  selectSearchFilters,
  selectSearchFiltersOpen,
  selectSearchPagination,
  selectSearchSuggestion,
  selectSearchSuggestionClicked,
  setFilters,
  setFiltersOpen,
} from './search.slice'

export const useSearchConnect = () => {
  const searchPagination = useSelector(selectSearchPagination)
  const searchSuggestion = useSelector(selectSearchSuggestion)
  const searchSuggestionClicked = useSelector(selectSearchSuggestionClicked)
  return { searchPagination, searchSuggestion, searchSuggestionClicked }
}

export const useSearchFiltersConnect = () => {
  const searchFiltersOpen = useSelector(selectSearchFiltersOpen)
  const searchFilters = useSelector(selectSearchFilters)
  const dispatch = useDispatch()

  const setSearchFiltersOpen = useCallback(
    (open: boolean) => {
      dispatch(setFiltersOpen(open))
    },
    [dispatch]
  )

  const setSearchFilters = useCallback(
    (filter: SearchFilter) => {
      dispatch(setFilters(filter))
    },
    [dispatch]
  )

  return {
    searchFilters,
    searchFiltersOpen,
    setSearchFiltersOpen,
    setSearchFilters,
  }
}
