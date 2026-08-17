import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'

import type { Dataset } from '@globalfishingwatch/api-types'
import { useDebounce } from '@globalfishingwatch/react-hooks'

import { selectDatasetsStatus } from 'features/_map/datasets/datasets.slice'
import { selectIsGFWUser } from 'features/_user/selectors/user.selectors'
import {
  ADVANCED_SEARCH_FIELDS,
  isDatasetSearchFieldNeededSupported,
} from 'features/_vessels/search/advanced/advanced-search.utils'
import type { SearchType } from 'features/_vessels/search/search.config'
import { MIN_SEARCH_CHARACTERS, RESULTS_PER_PAGE } from 'features/_vessels/search/search.config'
import {
  selectSearchFilters,
  selectSearchOption,
  selectSearchQuery,
} from 'features/_vessels/search/search.config.selectors'
import {
  selectAdvancedSearchDatasets,
  selectBasicSearchDatasets,
} from 'features/_vessels/search/search.selectors'
import type { VesselSearchState } from 'features/_vessels/search/search.types'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

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
  force?: boolean
}

const getSearchParamsKey = ({
  query,
  filters,
  datasets,
  searchType,
}: Pick<FetchSearchResultsParams, 'query' | 'filters' | 'datasets' | 'searchType'>) => {
  const datasetIds = datasets.map(({ id }) => id).join(',')
  return `${searchType}|${query}|${datasetIds}|${JSON.stringify(filters)}`
}

export const useFetchSearchResults = () => {
  const promiseRef = useRef<any>(undefined)
  const lastParamsRef = useRef<Omit<FetchSearchResultsParams, 'since' | 'force'> | undefined>(
    undefined
  )
  const lastParamsKeyRef = useRef<string | undefined>(undefined)
  const { searchPagination } = useSearchConnect()
  const searchResults = useSelector(selectSearchResults)
  const dispatch = useAppDispatch()

  const fetchResults = useCallback(
    ({
      query,
      filters,
      datasets,
      gfwUser,
      since = '',
      searchType,
      force = false,
    }: FetchSearchResultsParams) => {
      if (!datasets?.length || !searchType) {
        return
      }
      if (datasets?.length && searchType) {
        const sources = filters?.sources
          ? datasets.filter(({ id }) => filters?.sources?.includes(id))
          : datasets
        const paramsKey = getSearchParamsKey({
          query,
          filters,
          datasets: sources,
          searchType,
        })
        if (!since && !force && lastParamsKeyRef.current === paramsKey) {
          return
        }
        lastParamsKeyRef.current = paramsKey
        lastParamsRef.current = { query, filters, datasets: sources, gfwUser, searchType }
        if (!since) {
          dispatch(cleanVesselSearchResults())
        }
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

  useEffect(() => {
    return () => {
      promiseRef.current?.abort()
    }
  }, [])

  return useMemo(() => ({ fetchResults, fetchMoreResults }), [fetchResults, fetchMoreResults])
}

export const useSearch = () => {
  const query = useSelector(selectSearchQuery)
  const gfwUser = useSelector(selectIsGFWUser)
  const activeSearchOption = useSelector(selectSearchOption)
  const searchDatasets = useSelector(
    activeSearchOption === 'basic' ? selectBasicSearchDatasets : selectAdvancedSearchDatasets
  ) as Dataset[]

  const debouncedQuery = useDebounce(query, 600)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const areDatasetsLoading = datasetsStatus === AsyncReducerStatus.Loading
  const searchFilterErrors = useSearchFiltersErrors()
  const { hasFilters, searchFilters } = useSearchFiltersConnect()
  const { fetchResults, fetchMoreResults } = useFetchSearchResults()

  const hasSearchFiltersErrors = Object.values(searchFilterErrors).some((e) => e)
  const searchInBasic = activeSearchOption === 'basic' && query?.length > MIN_SEARCH_CHARACTERS - 1
  const searchInAdvanced =
    activeSearchOption === 'advanced' && (hasFilters || (query ? query?.trim() !== '' : false))

  const searchDatasetsHash = searchDatasets.map((dataset) => dataset.id).join(',')

  useEffect(() => {
    if (areDatasetsLoading || hasSearchFiltersErrors || !searchDatasetsHash) {
      return
    }
    if (!searchInBasic && !searchInAdvanced) {
      return
    }
    const timeout = window.setTimeout(() => {
      if (searchInBasic) {
        fetchResults({
          query: debouncedQuery,
          datasets: searchDatasets,
          filters: {},
          gfwUser: gfwUser || false,
          searchType: 'basic',
        })
      } else if (searchInAdvanced) {
        fetchResults({
          query: debouncedQuery,
          datasets: searchDatasets,
          filters: searchFilters,
          gfwUser: gfwUser || false,
          searchType: 'advanced',
        })
      }
    }, 300)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [
    areDatasetsLoading,
    debouncedQuery,
    fetchResults,
    gfwUser,
    hasSearchFiltersErrors,
    searchDatasets,
    searchDatasetsHash,
    searchFilters,
    searchInAdvanced,
    searchInBasic,
  ])

  const onAdvancedSearchClick = useCallback(() => {
    if (!hasSearchFiltersErrors) {
      trackEvent({
        category: TrackCategory.SearchVessel,
        action: 'Add filters to refine Advanced Search',
        label: `name: ${debouncedQuery} | MMSI: ${searchFilters.ssvid} | IMO: ${searchFilters.imo} | Call Sign: ${searchFilters.callsign} | Owner: ${searchFilters.owner} | Info source: ${searchFilters.infoSource} | Sources: ${searchFilters.sources} | Flag: ${searchFilters.flag} | Active After: ${searchFilters.transmissionDateFrom} | Active Before: ${searchFilters.transmissionDateTo}`,
      })
      fetchResults({
        query,
        datasets: searchDatasets,
        filters: searchFilters,
        gfwUser: gfwUser || false,
        searchType: 'advanced',
        force: true,
      })
    }
  }, [
    debouncedQuery,
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
