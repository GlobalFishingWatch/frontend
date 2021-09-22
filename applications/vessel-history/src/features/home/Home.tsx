import React, { Fragment, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import Link from 'redux-first-router-link'
import { redirect } from 'redux-first-router'
import { DateTime, Interval } from 'luxon'
import GFWAPI from '@globalfishingwatch/api-client'
import { VesselSearch } from '@globalfishingwatch/api-types'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import { Spinner, IconButton, Button } from '@globalfishingwatch/ui-components'
import { RESULTS_PER_PAGE } from 'data/constants'
import VesselListItem from 'features/vessel-list-item/VesselListItem'
import { useOfflineVesselsAPI } from 'features/vessels/offline-vessels.hook'
import { selectAll as selectAllOfflineVessels } from 'features/vessels/offline-vessels.slice'
import SearchPlaceholder, { SearchNoResultsState } from 'features/search/SearchPlaceholders'
import { selectHasSearch } from 'routes/routes.selectors'
import {
  selectSearchOffset,
  selectSearchResults,
  selectSearchTotalResults,
  selectSearching,
} from 'features/search/search.selectors'
import AdvancedSearch from 'features/search/AdvancedSearch'
import { useUser } from 'features/user/user.hooks'
import { PROFILE } from 'routes/routes'
import { useSearchConnect, useSearchResultsConnect } from 'features/search/search.hooks'
import { formatVesselProfileId } from 'features/vessels/vessels.utils'
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
  const { onVesselClick, selectedVessels, setSelectedVessels } = useSearchResultsConnect()
  const { fetchResults } = useSearchConnect({ onNewSearch: () => setSelectedVessels([]) })
  const searching = useSelector(selectSearching)
  const hasSearch = useSelector(selectHasSearch)
  const vessels = useSelector(selectSearchResults)
  const offset = useSelector(selectSearchOffset)
  const totalResults = useSelector(selectSearchTotalResults)
  const offlineVessels = useSelector(selectAllOfflineVessels)
  const { dispatchFetchOfflineVessels, dispatchDeleteOfflineVessel } = useOfflineVesselsAPI()

  // useEffect(() => GFWAPI.setConfig({ ...GFWAPI.getConfig(), debug: true }))

  useEffect(() => {
    dispatchFetchOfflineVessels()
  }, [dispatchFetchOfflineVessels])

  const openVesselProfile = useCallback(
    (vessel, aka: string[] = []) => {
      dispatch(
        redirect({
          type: PROFILE,
          payload: {
            dataset: vessel.dataset ?? 'NA',
            vesselID: vessel.id ?? 'NA',
            tmtID: vessel.vesselMatchId ?? 'NA',
          },
          query: {
            aka: aka as any,
          },
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
    const selectedVessel = vessels[selectedVessels[0]]
    const akaVessels = selectedVessels
      .slice(1)
      .map((index) => vessels[index])
      .map((akaVessel) =>
        formatVesselProfileId(akaVessel.dataset, akaVessel.id, akaVessel.vesselMatchId)
      )
    if (selectedVessel) openVesselProfile(selectedVessel, akaVessels)
  }, [openVesselProfile, selectedVessels, vessels])

  const trackOpenSettings = useCallback(() => {
    uaEvent({
      category: 'Highlight Events',
      action: 'Start highlight events configurations',
      label: JSON.stringify({
        page: 'home',
      }),
    })
  }, [])

  const trackRemoveOffline = useCallback(
    (offlineVessel) => {
      const now = DateTime.now()
      const savedOn = DateTime.fromISO(offlineVessel.savedOn)
      const i = Interval.fromDateTimes(savedOn, now)
      uaEvent({
        category: 'Offline Access',
        action: 'Remove saved vessel for offline view',
        label: JSON.stringify({ page: 'home' }),
        value: Math.floor(i.length('days')),
      })
      dispatchDeleteOfflineVessel(offlineVessel)
    },
    [dispatchDeleteOfflineVessel]
  )

  useEffect(() => {
    setSelectedVessels([])
  }, [setSelectedVessels, vessels])

  return (
    <div className={styles.homeContainer} data-testid="home">
      <header>
        <Logo className={styles.logo}></Logo>
        <IconButton type="default" size="default" icon="logout" onClick={logout}></IconButton>
        <Link to={['settings']} onClick={trackOpenSettings}>
          <IconButton type="default" size="default" icon="settings"></IconButton>
        </Link>
        <LanguageToggle />
        <button onClick={() => GFWAPI.setToken('97yfghuwe')}>invalidate token</button>
      </header>
      <div className={styles.search}>
        <AdvancedSearch />
        {!hasSearch && (
          <div className={styles.content}>
            <h2 className={styles.offlineTitle}>{t('common.offlineAccess', 'OFFLINE ACCESS')}</h2>
            {offlineVessels.length > 0 ? (
              <div className={styles.content}>
                {offlineVessels.map((vessel, index) => (
                  <VesselListItem
                    key={index}
                    index={index}
                    vessel={vessel}
                    saved={vessel.savedOn}
                    onVesselClick={onOpenVesselProfile(vessel)}
                    onDeleteClick={() => trackRemoveOffline(vessel)}
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
        {hasSearch && (
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
                      index={index}
                      onVesselClick={onVesselClick(index)}
                      selected={selectedVessels.includes(index)}
                    />
                  ))}
                  {selectedVessels.length > 0 && (
                    <div className={styles.bottomActions}>
                      {selectedVessels.length === 1 && (
                        <Button className={styles.bottomActionsBtn} onClick={onSeeVesselClick}>
                          {t('search.seeVessel', 'See Vessel')}
                        </Button>
                      )}
                      {selectedVessels.length > 1 && (
                        <Button className={styles.bottomActionsBtn} onClick={onMergeVesselClick}>
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
