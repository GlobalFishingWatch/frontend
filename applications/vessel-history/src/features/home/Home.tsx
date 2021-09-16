import React, { Fragment, useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Link from 'redux-first-router-link'
import { redirect } from 'redux-first-router'
import { VesselSearch } from '@globalfishingwatch/api-types'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import { Spinner, IconButton, Button } from '@globalfishingwatch/ui-components'
import { RESULTS_PER_PAGE } from 'data/constants'
import VesselListItem from 'features/vessel-list-item/VesselListItem'
import { useOfflineVesselsAPI } from 'features/vessels/offline-vessels.hook'
import { selectAll as selectAllOfflineVessels } from 'features/vessels/offline-vessels.slice'
import SearchPlaceholder, { SearchNoResultsState } from 'features/search/SearchPlaceholders'
import { selectAdvancedSearchFields, selectQueryParam } from 'routes/routes.selectors'
import { fetchVesselSearchThunk } from 'features/search/search.thunk'
import {
  selectSearchOffset,
  selectSearchResults,
  selectSearchTotalResults,
  selectSearching,
} from 'features/search/search.selectors'
import AdvancedSearch from 'features/search/AdvancedSearch'
import { useUser } from 'features/user/user.hooks'
import { PROFILE } from 'routes/routes'
import { useSearchConnect } from 'features/search/search.hooks'
import styles from './Home.module.css'
import LanguageToggle from './LanguageToggle'

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
  const { logout } = useUser()
  const { onVesselClick, selectedVessels, setSelectedVessels } = useSearchConnect()
  const searching = useSelector(selectSearching)
  const query = useSelector(selectQueryParam('q'))
  const advancedSearch = useSelector(selectAdvancedSearchFields)
  const vessels = useSelector(selectSearchResults)
  const offset = useSelector(selectSearchOffset)
  const totalResults = useSelector(selectSearchTotalResults)
  const offlineVessels = useSelector(selectAllOfflineVessels)
  const { dispatchFetchOfflineVessels, dispatchDeleteOfflineVessel } = useOfflineVesselsAPI()

  const promiseRef = useRef<any>()

  useEffect(() => {
    dispatchFetchOfflineVessels()
  }, [dispatchFetchOfflineVessels])

  const openVesselProfile = useCallback(
    (vessel) => {
      dispatch(
        redirect({
          type: PROFILE,
          payload: {
            dataset: vessel.dataset ?? 'NA',
            vesselID: vessel.id ?? 'NA',
            tmtID: vessel.vesselMatchId ?? 'NA',
          },
          query: {},
        })
      )
    },
    [dispatch]
  )
  const onOpenVesselProfile = useCallback(
    (vessel) => () => openVesselProfile(vessel),
    [openVesselProfile]
  )

  const onSeeVesselClick = useCallback(() => {
    const selectedVessel = vessels[selectedVessels[0]]
    if (selectedVessel) openVesselProfile(selectedVessel)
  }, [openVesselProfile, selectedVessels, vessels])

  const onMergeVesselClick = useCallback(() => {
    // TODO Implement logic to pass other selected vessels to Profile for merging
    const selectedVessel = vessels[selectedVessels[0]]
    if (selectedVessel) openVesselProfile(selectedVessel)
  }, [openVesselProfile, selectedVessels, vessels])

  const fetchResults = useCallback(
    (offset = 0) => {
      if (promiseRef.current) {
        promiseRef.current.abort()
      }
      if (offset === 0) {
        setSelectedVessels([])
      }
      // To ensure the pending action isn't overwritted by the abort above
      // and we miss the loading intermediate state
      setTimeout(() => {
        promiseRef.current = dispatch(
          fetchVesselSearchThunk({
            query,
            offset,
            ...((advancedSearch ? { advancedSearch } : {}) as any),
          })
        )
      }, 100)
    },
    [setSelectedVessels, dispatch, query, advancedSearch]
  )

  useEffect(() => {
    setSelectedVessels([])
  }, [setSelectedVessels, vessels])

  return (
    <div className={styles.homeContainer} data-testid="home">
      <header>
        <Logo className={styles.logo}></Logo>
        <IconButton type="default" size="default" icon="logout" onClick={logout}></IconButton>
        <Link to={['settings']}>
          <IconButton type="default" size="default" icon="settings"></IconButton>
        </Link>
        <LanguageToggle />
      </header>
      <div className={styles.search}>
        <AdvancedSearch />
        {!query && (
          <div className={styles.content}>
            <h2 className={styles.offlineTitle}>{t('common.offlineAccess', 'OFFLINE ACCESS')}</h2>
            {offlineVessels.length > 0 ? (
              <div className={styles.content}>
                {offlineVessels.map((vessel, index) => (
                  <VesselListItem
                    key={index}
                    vessel={vessel}
                    saved={vessel.savedOn}
                    onDeleteClick={() => dispatchDeleteOfflineVessel(vessel.profileId)}
                    onVesselClick={onOpenVesselProfile(vessel)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.offlineAccessEmptyState}>
                {t(
                  'common.offlineAccessEmptyState',
                  'The vessels you save for offline access will appear here.'
                )}
              </div>
            )}
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
                <div className={styles.content}>
                  {vessels.map((vessel: VesselSearch, index) => (
                    <VesselListItem
                      key={index}
                      vessel={vessel}
                      onVesselClick={onVesselClick(index)}
                      selected={selectedVessels.includes(index)}
                    />
                  ))}
                  {selectedVessels.length > 0 && (
                    <div className={styles.bottomActions}>
                      {selectedVessels.length === 1 && (
                        <Button className={styles.seeVesselBtn} onClick={onSeeVesselClick}>
                          {t('search.seeVessel', 'See Vessel')}
                        </Button>
                      )}
                      {selectedVessels.length > 1 && (
                        <Button className={styles.mergeVesselBtn} onClick={onMergeVesselClick}>
                          {t('search.mergeSelectedVessels', 'Merge Selected Vessels')}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
              {totalResults > 0 && !searching && vessels.length < totalResults && (
                <div className={styles.listFooter}>
                  <Button
                    className={styles.loadMoreBtn}
                    onClick={() => fetchResults(offset + RESULTS_PER_PAGE)}
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
              {totalResults > 0 &&
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
