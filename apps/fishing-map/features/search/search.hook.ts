import { useCallback, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'

import type { Dataset } from '@globalfishingwatch/api-types'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  ADVANCED_SEARCH_FIELDS,
  isDatasetSearchFieldNeededSupported,
} from 'features/search/advanced/advanced-search.utils'
import { MIN_SEARCH_CHARACTERS, RESULTS_PER_PAGE } from 'features/search/search.config'
import {
  selectSearchFilters,
  selectSearchOption,
  selectSearchQuery,
} from 'features/search/search.config.selectors'
import {
  selectAdvancedSearchDatasets,
  selectBasicSearchDatasets,
} from 'features/search/search.selectors'
import type { VesselSearchState } from 'features/search/search.types'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { useLocationConnect } from 'routes/routes.hook'

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
  return useMemo(
    () => ({ searchPagination, searchSuggestion, searchSuggestionClicked }),
    [searchPagination, searchSuggestion, searchSuggestionClicked]
  )
}

const FIRST_FETCH_FILTERS_TO_IGNORE = [
  'transmissionDateFrom',
  'transmissionDateTo',
  'infoSource',
  'sources',
]

const hasFiltersActive = (filters: VesselSearchState): boolean => {
  return (
    Object.entries(filters).filter(([key]) => {
      return (
        !FIRST_FETCH_FILTERS_TO_IGNORE.includes(key) &&
        filters[key as keyof VesselSearchState] !== undefined &&
        filters[key as keyof VesselSearchState] !== ''
      )
    }).length > 0
  )
}

export const useSearchFiltersErrors = () => {
  const datasets = useSelector(selectAdvancedSearchDatasets)
  const { searchFilters } = useSearchFiltersConnect()
  const searchFilterErrors: Partial<Record<'date' | keyof VesselSearchState, boolean>> = {}

  const disabledFieldSchemas = ADVANCED_SEARCH_FIELDS.flatMap((field) => {
    const selectedDatasets = searchFilters.sources
      ? datasets.filter((dataset) => searchFilters.sources?.includes(dataset.id))
      : datasets

    const disabled = selectedDatasets.every(
      (dataset) => !isDatasetSearchFieldNeededSupported(dataset, [field])
    )
    const hasFilterValue = searchFilters?.[field]
    return hasFilterValue && disabled ? field : []
  })

  if (disabledFieldSchemas.length) {
    disabledFieldSchemas.forEach((field) => {
      searchFilterErrors[field] = true
    })
  }

  if (
    searchFilters.transmissionDateFrom &&
    searchFilters.transmissionDateTo &&
    searchFilters.transmissionDateFrom <= searchFilters.transmissionDateTo
  ) {
    searchFilterErrors.date = true
  }

  if (
    searchFilters.transmissionDateFrom &&
    searchFilters.transmissionDateTo &&
    searchFilters.transmissionDateFrom <= searchFilters.transmissionDateTo
  ) {
    searchFilterErrors.date = true
  }

  return searchFilterErrors
}

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

  const hasFilters = hasFiltersActive(searchFilters)

  return useMemo(
    () => ({
      hasFilters,
      searchFilters,
      setSearchFilters,
    }),
    [hasFilters, searchFilters, setSearchFilters]
  )
}

type FetchSearchResultsParams = {
  query: string
  filters: VesselSearchState
  datasets?: Dataset[]
  since?: string
}

export const useFetchSearchResults = () => {
  const promiseRef = useRef<any>(undefined)
  const query = useSelector(selectSearchQuery)
  const activeSearchOption = useSelector(selectSearchOption)
  const { searchPagination } = useSearchConnect()
  const searchResults = useSelector(selectSearchResults)
  const searchDatasets = useSelector(
    activeSearchOption === 'basic' ? selectBasicSearchDatasets : selectAdvancedSearchDatasets
  ) as Dataset[]
  const gfwUser = useSelector(selectIsGFWUser)
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
              action: searchInBasic
                ? 'Search specific vessel'
                : 'add_filters_and_hit_search_in_advanced_search',
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
    if (since && searchResults?.length < total && total > RESULTS_PER_PAGE) {
      fetchResults({
        query,
        filters: activeSearchOption === 'advanced' ? searchFilters : {},
        since,
      })
    }
  }, [searchPagination, searchResults, fetchResults, query, activeSearchOption, searchFilters])

  return useMemo(() => ({ fetchResults, fetchMoreResults }), [fetchResults, fetchMoreResults])
}
