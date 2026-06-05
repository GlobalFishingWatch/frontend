import { useCallback, useEffect, useEffectEvent, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'

import type { Dataset } from '@globalfishingwatch/api-types'
import { useDebounce } from '@globalfishingwatch/react-hooks'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  ADVANCED_SEARCH_FIELDS,
  isDatasetSearchFieldNeededSupported,
} from 'features/search/advanced/advanced-search.utils'
import type { SearchType } from 'features/search/search.config'
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
import { useReplaceQueryParams } from 'router/routes.hook'

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
      const value = filters[key as keyof VesselSearchState]
      return (
        !FIRST_FETCH_FILTERS_TO_IGNORE.includes(key) &&
        (typeof value === 'string' ? value.trim() !== '' : value !== undefined)
      )
    }).length > 0
  )
}

export const useSearchFiltersConnect = () => {
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const searchFilters = useSelector(selectSearchFilters)
  const setSearchFilters = useCallback(
    (filter: VesselSearchState) => {
      replaceQueryParams(filter)
      dispatch(cleanVesselSearchResults())
    },
    [dispatch, replaceQueryParams]
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

type FetchSearchResultsParams = {
  query: string
  filters: VesselSearchState
  datasets: Dataset[]
  searchType: SearchType
  gfwUser: boolean
  since?: string
}

export const useFetchSearchResults = () => {
  const promiseRef = useRef<any>(undefined)
  const lastParamsRef = useRef<Omit<FetchSearchResultsParams, 'since'> | undefined>(undefined)
  const { searchPagination } = useSearchConnect()
  const searchResults = useSelector(selectSearchResults)
  const dispatch = useAppDispatch()

  const fetchResults = useCallback(
    ({ query, filters, datasets, gfwUser, since = '', searchType }: FetchSearchResultsParams) => {
      if (datasets?.length && searchType) {
        const sources = filters?.sources
          ? datasets.filter(({ id }) => filters?.sources?.includes(id))
          : datasets
        lastParamsRef.current = { query, filters, datasets: sources, gfwUser, searchType }
        if (promiseRef.current) {
          promiseRef.current.abort()
        }
        promiseRef.current = dispatch(
          fetchVesselSearchThunk({ query, filters, datasets: sources, since, gfwUser, searchType })
        )
        // TODO: Find a better approach to sync query
        // and searchPagination.total to track the search in google analytics
        promiseRef.current.then((data: any) => {
          const total = data?.payload?.pagination?.total
          if (total >= 0) {
            trackEvent({
              category: TrackCategory.SearchVessel,
              action:
                searchType === 'basic'
                  ? 'Search specific vessel'
                  : 'add_filters_and_hit_search_in_advanced_search',
              label: query,
              value: total,
            })
          }
        })
      }
    },
    [dispatch]
  )

  const fetchMoreResults = useCallback(() => {
    const { since, total } = searchPagination
    if (
      since &&
      searchResults?.length < total &&
      total > RESULTS_PER_PAGE &&
      lastParamsRef.current
    ) {
      fetchResults({ ...lastParamsRef.current, since })
    }
  }, [fetchResults, searchPagination, searchResults?.length])

  return useMemo(() => ({ fetchResults, fetchMoreResults }), [fetchResults, fetchMoreResults])
}

export const useSearch = () => {
  const query = useSelector(selectSearchQuery)
  const gfwUser = useSelector(selectIsGFWUser)
  const activeSearchOption = useSelector(selectSearchOption)
  const searchDatasets = useSelector(
    activeSearchOption === 'basic' ? selectBasicSearchDatasets : selectAdvancedSearchDatasets
  ) as Dataset[]

  const dispatch = useAppDispatch()
  const debouncedQuery = useDebounce(query, 600)
  const searchFilterErrors = useSearchFiltersErrors()
  const { hasFilters, searchFilters } = useSearchFiltersConnect()
  const { fetchResults, fetchMoreResults } = useFetchSearchResults()

  const hasSearchFiltersErrors = Object.values(searchFilterErrors).some((e) => e)
  const searchInBasic = activeSearchOption === 'basic' && query?.length > MIN_SEARCH_CHARACTERS - 1
  const searchInAdvanced =
    activeSearchOption === 'advanced' && (hasFilters || (query ? query?.trim() !== '' : false))

  const onBasicSearch = useEffectEvent(() => {
    dispatch(cleanVesselSearchResults())
    fetchResults({
      query: debouncedQuery,
      datasets: searchDatasets,
      filters: {},
      gfwUser: gfwUser || false,
      searchType: 'basic',
    })
  })

  const onAdvancedSearch = useEffectEvent(() => {
    fetchResults({
      query,
      datasets: searchDatasets,
      filters: searchFilters,
      gfwUser: gfwUser || false,
      searchType: 'advanced',
    })
  })

  const searchDatasetsHash = searchDatasets.map((dataset) => dataset.id).join(',')

  useEffect(() => {
    if (searchDatasetsHash?.length && !hasSearchFiltersErrors) {
      if (searchInBasic) {
        onBasicSearch()
      } else if (searchInAdvanced) {
        onAdvancedSearch()
      }
    }
  }, [hasSearchFiltersErrors, debouncedQuery, searchDatasetsHash, searchInAdvanced, searchInBasic])

  const onAdvancedSearchClick = useCallback(() => {
    if (!hasSearchFiltersErrors) {
      trackEvent({
        category: TrackCategory.SearchVessel,
        action: 'Add filters to refine Advanced Search',
        label: `name: ${debouncedQuery} | MMSI: ${searchFilters.ssvid} | IMO: ${searchFilters.imo} | Call Sign: ${searchFilters.callsign} | Owner: ${searchFilters.owner} | Info source: ${searchFilters.infoSource} | Sources: ${searchFilters.sources} | Flag: ${searchFilters.flag} | Active After: ${searchFilters.transmissionDateFrom} | Active Before: ${searchFilters.transmissionDateTo}`,
      })
      dispatch(cleanVesselSearchResults())
      fetchResults({
        query,
        datasets: searchDatasets,
        filters: searchFilters,
        gfwUser: gfwUser || false,
        searchType: 'advanced',
      })
    }
  }, [
    debouncedQuery,
    dispatch,
    fetchResults,
    gfwUser,
    hasSearchFiltersErrors,
    query,
    searchDatasets,
    searchFilters,
  ])

  return useMemo(
    () => ({ debouncedQuery, fetchMoreResults, onAdvancedSearchClick }),
    [debouncedQuery, fetchMoreResults, onAdvancedSearchClick]
  )
}
