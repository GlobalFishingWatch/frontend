import React, { useState, useEffect, useCallback, useRef, Fragment } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useIntersectionObserver } from '@researchgate/react-intersection-observer'
import cx from 'classnames'
import Downshift from 'downshift'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import { Button, Choice, Icon } from '@globalfishingwatch/ui-components'
import { ChoiceOption } from '@globalfishingwatch/ui-components/dist/choice'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { getVesselDataviewInstance, VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectSearchQuery } from 'features/app/app.selectors'
import I18nDate from 'features/i18n/i18nDate'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getFlagById } from 'utils/flags'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.selectors'
import {
  fetchVesselSearchThunk,
  selectSearchResults,
  cleanVesselSearchResults,
  selectSearchStatus,
  VesselWithDatasets,
  RESULTS_PER_PAGE,
  checkSearchFiltersEnabled,
  resetFilters,
  setSuggestionClicked,
} from './search.slice'
import styles from './Search.module.css'
import SearchFilters from './SearchFilters'
import { useSearchConnect, useSearchFiltersConnect } from './search.hook'
import SearchPlaceholder, {
  SearchNotAllowed,
  SearchNoResultsState,
  SearchEmptyState,
} from './SearchPlaceholders'
import { isSearchAllowed, selectAllowedVesselsDatasets } from './search.selectors'

function Search() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const urlQuery = useSelector(selectSearchQuery)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const [searchQuery, setSearchQuery] = useState((urlQuery || '') as string)
  const { searchFilters } = useSearchFiltersConnect()
  const { searchPagination, searchSuggestion, searchSuggestionClicked } = useSearchConnect()
  const debouncedQuery = useDebounce(searchQuery, 600)
  const { dispatchQueryParams } = useLocationConnect()
  const searchDatasets = useSelector(selectAllowedVesselsDatasets)
  const searchAllowed = useSelector(isSearchAllowed)
  const searchResults = useSelector(selectSearchResults)
  const searchStatus = useSelector(selectSearchStatus)
  const hasSearchFilters = checkSearchFiltersEnabled(searchFilters)
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const [vesselsSelected, setVesselsSelected] = useState<VesselWithDatasets[]>([])

  const searchOptions = [
    {
      id: 'basic',
      title: t('search.basic', 'Basic'),
    },
    {
      id: 'advanced',
      title: t('search.advanced', 'Advanced'),
    },
  ]

  const [activeSearchOption, setActiveSearchOption] = useState<string>(
    hasSearchFilters ? searchOptions[1].id : searchOptions[0].id
  )

  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const promiseRef = useRef<any>()
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const fetchResults = useCallback(
    (offset = 0) => {
      if (searchDatasets?.length) {
        const sourceIds = searchFilters?.sources?.map((source) => source.id)
        const sources = sourceIds
          ? searchDatasets.filter(({ id }) => sourceIds.includes(id))
          : searchDatasets

        if (promiseRef.current) {
          promiseRef.current.abort()
        }
        // To ensure the pending action isn't overwritted by the abort above
        // and we miss the loading intermediate state
        setTimeout(() => {
          promiseRef.current = dispatch(
            fetchVesselSearchThunk({
              query: debouncedQuery,
              filters: searchFilters,
              datasets: sources,
              offset,
            })
          )
        }, 1)
      }
    },
    [debouncedQuery, dispatch, searchDatasets, searchFilters]
  )

  const handleIntersection = useCallback(
    (entry: IntersectionObserverEntry) => {
      const { offset, total } = searchPagination
      if (entry.isIntersecting) {
        if (offset <= total && total > RESULTS_PER_PAGE) {
          fetchResults(offset + RESULTS_PER_PAGE)
        }
      }
    },
    [fetchResults, searchPagination]
  )
  const [ref] = useIntersectionObserver(handleIntersection, { rootMargin: '100px' })

  useEffect(() => {
    if (debouncedQuery === '') {
      batch(() => {
        dispatch(cleanVesselSearchResults())
      })
    } else {
      fetchResults()
    }
    dispatchQueryParams({ query: debouncedQuery })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, searchFilters, searchDatasets, activeSearchOption])

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
    if (selection && selection.dataset && selection.trackDatasetId) {
      setVesselsSelected([...vesselsSelected, selection])
    }
  }

  const onConfirmSelection = () => {
    const instances = vesselsSelected.map((vessel) => {
      const vesselDataviewInstance = getVesselDataviewInstance(vessel, {
        trackDatasetId: vessel.trackDatasetId as string,
        infoDatasetId: vessel.dataset.id,
      })
      console.log(vesselDataviewInstance)
      return vesselDataviewInstance
    })
    addNewDataviewInstances(instances)
    onCloseClick()
  }

  const hasMoreResults =
    searchPagination.total !== 0 &&
    searchPagination.total > RESULTS_PER_PAGE &&
    searchPagination.offset <= searchPagination.total

  const onSearchOptionChange = (option: ChoiceOption, e: React.MouseEvent<Element, MouseEvent>) => {
    if (option.id === activeSearchOption && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setActiveSearchOption(option.id)
    }
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
              onOptionClick={onSearchOptionChange}
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
          <div ref={scrollRef} className={styles.scrollContainer}>
            <div className={styles.form}>
              <InputText
                {...getInputProps()}
                onChange={onInputChange}
                value={searchQuery}
                label={t('search.mainQueryLabel', 'Name, IMO or MMSI')}
                autoFocus
                disabled={!searchAllowed}
                className={styles.input}
                type="search"
                loading={
                  searchStatus === AsyncReducerStatus.Loading ||
                  searchStatus === AsyncReducerStatus.Aborted
                }
                placeholder={t('search.placeholder', 'Type to search vessels')}
              />
              {activeSearchOption === 'advanced' && <SearchFilters className={styles.filters} />}
            </div>
            {(searchStatus === AsyncReducerStatus.Loading ||
              searchStatus === AsyncReducerStatus.Aborted) &&
            searchPagination.loading === false ? null : searchAllowed ? (
              <Fragment>
                <ul {...getMenuProps()} className={styles.searchResults}>
                  {searchQuery &&
                    searchSuggestion &&
                    searchSuggestion !== searchQuery &&
                    !searchSuggestionClicked && (
                      <li className={cx(styles.searchSuggestion)}>
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
                      dataset,
                      firstTransmissionDate,
                      lastTransmissionDate,
                    } = entry
                    const flagLabel = getFlagById(flag)?.label
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
                        key={id}
                      >
                        <Fragment>
                          <div className={styles.name}>{shipname || EMPTY_FIELD_PLACEHOLDER}</div>
                          <div className={styles.properties}>
                            <div className={styles.property}>
                              <label>{t('vessel.flag', 'Flag')}</label>
                              <span>{flagLabel || EMPTY_FIELD_PLACEHOLDER}</span>
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
                                  ? t(
                                      `vessel.gearTypes.${geartype}` as any,
                                      EMPTY_FIELD_PLACEHOLDER
                                    )
                                  : EMPTY_FIELD_PLACEHOLDER}
                              </span>
                            </div>
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
                              <div className={styles.property}>
                                <label>{t('vessel.transmission_plural', 'Transmissions')}</label>
                                <span>
                                  from <I18nDate date={firstTransmissionDate} /> to{' '}
                                  <I18nDate date={lastTransmissionDate} />
                                </span>
                              </div>
                            )}
                            {dataset?.name && (
                              <div className={styles.property}>
                                <label>{t('vessel.source', 'Source')}</label>
                                <span>{dataset.name}</span>
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
                        </Fragment>
                      </li>
                    )
                  })}
                  {hasMoreResults && (
                    <li className={styles.spinner} ref={ref}>
                      <Spinner inline size="small" />
                    </li>
                  )}

                  {searchStatus === AsyncReducerStatus.Idle && <SearchEmptyState />}
                  {searchStatus === AsyncReducerStatus.Finished && !hasMoreResults && (
                    <SearchNoResultsState />
                  )}
                  {searchStatus === AsyncReducerStatus.Error && (
                    <p className={styles.error}>Something went wrong 🙈</p>
                  )}
                </ul>
              </Fragment>
            ) : (
              <SearchNotAllowed />
            )}
          </div>
          <div className={cx(styles.footer, { [styles.hidden]: vesselsSelected.length === 0 })}>
            <Button
              disabled
              type="secondary"
              tooltip={t('common.comingSoon', 'Coming Soon')}
              className={styles.footerAction}
            >
              See as fleet
            </Button>
            <Button className={styles.footerAction} onClick={onConfirmSelection}>
              {t('search.seeVessels', 'See vessels')}
            </Button>
          </div>
        </div>
      )}
    </Downshift>
  )
}

export default Search
