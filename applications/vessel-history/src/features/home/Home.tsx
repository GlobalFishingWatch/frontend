import React, { Fragment, useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { DebounceInput } from 'react-debounce-input'
import { useTranslation } from 'react-i18next'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import GFWAPI from '@globalfishingwatch/api-client'
import { Spinner, IconButton } from '@globalfishingwatch/ui-components'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { BASE_DATASET } from 'data/constants'
import { getLastQuery, getVesselsFound, setVesselSearch } from 'features/search/search.slice'
import { logoutUserThunk } from 'features/user/user.slice'
import VesselListItem from 'features/vessel-list-item/VesselListItem'
import { useOfflineVesselsAPI } from 'features/vessels/offline-vessels.hook'
import { selectAll as selectAllOfflineVessels } from 'features/vessels/offline-vessels.slice'
import SearchPlaceholder, { SearchNoResultsState } from 'features/search/SearchPlaceholders'
import { selectQueryParam } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { OfflineVessel } from 'types/vessel'
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
  const [loading, setLoading] = useState(false)
  const lastQuery = useSelector(getLastQuery)
  const vessels = useSelector(getVesselsFound)
  const query = useSelector(selectQueryParam('q'))
  const offlineVessels = useSelector(selectAllOfflineVessels)
  const { dispatchQueryParams } = useLocationConnect()
  const { dispatchFetchOfflineVessels, dispatchDeleteOfflineVessel } = useOfflineVesselsAPI()

  const minimumCharacters = 3
  const resultsPerRequest = 25

  useEffect(() => {
    dispatchFetchOfflineVessels()
  }, [dispatchFetchOfflineVessels])

  const fetchData = useCallback(
    async (query: string) => {
      setLoading(true)
      GFWAPI.fetch<any>(
        `/v1/vessels/search?datasets=${encodeURIComponent(
          BASE_DATASET
        )}&limit=${resultsPerRequest}&offset=${0}&query=${encodeURIComponent(query)}`
      )
        .then((json: any) => {
          const resultVessels: Array<VesselSearch> = json.entries
          setLoading(false)
          dispatch(setVesselSearch({ vessels: resultVessels, query }))
        })
        .catch((error) => {
          setLoading(false)
        })
    },
    [dispatch]
  )

  useEffect(() => {
    if (query?.length >= minimumCharacters && query !== lastQuery) {
      fetchData(query)
    }
  }, [query, fetchData, lastQuery])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchQueryParams({ q: e.target.value })
  }
  const onDeleteClick = async (data: OfflineVessel) => {
    setLoading(true)
    await dispatchDeleteOfflineVessel(data.profileId)
    setLoading(false)
  }
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
                  onDeleteClick={() => onDeleteClick(vessel)}
                />
              ))}
            </div>
          </div>
        )}
        {query && (
          <Fragment>
            <ul className={styles.searchResults}>
              {loading && (
                <SearchPlaceholder>
                  <Spinner className={styles.loader}></Spinner>
                </SearchPlaceholder>
              )}
              {!loading && vessels.length > 0 && (
                <div className={styles.offlineVessels}>
                  {vessels.map((vessel, index) => (
                    <VesselListItem key={index} vessel={vessel} />
                  ))}
                </div>
              )}
              {!loading && vessels.length === 0 && <SearchNoResultsState />}
            </ul>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Home
