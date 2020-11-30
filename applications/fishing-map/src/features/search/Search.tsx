import React, { useState, useEffect } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
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
} from './search.slice'
import styles from './Search.module.css'
import SearchEmptyState from './SearchEmptyState'

function Search() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const urlQuery = useSelector(selectSearchQuery)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [searchQuery, setSearchQuery] = useState((urlQuery || '') as string)
  const query = useDebounce(searchQuery, 200)
  const { dispatchQueryParams } = useLocationConnect()
  const searchDatasets = useSelector(selectVesselsDatasets)
  const searchResults = useSelector(selectSearchResults)
  const searchStatus = useSelector(selectSearchStatus)

  useEffect(() => {
    if (query !== '') {
      batch(() => {
        dispatchQueryParams({ query })
        dispatch(fetchVesselSearchThunk({ query, datasets: searchDatasets }))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const onCloseClick = () => {
    batch(() => {
      dispatchQueryParams({ query: undefined })
      dispatch(cleanVesselSearchResults())
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
        <div className={styles.search}>
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
              icon="filter-off"
              tooltip={t('vessel.search.filter_open', 'Filter search (Coming soon)')}
              tooltipPlacement="bottom"
            />
            <IconButton
              icon="close"
              onClick={onCloseClick}
              type="border"
              tooltip={t('vessel.search.close', 'Close search')}
              tooltipPlacement="bottom"
            />
          </div>
          {searchResults && (
            <ul {...getMenuProps()} className={styles.searchResults}>
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
            </ul>
          )}
          {!searchResults && searchStatus !== AsyncReducerStatus.Loading && <SearchEmptyState />}
        </div>
      )}
    </Downshift>
  )
}

export default Search
