import { useEffect, useCallback, useRef } from 'react'
import { batch, useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { CSVLink } from 'react-csv'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { Spinner, Button, IconButton } from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { isAuthError } from '@globalfishingwatch/api-client'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { selectSearchOption, selectSearchQuery } from 'features/app/app.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { isGFWUser, isGuestUser } from 'features/user/user.slice'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import {
  setVesselGroupConfirmationMode,
  setVesselGroupCurrentDataviewIds,
} from 'features/vessel-groups/vessel-groups.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import SearchBasic from 'features/search/SearchBasic'
import SearchAdvanced from 'features/search/SearchAdvanced'
import SearchPlaceholder, { SearchNotAllowed } from 'features/search/SearchPlaceholders'
import { WORKSPACE } from 'routes/routes'
import I18nNumber from 'features/i18n/i18nNumber'
import {
  selectIsStandaloneSearchLocation,
  selectIsWorkspaceSearchLocation,
  selectWorkspaceId,
} from 'routes/routes.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import {
  fetchDatasetsByIdsThunk,
  selectDatasetsError,
  selectDatasetsStatus,
} from 'features/datasets/datasets.slice'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { TEMPLATE_VESSEL_DATAVIEW_SLUG } from 'data/workspaces'
import { WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import {
  fetchVesselSearchThunk,
  cleanVesselSearchResults,
  RESULTS_PER_PAGE,
  setSuggestionClicked,
  SearchFilter,
  selectSearchPagination,
  selectSearchResults,
  selectSelectedVessels,
  EMPTY_FILTERS,
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
const FIRST_FETCH_FILTERS_TO_IGNORE = ['lastTransmissionDate', 'firstTransmissionDate']

function Search() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const searchQuery = useSelector(selectSearchQuery)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const searchResults = useSelector(selectSearchResults)
  const { searchFilters } = useSearchFiltersConnect()
  const { searchPagination, searchSuggestion } = useSearchConnect()
  const debouncedQuery = useDebounce(searchQuery, 600)
  const { dispatchQueryParams, dispatchLocation } = useLocationConnect()
  const heatmapDataviews = useSelector(selectActiveHeatmapDataviews)
  const gfwUser = useSelector(isGFWUser)
  const activeSearchOption = useSelector(selectSearchOption)
  const searchResultsPagination = useSelector(selectSearchPagination)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const isSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const isWorkspaceSearchLocation = useSelector(selectIsWorkspaceSearchLocation)
  const hasFilters =
    Object.entries(searchFilters).filter(([key]) => {
      return !FIRST_FETCH_FILTERS_TO_IGNORE.includes(key) && searchFilters[key] !== undefined
    }).length > 0
  const searchDatasets = useSelector(
    activeSearchOption === 'basic' ? selectBasicSearchDatasets : selectAdvancedSearchDatasets
  ) as Dataset[]

  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const guestUser = useSelector(isGuestUser)
  const datasetError = useSelector(selectDatasetsError)
  const promiseRef = useRef<any>()

  useEffect(() => {
    if (isWorkspaceSearchLocation) {
      dispatch(fetchWorkspaceThunk(urlWorkspaceId))
    } else {
      dispatch(fetchDataviewsByIdsThunk([TEMPLATE_VESSEL_DATAVIEW_SLUG]))
      dispatch(fetchDatasetsByIdsThunk([DEFAULT_VESSEL_IDENTITY_ID]))
    }
  }, [dispatch, isWorkspaceSearchLocation, urlWorkspaceId])

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
        filters: SearchFilter
        since?: string
      }) => {
        if (
          datasets?.length &&
          (activeSearchOption === 'advanced' || query?.length > MIN_SEARCH_CHARACTERS - 1)
        ) {
          const sourceIds = filters?.sources?.map((source) => source.id)
          const sources = sourceIds ? datasets.filter(({ id }) => sourceIds.includes(id)) : datasets
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
    [dispatch]
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

  const onSuggestionClick = () => {
    if (searchSuggestion) {
      dispatch(setSuggestionClicked(true))
      dispatchQueryParams({ query: searchSuggestion })
    }
  }

  const onConfirmSelection = () => {
    const instances = vesselsSelected.map((vessel) => {
      const eventsRelatedDatasets = getRelatedDatasetsByType(vessel.dataset, DatasetTypes.Events)

      const eventsDatasetsId =
        eventsRelatedDatasets && eventsRelatedDatasets?.length
          ? eventsRelatedDatasets.map((d) => d.id)
          : []
      const vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        track: vessel.trackDatasetId as string,
        info: vessel.dataset.id,
        ...(eventsDatasetsId.length > 0 && { eventsDatasetsId }),
      })
      return vesselDataviewInstance
    })
    addNewDataviewInstances(instances)
    batch(() => {
      dispatch(cleanVesselSearchResults())
      dispatchQueryParams(EMPTY_FILTERS)
    })
    dispatchLocation(WORKSPACE)
  }

  const onAddToVesselGroup = () => {
    const dataviewIds = heatmapDataviews.map(({ id }) => id)
    batch(() => {
      dispatch(setVesselGroupConfirmationMode('saveAndNavigate'))
      if (dataviewIds?.length) {
        dispatch(setVesselGroupCurrentDataviewIds(dataviewIds))
      }
    })
  }

  const onConfirmSearch = useCallback(() => {
    fetchResults({
      query: debouncedQuery,
      datasets: searchDatasets,
      filters: searchFilters,
    })
  }, [debouncedQuery, fetchResults, searchDatasets, searchFilters])

  const isDatasetError = datasetsStatus === AsyncReducerStatus.Error

  if (isDatasetError) {
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

  const showWorkspaceSpinner =
    isWorkspaceSearchLocation && workspaceStatus !== AsyncReducerStatus.Finished
  const showDatasetsSpinner = isSearchLocation && datasetsStatus !== AsyncReducerStatus.Finished

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
        onConfirm={onConfirmSearch}
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
        {activeSearchOption === 'advanced' && searchResults && (
          <CSVLink
            filename={`search-results-${debouncedQuery}.csv`}
            asyncOnClick={true}
            data={vesselsSelected.length ? vesselsSelected : searchResults}
          >
            <IconButton
              icon="download"
              type="border"
              size="medium"
              tooltip={
                vesselsSelected.length
                  ? `${t('search.downloadSelected', 'Download CSV of selected vessels')} (${
                      vesselsSelected.length
                    })`
                  : `${t('search.downloadTable', 'Download CSV of vessels on table')} (${
                      searchResults.length
                    })`
              }
              tooltipPlacement="top"
            />
          </CSVLink>
        )}
        <VesselGroupAddButton
          vessels={vesselsSelected}
          onAddToVesselGroup={onAddToVesselGroup}
          showCount={false}
          buttonClassName={cx(styles.footerAction, styles.vesselGroupButton)}
        />
        <Button
          className={styles.footerAction}
          onClick={onConfirmSelection}
          disabled={vesselsSelected.length === 0}
          testId="search-vessels-add-vessel"
        >
          {vesselsSelected.length > 1
            ? t('search.seeVessels', {
                defaultValue: 'See vessels',
                count: vesselsSelected.length,
              })
            : t('search.seeVessel', 'See vessel')}
        </Button>
      </div>
    </div>
  )
}

export default Search
