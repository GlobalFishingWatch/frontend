import { useSelector } from 'react-redux'
import { useCallback, useMemo, useRef } from 'react'
import { Dataset } from '@globalfishingwatch/api-types'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectSearchFilters,
  selectSearchOption,
  selectSearchQuery,
} from 'features/search/search.config.selectors'
import { VesselSearchState } from 'types'
import { useAppDispatch } from 'features/app/app.hooks'
import { MIN_SEARCH_CHARACTERS, RESULTS_PER_PAGE } from 'features/search/search.config'
import { isGFWUser } from 'features/user/user.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  selectBasicSearchDatasets,
  selectAdvancedSearchDatasets,
} from 'features/search/search.selectors'
import {
  cleanVesselSearchResults,
  fetchVesselSearchThunk,
  selectSearchPagination,
  selectSearchResults,
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

export const hasFiltersActive = (filters: VesselSearchState): boolean => {
  return (
    Object.entries(filters).filter(([key]) => {
      return (
        !FIRST_FETCH_FILTERS_TO_IGNORE.includes(key) &&
        filters[key] !== undefined &&
        filters[key] !== ''
      )
    }).length > 0
  )
}

export const useSearchFiltersConnect = () => {
  const dispatch = useAppDispatch()
  const searchFilters = useSelector(selectSearchFilters)
  const { dispatchQueryParams } = useLocationConnect()
  const searchFilterErrors: Record<string, boolean> = {}

  const setSearchFilters = useCallback(
    (filter: VesselSearchState) => {
      dispatchQueryParams(filter)
      dispatch(cleanVesselSearchResults())
    },
    [dispatch, dispatchQueryParams]
  )

  const hasFilters = hasFiltersActive(searchFilters)

  if (
    searchFilters.transmissionDateFrom &&
    searchFilters.transmissionDateTo &&
    searchFilters.transmissionDateFrom <= searchFilters.transmissionDateTo
  ) {
    searchFilterErrors.date = true
  }

  return {
    hasFilters,
    searchFilterErrors,
    searchFilters,
    setSearchFilters,
  }
}

export type FetchSearchResultsParams = {
  query: string
  filters: VesselSearchState
  datasets?: Dataset[]
  since?: string
}

export const useFetchSearchResults = () => {
  const promiseRef = useRef<any>()
  const query = useSelector(selectSearchQuery)
  const activeSearchOption = useSelector(selectSearchOption)
  const { searchPagination } = useSearchConnect()
  const searchResults = useSelector(selectSearchResults)
  const searchDatasets = useSelector(
    activeSearchOption === 'basic' ? selectBasicSearchDatasets : selectAdvancedSearchDatasets
  ) as Dataset[]
  const gfwUser = useSelector(isGFWUser)
  const { searchFilters } = useSearchFiltersConnect()
  const dispatch = useAppDispatch()

  const fetchResults = useCallback(
    ({ query, filters, datasets = searchDatasets, since = '' }: FetchSearchResultsParams) => {
      const searchInBasic =
        activeSearchOption === 'basic' && query?.length > MIN_SEARCH_CHARACTERS - 1
      const searchInAdvanced =
        activeSearchOption === 'advanced' && (hasFiltersActive(filters) || query)
      if (datasets?.length && (searchInAdvanced || searchInBasic)) {
        const sources = filters?.sources
          ? datasets.filter(({ id }) => filters?.sources?.includes(id))
          : datasets
        if (promiseRef.current) {
          promiseRef.current.abort()
        }
        // To ensure the pending action isn't overwritted by the abort above
        // and we miss the loading intermediate state
        promiseRef.current = dispatch(
          fetchVesselSearchThunk({
            query,
            filters,
            datasets: sources,
            since,
            gfwUser,
          })
        )
        // TODO: Find a better approach to sync query
        // and searchPagination.total to track the search in google analytics
        promiseRef.current.then((data: any) => {
          const total = data?.payload?.pagination?.total
          if (total >= 0) {
            trackEvent({
              category: TrackCategory.SearchVessel,
              action: 'Search specific vessel',
              label: query,
              value: total,
            })
          }
        })
      }
    },
    [activeSearchOption, dispatch, gfwUser, searchDatasets]
  )

  const fetchMoreResults = useCallback(() => {
    const { since, total } = searchPagination
    if (since && searchResults!?.length < total && total > RESULTS_PER_PAGE) {
      fetchResults({
        query,
        filters: activeSearchOption === 'advanced' ? searchFilters : {},
        since,
      })
    }
  }, [searchPagination, searchResults, fetchResults, query, activeSearchOption, searchFilters])

  return useMemo(() => ({ fetchResults, fetchMoreResults }), [fetchResults, fetchMoreResults])
}
