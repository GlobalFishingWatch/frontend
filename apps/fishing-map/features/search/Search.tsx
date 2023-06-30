import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { batch, useSelector } from 'react-redux'
import { useIntersectionObserver } from '@researchgate/react-intersection-observer'
import cx from 'classnames'
import Downshift from 'downshift'
import { Trans, useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { Dataset, DatasetTypes, Locale } from '@globalfishingwatch/api-types'
import {
  IconButton,
  InputText,
  Spinner,
  Button,
  Choice,
  Icon,
  ChoiceOption,
  TransmissionsTimeline,
} from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { getVesselDataviewInstance, VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { selectSearchQuery } from 'features/app/app.selectors'
import I18nDate from 'features/i18n/i18nDate'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.slice'
import I18nFlag from 'features/i18n/i18nFlag'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { isGFWUser } from 'features/user/user.slice'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import {
  setVesselGroupConfirmationMode,
  setVesselGroupCurrentDataviewIds,
} from 'features/vessel-groups/vessel-groups.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  fetchVesselSearchThunk,
  selectSearchResults,
  cleanVesselSearchResults,
  selectSearchStatus,
  selectSearchStatusCode,
  VesselWithDatasets,
  RESULTS_PER_PAGE,
  checkSearchFiltersEnabled,
  resetFilters,
  setSuggestionClicked,
  SearchType,
  SearchFilter,
} from './search.slice'
import styles from './Search.module.css'
import SearchFilters from './SearchFilters'
import { useSearchConnect, useSearchFiltersConnect } from './search.hook'
import SearchPlaceholder, {
  SearchNotAllowed,
  SearchNoResultsState,
  SearchEmptyState,
} from './SearchPlaceholders'
import {
  isBasicSearchAllowed,
  isAdvancedSearchAllowed,
  selectBasicSearchDatasets,
  selectAdvancedSearchDatasets,
} from './search.selectors'

const MIN_SEARCH_CHARACTERS = 3

function Search() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const urlQuery = useSelector(selectSearchQuery)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const [searchQuery, setSearchQuery] = useState((urlQuery || '') as string)
  const { searchFilters } = useSearchFiltersConnect()
  const { searchPagination, searchSuggestion, searchSuggestionClicked } = useSearchConnect()
  const debouncedQuery = useDebounce(searchQuery, 600)
  const { dispatchQueryParams } = useLocationConnect()
  const heatmapDataviews = useSelector(selectActiveHeatmapDataviews)
  const basicSearchAllowed = useSelector(isBasicSearchAllowed)
  const advancedSearchAllowed = useSelector(isAdvancedSearchAllowed)
  const searchResults = useSelector(selectSearchResults)
  const searchStatus = useSelector(selectSearchStatus)
  const searchStatusCode = useSelector(selectSearchStatusCode)
  const gfwUser = useSelector(isGFWUser)
  const hasSearchFilters = checkSearchFiltersEnabled(searchFilters)
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const [vesselsSelected, setVesselsSelected] = useState<VesselWithDatasets[]>([])

  const searchOptions = useMemo(() => {
    return [
      {
        id: 'basic' as SearchType,
        label: t('search.basic', 'Basic'),
      },
      {
        id: 'advanced' as SearchType,
        label: t('search.advanced', 'Advanced'),
      },
    ] as ChoiceOption<SearchType>[]
  }, [t])

  const [activeSearchOption, setActiveSearchOption] = useState<SearchType>(
    hasSearchFilters ? searchOptions[1].id : searchOptions[0].id
  )

  const searchDatasets = useSelector(
    activeSearchOption === 'basic' ? selectBasicSearchDatasets : selectAdvancedSearchDatasets
  )

  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const promiseRef = useRef<any>()
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchResults = useCallback(
    debounce(
      ({
        query,
        datasets,
        filters,
        offset = 0,
      }: {
        query: string
        datasets: Dataset[]
        filters: SearchFilter
        offset?: number
      }) => {
        if (datasets?.length && query?.length > MIN_SEARCH_CHARACTERS - 1) {
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
              offset,
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

  const handleIntersection = useCallback(
    (entry: IntersectionObserverEntry) => {
      const { offset, total } = searchPagination
      if (entry.isIntersecting) {
        if (offset <= total && total > RESULTS_PER_PAGE && searchDatasets) {
          fetchResults({
            query: debouncedQuery,
            datasets: searchDatasets,
            filters: searchFilters,
            offset,
          })
        }
      }
    },
    [searchPagination, searchDatasets, searchFilters, debouncedQuery, fetchResults]
  )
  const [ref] = useIntersectionObserver(handleIntersection, { rootMargin: '100px' })

  useEffect(() => {
    if (debouncedQuery && !promiseRef.current && searchDatasets?.length) {
      fetchResults({
        query: debouncedQuery,
        datasets: searchDatasets,
        filters: searchFilters,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDatasets])

  useEffect(() => {
    if (debouncedQuery && searchDatasets?.length) {
      fetchResults({
        query: debouncedQuery,
        datasets: searchDatasets,
        filters: activeSearchOption === 'basic' ? {} : searchFilters,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, searchFilters, activeSearchOption])

  useEffect(() => {
    if (debouncedQuery === '') {
      dispatch(cleanVesselSearchResults())
    }
    dispatchQueryParams({ query: debouncedQuery })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  const onCloseClick = () => {
    batch(() => {
      dispatch(resetFilters())
      dispatch(cleanVesselSearchResults())
      dispatchQueryParams({ query: undefined })
    })
  }

  const onSuggestionClick = () => {
    if (searchSuggestion) {
      dispatch(setSuggestionClicked(true))
      setSearchQuery(searchSuggestion)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setVesselsSelected([])
    if (e.target.value !== searchQuery && searchSuggestionClicked) {
      dispatch(setSuggestionClicked(false))
    }
  }

  const onSelect = (selection: VesselWithDatasets | null) => {
    if (!selection) return
    if (vesselsSelected.includes(selection)) {
      setVesselsSelected(vesselsSelected.filter((vessel) => vessel !== selection))
      return
    }
    if (selection && (selection.dataset || selection.trackDatasetId)) {
      setVesselsSelected([...vesselsSelected, selection])
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
        info: vessel.dataset.id,
        track: vessel.trackDatasetId as string,
        ...(eventsDatasetsId.length > 0 && { events: eventsDatasetsId }),
      })
      return vesselDataviewInstance
    })
    addNewDataviewInstances(instances)
    onCloseClick()
  }

  const hasMoreResults =
    searchPagination.total !== 0 &&
    searchPagination.total > RESULTS_PER_PAGE &&
    searchPagination.offset &&
    searchPagination.offset <= searchPagination.total

  const onSearchOptionChange = (option: ChoiceOption, e: React.MouseEvent<Element, MouseEvent>) => {
    if (option.id === activeSearchOption && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      trackEvent({
        category: TrackCategory.SearchVessel,
        action: 'Toggle search type to filter results',
        label: option.id,
      })
      setActiveSearchOption(option.id as SearchType)
    }
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

  if (workspaceStatus !== AsyncReducerStatus.Finished) {
    return (
      <SearchPlaceholder>
        <Spinner />
      </SearchPlaceholder>
    )
  }

  return (
    <Downshift onSelect={onSelect} itemToString={(item) => (item ? item.shipname : '')}>
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex, selectedItem }) => (
        <div className={styles.search}>
          <div className={styles.header}>
            <label className={styles.title}>{t('search.title', 'Search')}</label>
            <Choice
              options={searchOptions}
              activeOption={activeSearchOption}
              onSelect={onSearchOptionChange}
              size="small"
            />
            <IconButton
              icon="close"
              onClick={onCloseClick}
              type="border"
              tooltip={t('search.close', 'Close search')}
              tooltipPlacement="bottom"
            />
          </div>
          {activeSearchOption === 'advanced' && !advancedSearchAllowed ? (
            <SearchPlaceholder>
              <Trans i18nKey="search.advancedDisabled">
                You need to
                <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink>
                to use advanced search
              </Trans>
            </SearchPlaceholder>
          ) : (
            <div ref={scrollRef} className={styles.scrollContainer}>
              <div className={styles.form}>
                <InputText
                  {...getInputProps()}
                  onChange={onInputChange}
                  value={searchQuery}
                  label={t('search.mainQueryLabel', 'Name, IMO or MMSI')}
                  autoFocus
                  disabled={!basicSearchAllowed}
                  className={styles.input}
                  type="search"
                  loading={
                    searchStatus === AsyncReducerStatus.Loading ||
                    searchStatus === AsyncReducerStatus.Aborted
                  }
                  placeholder={t('search.placeholder', 'Type to search vessels')}
                />
                {activeSearchOption === 'advanced' && searchDatasets && (
                  <SearchFilters className={styles.filters} datasets={searchDatasets} />
                )}
              </div>
              {(searchStatus === AsyncReducerStatus.Loading ||
                searchStatus === AsyncReducerStatus.Aborted) &&
              searchPagination.loading === false ? null : basicSearchAllowed ? (
                <ul {...getMenuProps()} className={styles.searchResults}>
                  {debouncedQuery && debouncedQuery?.length < MIN_SEARCH_CHARACTERS && (
                    <li key="min-characters" className={cx(styles.searchSuggestion, styles.red)}>
                      {t('search.minCharacters', {
                        defaultValue: 'Please type at least {{count}} characters',
                        count: MIN_SEARCH_CHARACTERS,
                      })}
                    </li>
                  )}
                  {searchQuery &&
                    searchSuggestion &&
                    searchSuggestion !== searchQuery &&
                    !searchSuggestionClicked && (
                      <li key="suggestion" className={cx(styles.searchSuggestion)}>
                        {t('search.suggestion', 'Did you mean')}{' '}
                        <button onClick={onSuggestionClick} className={styles.suggestion}>
                          {' '}
                          {searchSuggestion}{' '}
                        </button>{' '}
                        ?
                      </li>
                    )}
                  {searchResults?.map((entry, index: number) => {
                    const {
                      id,
                      shipname,
                      flag,
                      fleet,
                      mmsi,
                      imo,
                      callsign,
                      geartype,
                      origin,
                      casco,
                      nationalId,
                      matricula,
                      dataset,
                      firstTransmissionDate,
                      lastTransmissionDate,
                    } = entry
                    const isInWorkspace = vesselDataviews?.some(
                      (vessel) => vessel.id === `${VESSEL_LAYER_PREFIX}${id}`
                    )
                    const isSelected = vesselsSelected?.some((vessel) => vessel.id === id)
                    return (
                      <li
                        {...getItemProps({ item: entry, index })}
                        className={cx(styles.searchResult, {
                          [styles.highlighted]: highlightedIndex === index,
                          [styles.inWorkspace]: isInWorkspace,
                          [styles.selected]: isSelected,
                        })}
                        key={`${id}-${index}`}
                      >
                        <div className={styles.name}>
                          {formatInfoField(shipname, 'name') || EMPTY_FIELD_PLACEHOLDER}
                        </div>
                        <div className={styles.properties}>
                          <div className={styles.property}>
                            <label>{t('vessel.flag', 'Flag')}</label>
                            <span>
                              <I18nFlag iso={flag} />
                            </span>
                          </div>
                          <div className={styles.property}>
                            <label>{t('vessel.mmsi', 'MMSI')}</label>
                            <span>{mmsi || EMPTY_FIELD_PLACEHOLDER}</span>
                          </div>
                          <div className={styles.property}>
                            <label>{t('vessel.imo', 'IMO')}</label>
                            <span>{imo || EMPTY_FIELD_PLACEHOLDER}</span>
                          </div>
                          <div className={styles.property}>
                            <label>{t('vessel.callsign', 'Callsign')}</label>
                            <span>{callsign || EMPTY_FIELD_PLACEHOLDER}</span>
                          </div>
                          <div className={styles.property}>
                            <label>{t('vessel.geartype', 'Gear Type')}</label>
                            <span>
                              {geartype !== undefined
                                ? t(`vessel.gearTypes.${geartype}` as any, EMPTY_FIELD_PLACEHOLDER)
                                : EMPTY_FIELD_PLACEHOLDER}
                            </span>
                          </div>
                          {matricula && (
                            <div className={styles.property}>
                              <label>{t('vessel.matricula', 'Matricula')}</label>
                              <span>{matricula}</span>
                            </div>
                          )}
                          {nationalId && (
                            <div className={styles.property}>
                              <label>{t('vessel.nationalId', 'National Id')}</label>
                              <span>{nationalId}</span>
                            </div>
                          )}
                          {casco && (
                            <div className={styles.property}>
                              <label>{t('vessel.casco', 'Casco')}</label>
                              <span>{casco}</span>
                            </div>
                          )}
                          {fleet && (
                            <div className={styles.property}>
                              <label>{t('vessel.fleet', 'Fleet')}</label>
                              <span>{formatInfoField(fleet, 'fleet')}</span>
                            </div>
                          )}
                          {origin && (
                            <div className={styles.property}>
                              <label>{t('vessel.origin', 'Origin')}</label>
                              <span>{formatInfoField(origin, 'fleet')}</span>
                            </div>
                          )}
                          {firstTransmissionDate && lastTransmissionDate && (
                            <div className={cx(styles.property, styles.fullWidth)}>
                              <label>{t('vessel.transmission_other', 'Transmissions')}</label>
                              <span>
                                from <I18nDate date={firstTransmissionDate} /> to{' '}
                                <I18nDate date={lastTransmissionDate} />
                              </span>
                              <TransmissionsTimeline
                                firstTransmissionDate={firstTransmissionDate}
                                lastTransmissionDate={lastTransmissionDate}
                                firstYearOfData={FIRST_YEAR_OF_DATA}
                                locale={i18n.language as Locale}
                              />
                            </div>
                          )}
                          {dataset && (
                            <div className={styles.property}>
                              <label>{t('vessel.source', 'Source')}</label>
                              <DatasetLabel dataset={dataset} />
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <span className={styles.alreadyAddedMsg}>
                            <Icon icon="tick" />
                            {t('search.vesselSelected', 'Vessel selected')}
                          </span>
                        )}
                        {isInWorkspace && (
                          <span className={styles.alreadyAddedMsg}>
                            <Icon icon="tick" />
                            {t(
                              'search.vesselAlreadyInWorkspace',
                              'This vessel is already in your workspace'
                            )}
                          </span>
                        )}
                      </li>
                    )
                  })}
                  {hasMoreResults && (
                    <li key="spinner" className={styles.spinner} ref={ref}>
                      <Spinner inline size="small" />
                    </li>
                  )}

                  {searchStatus === AsyncReducerStatus.Idle && <SearchEmptyState />}
                  {searchStatus === AsyncReducerStatus.Finished && !hasMoreResults && (
                    <SearchNoResultsState />
                  )}
                  {searchStatus === AsyncReducerStatus.Error && (
                    <p className={styles.error}>
                      {searchStatusCode === 404
                        ? t(
                            'search.noResults',
                            "Can't find the vessel you are looking for? Try using MMSI, IMO or Callsign"
                          )
                        : t('errors.genericShort', 'Something went wrong')}
                    </p>
                  )}
                </ul>
              ) : (
                <SearchNotAllowed />
              )}
            </div>
          )}
          <div className={cx(styles.footer, { [styles.hidden]: vesselsSelected.length === 0 })}>
            <VesselGroupAddButton
              vessels={vesselsSelected}
              onAddToVesselGroup={onAddToVesselGroup}
            />
            <Button className={styles.footerAction} onClick={onConfirmSelection}>
              {vesselsSelected.length > 1
                ? t('search.seeVessels', {
                    defaultValue: 'See vessels',
                    count: vesselsSelected.length,
                  })
                : t('search.seeVessel', 'See vessel')}
            </Button>
          </div>
        </div>
      )}
    </Downshift>
  )
}

export default Search
