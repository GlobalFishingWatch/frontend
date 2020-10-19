import React, { useState, useEffect } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import Downshift from 'downshift'
import { formatDate } from 'utils/dates'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import { Vessel } from '@globalfishingwatch/api-types'
import { useLocationConnect } from 'routes/routes.hook'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectVesselsDatasets, selectTracksDatasets } from 'features/workspace/workspace.selectors'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectSearchQuery } from 'routes/routes.selectors'
import {
  fetchVesselSearchThunk,
  selectSearchResults,
  cleanVesselSearchResults,
  selectSearchStatus,
} from './search.slice'
import styles from './Search.module.css'
import SearchEmptyState from './SearchEmptyState'

function Search() {
  const dispatch = useDispatch()
  const urlQuery = useSelector(selectSearchQuery)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [searchQuery, setSearchQuery] = useState((urlQuery || '') as string)
  const query = useDebounce(searchQuery, 200)
  const { dispatchQueryParams } = useLocationConnect()
  const searchDatasets = useSelector(selectVesselsDatasets)
  const trackDatasets = useSelector(selectTracksDatasets)
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
    })
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const onSelectionChange = (selection: Vessel | null) => {
    if (selection) {
      const vesselDataviewInstance = getVesselDataviewInstance(
        selection,
        // TODO this datasets not are all of them but the response of the selection
        trackDatasets,
        searchDatasets
      )
      if (vesselDataviewInstance) {
        batch(() => {
          upsertDataviewInstance(vesselDataviewInstance)
          onCloseClick()
        })
      }
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
              placeholder="Type to search vessels"
            />
            {searchStatus === 'loading' && <Spinner size="small" />}
            <IconButton
              icon="filter-off"
              tooltip="Filter search (Coming soon)"
              tooltipPlacement="bottom"
            />
            <IconButton
              icon="close"
              onClick={onCloseClick}
              type="border"
              tooltip="Close search"
              tooltipPlacement="bottom"
            />
          </div>
          {searchResults && (
            <ul {...getMenuProps()} className={styles.searchResults}>
              {searchResults[0].results?.entries?.map((entry, index: number) => {
                const {
                  id,
                  shipname,
                  flag,
                  mmsi,
                  imo,
                  callsign,
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  first_transmission_date,
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  last_transmission_date,
                } = entry
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
                      <div className={styles.property}>
                        <label>Flag</label>
                        <span>{flag || '---'}</span>
                      </div>
                      <div className={styles.property}>
                        <label>MMSI</label>
                        <span>{mmsi || '---'}</span>
                      </div>
                      <div className={styles.property}>
                        <label>IMO</label>
                        <span>{imo || '---'}</span>
                      </div>
                      <div className={styles.property}>
                        <label>Callsign</label>
                        <span>{callsign || '---'}</span>
                      </div>
                      <div className={styles.property}>
                        <label>Transmissions</label>
                        <span>
                          {`from ${formatDate(first_transmission_date)} to ${formatDate(
                            last_transmission_date
                          )}`}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          {!searchResults && searchStatus !== 'loading' && <SearchEmptyState />}
        </div>
      )}
    </Downshift>
  )
}

export default Search
