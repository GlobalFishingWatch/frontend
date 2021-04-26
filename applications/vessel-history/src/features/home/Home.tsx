<<<<<<< HEAD
import React, { Fragment, useEffect } from 'react'
=======
import React, { Fragment, useEffect, useState } from 'react'
>>>>>>> 14964906... improved vessel search
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { DebounceInput } from 'react-debounce-input'
import { useTranslation } from 'react-i18next'
import { VesselSearch } from '@globalfishingwatch/api-types'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import { Spinner, IconButton, Button } from '@globalfishingwatch/ui-components'
import { RESULTS_PER_PAGE } from 'data/constants'
import { logoutUserThunk } from 'features/user/user.slice'
import VesselListItem from 'features/vessel-list-item/VesselListItem'
import { useOfflineVesselsAPI } from 'features/vessels/offline-vessels.hook'
import { selectAll as selectAllOfflineVessels } from 'features/vessels/offline-vessels.slice'
import SearchPlaceholder, { SearchNoResultsState } from 'features/search/SearchPlaceholders'
import { selectQueryParam } from 'routes/routes.selectors'
import { fetchVesselSearchThunk } from 'features/search/search.thunk'
import {
  getOffset,
  getSearchResults,
  getTotalResults,
  isSearching,
} from 'features/search/search.slice'
import { useLocationConnect } from 'routes/routes.hook'
import styles from './Home.module.css'
import '@globalfishingwatch/ui-components/dist/base.css'

interface LoaderProps {
  invert?: boolean
  timeout?: number
  mini?: boolean
  encounter?: boolean
  carrier?: boolean
}

const Home: React.FC<LoaderProps> = (): React.ReactElement => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const searching = useSelector(isSearching)
  const urlQuery = useSelector(selectQueryParam('q'))
  const [query, setQuery] = useState((urlQuery || '') as string)
  const vessels = useSelector(getSearchResults)
  const offset = useSelector(getOffset)
  const totalResults = useSelector(getTotalResults)
  const offlineVessels = useSelector(selectAllOfflineVessels)
  const { dispatchQueryParams } = useLocationConnect()
  const { dispatchFetchOfflineVessels, dispatchDeleteOfflineVessel } = useOfflineVesselsAPI()

  useEffect(() => {
    dispatchFetchOfflineVessels()
  }, [dispatchFetchOfflineVessels])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchQueryParams({ q: e.target.value })
    setQuery(e.target.value)
  }

  useEffect(() => {
    if (query !== '') {
      dispatch(fetchVesselSearchThunk({ query: query, offset: 0 }))
    }
  }, [dispatch, query])

  return (
    <div className={styles.homeContainer}>
      {!query && (
        <header>
          <Logo className={styles.logo}></Logo>
          <IconButton
            type="default"
            size="default"
            icon="logout"
            onClick={async () => {
              dispatch(logoutUserThunk({ redirectToLogin: true }))
            }}
          ></IconButton>
          <IconButton type="default" size="default" icon="settings"></IconButton>
        </header>
      )}
      <div className={styles.search}>
        <div className={cx(styles.searchbar, query ? styles.searching : '', styles.inputContainer)}>
          <DebounceInput
            debounceTimeout={500}
            autoFocus
            type="search"
            role="search"
            placeholder="Search vessels by name, MMSI, IMO"
            aria-label="Search vessels"
            className={styles.input}
            onChange={onInputChange}
            value={query}
          />
          {!query && (
            <IconButton
              type="default"
              size="default"
              icon="search"
              className={styles.searchButton}
            ></IconButton>
          )}
        </div>
        {!query && (
          <div>
            <h2>{t('common.offlineAccess', 'OFFLINE ACCESS')}</h2>
            <div className={styles.offlineVessels}>
              {offlineVessels.map((vessel, index) => (
                <VesselListItem
                  key={index}
                  vessel={vessel}
                  saved={vessel.savedOn}
                  onDeleteClick={() => dispatchDeleteOfflineVessel(vessel.profileId)}
                />
              ))}
            </div>
          </div>
        )}
        {query && (
          <Fragment>
            <div className={styles.searchResults}>
              {searching && offset === 0 && (
                <SearchPlaceholder>
                  <Spinner className={styles.loader}></Spinner>
                </SearchPlaceholder>
              )}
              {(!searching || offset > 0) && vessels.length > 0 && (
                <div className={styles.offlineVessels}>
                  {vessels.map((vessel: VesselSearch, index) => (
                    <VesselListItem key={index} vessel={vessel} />
                  ))}
                </div>
              )}
              {totalResults && !searching && vessels.length < totalResults && (
                <div className={styles.listFooter}>
                  <Button
                    onClick={() =>
                      dispatch(fetchVesselSearchThunk({ query, offset: offset + RESULTS_PER_PAGE }))
                    }
                  >
                    {t('search.loadMore', 'LOAD MORE')}
                  </Button>
                </div>
              )}
              {searching && offset > 0 && (
                <div className={styles.listFooter}>
                  <Spinner className={styles.loader}></Spinner>
                </div>
              )}
              {totalResults &&
                !searching &&
                vessels.length >= totalResults &&
                vessels.length !== 0 && (
                  <p className={styles.listFooter}>{t('search.noMore', 'NO MORE RESULTS')}</p>
                )}
              {!searching && vessels.length === 0 && <SearchNoResultsState />}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Home
