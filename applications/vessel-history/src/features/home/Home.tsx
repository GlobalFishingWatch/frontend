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
import SearchPlaceholder, { SearchNoResultsState } from 'features/search/SearchPlaceholders'
import { selectQueryParam } from 'routes/routes.selectors'
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
  const [searching, setSearching] = useState(false)
  const lastQuery = useSelector(getLastQuery)
  const vessels = useSelector(getVesselsFound)
  const query = useSelector(selectQueryParam('q'))
  const { dispatchQueryParams } = useLocationConnect()

  const minimumCharacters = 3
  const resultsPerRequest = 25

  const fetchData = useCallback(
    async (query: string) => {
      setSearching(true)
      GFWAPI.fetch<any>(
        `/v1/vessels/search?datasets=${encodeURIComponent(
          BASE_DATASET
        )}&limit=${resultsPerRequest}&offset=${0}&query=${encodeURIComponent(query)}`
      )
        .then((json: any) => {
          const resultVessels: Array<VesselSearch> = json.entries
          setSearching(false)
          dispatch(setVesselSearch({ vessels: resultVessels, query }))
        })
        .catch((error) => {
          setSearching(false)
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
            <div className={styles.offlineVessels}></div>
          </div>
        )}
        {query && (
          <Fragment>
            <ul className={styles.searchResults}>
              {searching && (
                <SearchPlaceholder>
                  <Spinner className={styles.loader}></Spinner>
                </SearchPlaceholder>
              )}
              {!searching && vessels.length > 0 && (
                <div className={styles.offlineVessels}>
                  {vessels.map((vessel, index) => (
                    <VesselListItem key={index} vessel={vessel} />
                  ))}
                </div>
              )}
              {!searching && vessels.length === 0 && <SearchNoResultsState />}
            </ul>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Home
