import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { isAuthError } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { Spinner } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDatasetsError, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import I18nNumber from 'features/i18n/i18nNumber'
import SearchAdvanced from 'features/search/advanced/SearchAdvanced'
import SearchBasic from 'features/search/basic/SearchBasic'
import { selectSearchOption, selectSearchQuery } from 'features/search/search.config.selectors'
import {
  useFetchSearchResults,
  useSearchConnect,
  useSearchFiltersConnect,
  useSearchFiltersErrors,
} from 'features/search/search.hook'
import {
  isAdvancedSearchAllowed,
  isBasicSearchAllowed,
  selectAdvancedSearchDatasets,
  selectBasicSearchDatasets,
} from 'features/search/search.selectors'
import {
  cleanVesselSearchResults,
  selectSearchPagination,
  selectSearchResults,
  selectSelectedVessels,
  setSuggestionClicked,
} from 'features/search/search.slice'
import type { VesselSearchState } from 'features/search/search.types'
import SearchActions from 'features/search/SearchActions'
import SearchDownload from 'features/search/SearchDownload'
import SearchPlaceholder, { SearchNotAllowed } from 'features/search/SearchPlaceholders'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import WorkspaceLoginError from 'features/workspace/WorkspaceLoginError'
import { useLocationConnect } from 'routes/routes.hook'
import { selectWorkspaceId } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './Search.module.css'

function Search() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const searchQuery = useSelector(selectSearchQuery)
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const searchResults = useSelector(selectSearchResults)
  const { hasFilters, searchFilters } = useSearchFiltersConnect()
  const { searchSuggestion } = useSearchConnect()
  const debouncedQuery = useDebounce(searchQuery, 600)
  const { dispatchQueryParams } = useLocationConnect()
  const activeSearchOption = useSelector(selectSearchOption)
  const searchResultsPagination = useSelector(selectSearchPagination)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const searchDatasets = useSelector(
    activeSearchOption === 'basic' ? selectBasicSearchDatasets : selectAdvancedSearchDatasets
  ) as Dataset[]
  const [vesselsSelectedDownload, setVesselsSelectedDownload] = useState([])

  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const guestUser = useSelector(selectIsGuestUser)
  const datasetError = useSelector(selectDatasetsError)
  const searchFilterErrors = useSearchFiltersErrors()
  const hasSearchFiltersErrors = Object.values(searchFilterErrors).some((error) => error)
  const { fetchResults, fetchMoreResults } = useFetchSearchResults()

  useEffect(() => {
    dispatch(fetchWorkspaceThunk({ workspaceId: urlWorkspaceId }))
  }, [dispatch, urlWorkspaceId])

  useEffect(() => {
    if (
      searchDatasets?.length &&
      activeSearchOption === 'basic' &&
      debouncedQuery &&
      !hasSearchFiltersErrors
    ) {
      dispatch(cleanVesselSearchResults())
      fetchResults({
        query: debouncedQuery,
        datasets: searchDatasets,
        filters: {},
      })
    }
  }, [
    debouncedQuery,
    searchFilters,
    activeSearchOption,
    searchDatasets,
    fetchResults,
    hasFilters,
    dispatch,
    hasSearchFiltersErrors,
  ])

  useEffect(() => {
    if (
      activeSearchOption === 'advanced' &&
      (hasFilters || debouncedQuery) &&
      !hasSearchFiltersErrors
    ) {
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

  const onConfirmSearch = useCallback(
    (
      { query = debouncedQuery, filters = searchFilters } = {} as {
        query?: string
        filters?: VesselSearchState
      }
    ) => {
      if (!hasSearchFiltersErrors) {
        trackEvent({
          category: TrackCategory.SearchVessel,
          action: 'Add filters to refine Advanced Search',
          label: `name: ${query} | MMSI: ${filters.ssvid} | IMO: ${filters.imo} | Call Sign: ${filters.callsign} | Owner: ${filters.owner} | Info source: ${filters.infoSource} | Sources: ${filters.sources} | Flag: ${filters.flag} | Active After: ${filters.transmissionDateFrom} | Active Before: ${filters.transmissionDateTo}`,
        })
        dispatch(cleanVesselSearchResults())
        fetchResults({
          query,
          filters,
          datasets: searchDatasets,
        })
      }
    },
    [debouncedQuery, dispatch, fetchResults, hasSearchFiltersErrors, searchDatasets, searchFilters]
  )

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
