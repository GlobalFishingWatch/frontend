import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { Icon } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import { HOME, SEARCH } from 'routes/routes'
import vesselImage from 'assets/images/vessel@2x.png'
import {
  fetchVesselSearchThunk,
  selectSearchResults,
  cleanVesselSearchResults,
} from './search.slice'
import styles from './Search.module.css'

function Search() {
  const dispatch = useDispatch()
  const { payload } = useLocationConnect()
  const [searchQuery, setSearchQuery] = useState((payload.query || '') as string)
  const query = useDebounce(searchQuery, 200)
  const { dispatchLocation } = useLocationConnect()
  const searchResults = useSelector(selectSearchResults)

  useEffect(() => {
    if (query) {
      dispatchLocation(SEARCH, { query })
      dispatch(fetchVesselSearchThunk(query))
    } else {
      dispatchLocation(SEARCH)
      dispatch(cleanVesselSearchResults())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const onCloseClick = () => {
    dispatchLocation(HOME)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const formatDate = (date: string) => {
    return DateTime.fromISO(date).toFormat('yyyy/MM/dd')
  }

  return (
    <div className={styles.search}>
      <div className={styles.inputContainer}>
        <InputText
          onChange={onInputChange}
          value={searchQuery}
          autoFocus
          className={styles.input}
          placeholder="Type to search vessels"
        />
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
      <div className={styles.searchResults}>
        {searchResults ? (
          searchResults[0].results?.entries?.map((entry: any) => {
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
              <Tooltip content="Add to map" placement="right">
                <div className={styles.searchResult} key={id}>
                  <div className={styles.name}>{shipname}</div>
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
                </div>
              </Tooltip>
            )
          })
        ) : (
          <div className={styles.emptyState}>
            <div>
              <img src={vesselImage} alt="vessel" className={styles.vesselImage} />
              <p>Search by vessel name or identification code (IMO, MMSI, VMS ID, etc…)</p>
              <p>
                You can narrow your search pressing the filter icon (
                {<Icon className={styles.inlineIcon} icon="filter-off" />}) in the top bar or
                writing filters like:
              </p>
              <p>
                <code>flag:china,japan,spain</code>
              </p>
              <p>
                <code>active-after:2017/03/01</code>
              </p>
              <p>
                <code>active-before:2018/01/01</code>
              </p>
              <p>
                <code>source:AIS</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
