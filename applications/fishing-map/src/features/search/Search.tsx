import React, { useState, useEffect, useRef, useCallback } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useIntersectionObserver } from '@researchgate/react-intersection-observer'
import cx from 'classnames'
import Downshift from 'downshift'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectVesselsDatasets } from 'features/workspace/workspace.selectors'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectSearchQuery } from 'features/app/app.selectors'
import I18nDate from 'features/i18n/i18nDate'
import { resetWorkspaceSearchQuery } from 'features/workspace/workspace.slice'
import { AsyncReducerStatus } from 'types'
import { getFlagById } from 'utils/flags'
import { formatInfoField } from 'utils/info'
import {
  fetchVesselSearchThunk,
  selectSearchResults,
  cleanVesselSearchResults,
  selectSearchStatus,
  VesselWithDatasets,
  setFilters,
  selectSearchPagination,
  RESULTS_PER_PAGE,
} from './search.slice'
import styles from './Search.module.css'
import SearchNoResultsState from './SearchNoResultsState'
import SearchEmptyState from './SearchEmptyState'
import SearchFilters from './SearchFilters'
import { useSearchFiltersConnect } from './search.hook'

function Search() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const urlQuery = useSelector(selectSearchQuery)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [searchQuery, setSearchQuery] = useState((urlQuery || '') as string)
  const { searchFilters, searchFiltersOpen, setSearchFiltersOpen } = useSearchFiltersConnect()
  const searchPagination = useSelector(selectSearchPagination)
  const debouncedQuery = useDebounce(searchQuery, 200)
  const { dispatchQueryParams } = useLocationConnect()
  const searchDatasets = useSelector(selectVesselsDatasets)
  const searchResults = useSelector(selectSearchResults)
  const searchStatus = useSelector(selectSearchStatus)

  const fetchResults = useCallback(
    (offset = 0) => {
      if (searchStatus !== AsyncReducerStatus.Loading) {
        // Don't use this until bug with shipname responses in API is fixed
        // const fieldsToSearchIn = ['shipname', 'mmsi', 'imo']
        // const fieldsQuery = fieldsToSearchIn
        //   .map((field) => `${field}='${debouncedQuery}'`)
        //   .join(' OR ')
        const flags = searchFilters?.flags
          ? `flag IN (${searchFilters.flags.map((f) => `'${f.id}'`).join(', ')})`
          : ''
        const gearTypes = searchFilters?.gearTypes
          ? `gearType IN (${searchFilters.gearTypes.map((f) => `'${f.id}'`).join(', ')})`
          : ''
        const firstTransmissionDate = searchFilters?.firstTransmissionDate
          ? `firstTransmissionDate > ${searchFilters.firstTransmissionDate}`
          : ''
        const lastTransmissionDate = searchFilters?.lastTransmissionDate
          ? `lastTransmissionDate < ${searchFilters.lastTransmissionDate}`
          : ''
        const query = [
          debouncedQuery,
          flags,
          gearTypes,
          firstTransmissionDate,
          lastTransmissionDate,
        ]
          .filter((q) => !!q)
          .join(' AND ')

        batch(() => {
          dispatchQueryParams({ query: debouncedQuery })
          dispatch(fetchVesselSearchThunk({ query, datasets: searchDatasets, offset }))
        })
      }
    },
    [debouncedQuery, dispatch, dispatchQueryParams, searchDatasets, searchFilters]
  )

  const handleChange = useCallback(
    (entry: IntersectionObserverEntry) => {
      const { offset, total } = searchPagination
      if (entry.isIntersecting) {
        if (offset <= total) {
          console.log(entry)
          fetchResults(offset + RESULTS_PER_PAGE)
        }
      }
    },
    [fetchResults, searchPagination]
  )
  const [ref] = useIntersectionObserver(handleChange, { rootMargin: '100px' })

  const hasSearchFilters = Object.values(searchFilters).length > 0

  useEffect(() => {
    if (debouncedQuery !== '') {
      fetchResults()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, searchFilters])

  const onCloseClick = () => {
    batch(() => {
      dispatchQueryParams({ query: undefined })
      dispatch(cleanVesselSearchResults())
      dispatch(setFilters({}))
      dispatch(resetWorkspaceSearchQuery())
    })
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const onSelectionChange = (selection: VesselWithDatasets | null) => {
    if (selection && selection.dataset && selection.trackDatasetId) {
      const vesselDataviewInstance = getVesselDataviewInstance(selection, {
        trackDatasetId: selection.trackDatasetId as string,
        infoDatasetId: selection.dataset.id,
      })
      batch(() => {
        upsertDataviewInstance(vesselDataviewInstance)
        onCloseClick()
      })
    }
  }

  return (
    <Downshift onChange={onSelectionChange} itemToString={(item) => (item ? item.shipname : '')}>
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex, selectedItem }) => (
        <div className={cx(styles.search, { [styles.expandedContainerOpen]: searchFiltersOpen })}>
          <div className={styles.inputContainer}>
            <InputText
              {...getInputProps()}
              onChange={onInputChange}
              value={searchQuery}
              autoFocus
              className={styles.input}
              placeholder={t('vessel.search.placeholder', 'Type to search vessels')}
            />
            {searchStatus === 'loading' && <Spinner size="small" />}
            <IconButton
              icon={searchFiltersOpen ? 'close' : hasSearchFilters ? 'filter-on' : 'filter-off'}
              tooltip={
                searchFiltersOpen
                  ? t('vessel.search.filter_close', 'Close search filters')
                  : t('vessel.search.filter_open', 'Open search filters')
              }
              className={cx(styles.expandable, {
                [styles.expanded]: searchFiltersOpen,
              })}
              onClick={() => setSearchFiltersOpen(!searchFiltersOpen)}
              tooltipPlacement="bottom"
            />
            {searchFiltersOpen === false && (
              <IconButton
                icon="close"
                onClick={onCloseClick}
                type="border"
                tooltip={t('vessel.search.close', 'Close search')}
                tooltipPlacement="bottom"
              />
            )}
          </div>
          <SearchFilters className={cx(styles.expandedContainer)} />
          {!searchResults?.length &&
            (searchStatus === AsyncReducerStatus.Finished ? (
              <SearchNoResultsState />
            ) : (
              <SearchEmptyState />
            ))}
          {searchResults && searchResults.length > 0 && (
            <ul id="scroll-root" {...getMenuProps()} className={styles.searchResults}>
              {searchResults?.map((entry, index: number) => {
                const {
                  id,
                  shipname,
                  flag,
                  fleet,
                  mmsi,
                  imo,
                  callsign,
                  dataset,
                  firstTransmissionDate,
                  lastTransmissionDate,
                } = entry
                const flagLabel = getFlagById(flag)?.label
                return (
                  <li
                    {...getItemProps({ item: entry, index })}
                    className={cx(styles.searchResult, {
                      [styles.highlighted]: highlightedIndex === index,
                    })}
                    key={id}
                  >
                    <div className={styles.name}>{shipname || '---'}</div>
                    <div className={styles.properties}>
                      {flagLabel && (
                        <div className={styles.property}>
                          <label>{t('vessel.flag', 'Flag')}</label>
                          <span>{flagLabel}</span>
                        </div>
                      )}
                      {mmsi && (
                        <div className={styles.property}>
                          <label>{t('vessel.mmsi', 'MMSI')}</label>
                          <span>{mmsi}</span>
                        </div>
                      )}
                      {imo && (
                        <div className={styles.property}>
                          <label>{t('vessel.imo', 'IMO')}</label>
                          <span>{imo}</span>
                        </div>
                      )}
                      {callsign && (
                        <div className={styles.property}>
                          <label>{t('vessel.callsign', 'Callsign')}</label>
                          <span>{callsign}</span>
                        </div>
                      )}
                      {fleet && (
                        <div className={styles.property}>
                          <label>{t('vessel.fleet', 'Fleet')}</label>
                          <span>{formatInfoField(fleet, 'fleet')}</span>
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
                  </li>
                )
              })}
              {searchPagination.total !== 0 && searchPagination.offset <= searchPagination.total && (
                <li className={styles.spinner} ref={ref}>
                  <Spinner inline size="small" />
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </Downshift>
  )
}

export default Search
