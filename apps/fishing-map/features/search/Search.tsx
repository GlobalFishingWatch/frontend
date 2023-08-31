import { useEffect, useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { Dataset } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { isAuthError } from '@globalfishingwatch/api-client'
import { useLocationConnect } from 'routes/routes.hook'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { isGFWUser, isGuestUser } from 'features/user/user.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import SearchBasic from 'features/search/SearchBasic'
import SearchAdvanced from 'features/search/SearchAdvanced'
import SearchPlaceholder, { SearchNotAllowed } from 'features/search/SearchPlaceholders'
import I18nNumber from 'features/i18n/i18nNumber'
import { selectWorkspaceId } from 'routes/routes.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { selectDatasetsError, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { selectSearchOption, selectSearchQuery } from 'features/search/search.config.selectors'
import { RESULTS_PER_PAGE } from 'features/search/search.config'
import { VesselSearchState } from 'types'
import SearchDownload from 'features/search/SearchDownload'
import SearchActions from 'features/search/SearchActions'
import {
  fetchVesselSearchThunk,
  cleanVesselSearchResults,
  setSuggestionClicked,
  selectSearchPagination,
  selectSearchResults,
  selectSelectedVessels,
} from './search.slice'
import { useSearchConnect, useSearchFiltersConnect } from './search.hook'
import {
  selectBasicSearchDatasets,
  selectAdvancedSearchDatasets,
  isBasicSearchAllowed,
  isAdvancedSearchAllowed,
} from './search.selectors'
import styles from './Search.module.css'

const MIN_SEARCH_CHARACTERS = 3

function Search() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const searchQuery = useSelector(selectSearchQuery)
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const searchResults = useSelector(selectSearchResults)
  const { hasFilters, searchFilters } = useSearchFiltersConnect()
  const { searchPagination, searchSuggestion } = useSearchConnect()
  const debouncedQuery = useDebounce(searchQuery, 600)
  const { dispatchQueryParams } = useLocationConnect()
  const gfwUser = useSelector(isGFWUser)
  const activeSearchOption = useSelector(selectSearchOption)
  const searchResultsPagination = useSelector(selectSearchPagination)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const searchDatasets = useSelector(
    activeSearchOption === 'basic' ? selectBasicSearchDatasets : selectAdvancedSearchDatasets
  ) as Dataset[]
  const [vesselsSelectedDownload, setVesselsSelectedDownload] = useState([])

  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const guestUser = useSelector(isGuestUser)
  const datasetError = useSelector(selectDatasetsError)
  const promiseRef = useRef<any>()

  useEffect(() => {
    dispatch(fetchWorkspaceThunk(urlWorkspaceId))
  }, [dispatch, urlWorkspaceId])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchResults = useCallback(
    debounce(
      ({
        query,
        datasets,
        filters,
        since = '',
      }: {
        query: string
        datasets: Dataset[]
        filters: VesselSearchState
        since?: string
      }) => {
        if (
          datasets?.length &&
          (activeSearchOption === 'advanced' || query?.length > MIN_SEARCH_CHARACTERS - 1)
        ) {
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
      100
    ),
    [dispatch, activeSearchOption]
  )

  const fetchMoreResults = useCallback(() => {
    const { since, total } = searchPagination
    if (since && searchResults!?.length < total && total > RESULTS_PER_PAGE && searchDatasets) {
      fetchResults({
        query: debouncedQuery,
        datasets: searchDatasets,
        filters: activeSearchOption === 'advanced' ? searchFilters : {},
        since,
      })
    }
  }, [
    searchPagination,
    searchResults,
    searchDatasets,
    fetchResults,
    debouncedQuery,
    activeSearchOption,
    searchFilters,
  ])

  useEffect(() => {
    if (searchDatasets?.length && activeSearchOption === 'basic' && debouncedQuery) {
      fetchResults({
        query: debouncedQuery,
        datasets: searchDatasets,
        filters: {},
      })
    }
  }, [debouncedQuery, searchFilters, activeSearchOption, searchDatasets, fetchResults, hasFilters])

  useEffect(() => {
    if (activeSearchOption === 'advanced' && (hasFilters || debouncedQuery)) {
      fetchResults({
        query: searchQuery,
        datasets: searchDatasets,
        filters: searchFilters,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDatasets])

  useEffect(() => {
    if (debouncedQuery === '') {
      dispatch(cleanVesselSearchResults())
    }
    dispatchQueryParams({ query: debouncedQuery })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {
    // State cleanup needed to avoid sluggist renders when there are lots of vessels
    if (vesselsSelectedDownload.length) {
      setVesselsSelectedDownload([])
    }
  }, [vesselsSelectedDownload.length])

  const onSuggestionClick = () => {
    if (searchSuggestion) {
      dispatch(setSuggestionClicked(true))
      dispatchQueryParams({ query: searchSuggestion })
    }
  }

  const onConfirmSearch = useCallback(() => {
    dispatch(cleanVesselSearchResults())
    fetchResults({
      query: debouncedQuery,
      datasets: searchDatasets,
      filters: searchFilters,
    })
  }, [debouncedQuery, dispatch, fetchResults, searchDatasets, searchFilters])

  const isWorkspaceError = workspaceStatus === AsyncReducerStatus.Error
  const isDatasetError = datasetsStatus === AsyncReducerStatus.Error

  if (isWorkspaceError || isDatasetError) {
    return isAuthError(datasetError) ? (
      <WorkspaceLoginError
        title={
          guestUser
            ? t('errors.searchLogin', 'Login to search vessels')
            : t(
                'errors.privateSearch',
                "Your account doesn't have permissions to search on these datasets"
              )
        }
        emailSubject={`Requesting access for searching vessels`}
      />
    ) : (
      <SearchNotAllowed />
    )
  }

  const showWorkspaceSpinner = workspaceStatus !== AsyncReducerStatus.Finished
  const showDatasetsSpinner = datasetsStatus !== AsyncReducerStatus.Finished

  if (showWorkspaceSpinner || showDatasetsSpinner) {
    return (
      <SearchPlaceholder>
        <Spinner />
      </SearchPlaceholder>
    )
  }

  const SearchComponent = activeSearchOption === 'basic' ? SearchBasic : SearchAdvanced

  return (
    <div className={styles.search}>
      <SearchComponent
        onSuggestionClick={onSuggestionClick}
        fetchMoreResults={fetchMoreResults}
        fetchResults={onConfirmSearch}
        debouncedQuery={debouncedQuery}
      />
      <div
        className={cx(styles.footer, styles[activeSearchOption], {
          [styles.hidden]:
            !searchResultsPagination ||
            searchResultsPagination.total === 0 ||
            (activeSearchOption === 'basic' && !basicSearchAllowed) ||
            (activeSearchOption === 'advanced' && !advancedSearchAllowed),
        })}
      >
        {searchResults && searchResults.length !== 0 && (
          <label className={styles.results}>
            {`${t('search.seeing', 'seeing')} `}
            <I18nNumber number={searchResults.length} />
            {` ${t('common.of', 'of')} `}
            <I18nNumber number={searchResultsPagination.total} />
            {` ${t('search.result_other', 'results')} ${
              vesselsSelected.length !== 0
                ? `(${vesselsSelected.length} ${t('selects.selected', 'selected')})`
                : ''
            }`}
          </label>
        )}
        {activeSearchOption === 'advanced' && <SearchDownload />}
        <SearchActions />
      </div>
    </div>
  )
}

export default Search
