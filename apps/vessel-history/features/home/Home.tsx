import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime, Interval } from 'luxon'
import { redirect } from 'redux-first-router'

import type { RelatedVesselSearchMerged} from '@globalfishingwatch/api-types';
import { VesselSearch } from '@globalfishingwatch/api-types'
import { useNavigatorOnline } from '@globalfishingwatch/react-hooks'
import { Button,IconButton, Spinner } from '@globalfishingwatch/ui-components'

import { IS_STANDALONE_APP } from 'data/config'
import { RESULTS_PER_PAGE, TMT_CONTACT_US_URL } from 'data/constants'
import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'
import { useApp } from 'features/app/app.hooks'
import Partners from 'features/partners/Partners'
import AdvancedSearch from 'features/search/AdvancedSearch'
import { useSearchConnect, useSearchResultsConnect } from 'features/search/search.hooks'
import {
  selectSearchError,
  selectSearching,
  selectSearchOffset,
  selectSearchResults,
  selectSearchSources,
  selectSearchTotalResults,
} from 'features/search/search.selectors'
import SearchPlaceholder, {
  SearchErrorState,
  SearchNoResultsFromTmtState,
  SearchNoResultsState,
} from 'features/search/SearchPlaceholders'
import { useUser } from 'features/user/user.hooks'
import { selectUserData } from 'features/user/user.slice'
import VesselListItem from 'features/vessel-list-item/VesselListItem'
import { useOfflineVesselsAPI } from 'features/vessels/offline-vessels.hook'
import { selectAllOfflineVessels } from 'features/vessels/offline-vessels.slice'
import { formatVesselProfileId, NOT_AVAILABLE } from 'features/vessels/vessels.utils'
import ViewSelector from 'features/view-selector/view-selector'
import { HOME, PROFILE, SETTINGS } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectAdvancedSearchFields,
  selectHasSearch,
  selectUrlQuery,
} from 'routes/routes.selectors'
import type { OfflineVessel } from 'types/vessel'
import { getUTCDateTime } from 'utils/dates'

import LanguageToggle from './LanguageToggle'

import styles from './Home.module.css'

interface LoaderProps {
  invert?: boolean
  timeout?: number
  mini?: boolean
  encounter?: boolean
  carrier?: boolean
}

const Home: React.FC<LoaderProps> = (): React.ReactElement<any> => {
  const { t } = useTranslation()
  const { openFeedback } = useApp()

  const dispatch = useDispatch()
  const { logout, logged, authorized } = useUser()
  const [typing, setTyping] = useState(true)
  const { onVesselClick, selectedVessels, setSelectedVessels } = useSearchResultsConnect()
  const { fetchResults } = useSearchConnect({ onNewSearch: () => setSelectedVessels([]) })
  const { dispatchLocation } = useLocationConnect()
  const searching = useSelector(selectSearching)
  const hasSearch = useSelector(selectHasSearch)
  const vessels = useSelector(selectSearchResults)
  const offset = useSelector(selectSearchOffset)
  const totalResults = useSelector(selectSearchTotalResults)
  const searchError = useSelector(selectSearchError)
  const searchSources = useSelector(selectSearchSources)
  const offlineVessels = useSelector(selectAllOfflineVessels)
  const { dispatchFetchOfflineVessels, dispatchDeleteOfflineVessel } = useOfflineVesselsAPI()
  const { online } = useNavigatorOnline()

  useEffect(() => {
    dispatchFetchOfflineVessels()
  }, [dispatchFetchOfflineVessels])

  const onLoginClick = useCallback(() => {
    dispatch(
      redirect({
        type: HOME,
        query: {
          offline: 'false',
        },
      }) as any
    )
  }, [dispatch])

  const openVesselProfile = useCallback(
    (vessel, aka: string[] = []) => {
      dispatch(
        redirect({
          type: PROFILE,
          payload: {
            dataset: vessel.dataset ?? NOT_AVAILABLE,
            vesselID: vessel.id ?? NOT_AVAILABLE,
            tmtID: vessel.vesselMatchId ?? NOT_AVAILABLE,
          },
          query: {
            aka: aka as any,
          },
        }) as any
      )
    },
    [dispatch]
  )

  const getListOfSelectedVessels = useCallback(() => {
    return selectedVessels
      .map((index) => vessels[index])
      .map((allVessels) => allVessels.relatedVessels)
      .flatMap((relatedVessel) => relatedVessel)
  }, [vessels, selectedVessels])

  const onOpenVesselProfile = useCallback(
    (vessel) => () => openVesselProfile(vessel, vessel.aka),
    [openVesselProfile]
  )

  const onSeeVesselClick = useCallback(() => {
    const parsedSelectedVessels = getListOfSelectedVessels()
    const selectedVessel = parsedSelectedVessels[0]
    const akaVessels = parsedSelectedVessels
      .slice(1)
      .map((akaVessel) =>
        formatVesselProfileId(akaVessel.dataset, akaVessel.id, akaVessel.vesselMatchId)
      )
    if (selectedVessel) openVesselProfile(selectedVessel, akaVessels)
  }, [getListOfSelectedVessels, openVesselProfile])

  const onMergeVesselClick = useCallback(() => {
    const parsedSelectedVessels = getListOfSelectedVessels()
    const selectedVessel = parsedSelectedVessels[0]
    trackEvent({
      category: TrackCategory.SearchVesselVV,
      action: 'Merge vessels',
      label: JSON.stringify(selectedVessels),
    })
    const akaVessels = parsedSelectedVessels
      .slice(1)
      .map((akaVessel) =>
        formatVesselProfileId(akaVessel.dataset, akaVessel.id, akaVessel.vesselMatchId)
      )
    if (selectedVessel) openVesselProfile(selectedVessel, akaVessels)
  }, [getListOfSelectedVessels, openVesselProfile, selectedVessels])

  const onSettingsClick = useCallback(() => {
    dispatchLocation(SETTINGS)
    trackEvent({
      category: TrackCategory.HighlightEvents,
      action: 'Start highlight events configurations',
      label: JSON.stringify({
        page: 'home',
      }),
    })
  }, [dispatchLocation])

  const trackRemoveOffline = useCallback(
    (offlineVessel) => {
      const now = DateTime.utc()
      const savedOn = getUTCDateTime(offlineVessel.savedOn)
      const i = Interval.fromDateTimes(savedOn, now)
      trackEvent({
        category: TrackCategory.OfflineAccess,
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

  const { email = '' } = useSelector(selectUserData) || { email: '' }

  const query = useSelector(selectUrlQuery)
  const advancedSearch = useSelector(selectAdvancedSearchFields)
  const searchContext = useMemo(
    () =>
      `Vessel Viewer > Search: ${[
        query,
        advancedSearch?.mmsi,
        advancedSearch?.imo,
        advancedSearch?.callsign,
        advancedSearch?.flags,
        advancedSearch?.firstTransmissionDate,
        advancedSearch?.lastTransmissionDate,
      ]
        .filter((predicate) => predicate)
        .join(', ')}`,
    [
      advancedSearch?.callsign,
      advancedSearch?.firstTransmissionDate,
      advancedSearch?.flags,
      advancedSearch?.imo,
      advancedSearch?.lastTransmissionDate,
      advancedSearch?.mmsi,
      query,
    ]
  )
  const vesselIds = useMemo(
    () => vessels.map((vessel) => ({ gfwid: vessel.id, tmtid: vessel.vesselMatchId })),
    [vessels]
  )
  const contactUsLink = useMemo(
    () =>
      `${TMT_CONTACT_US_URL}&email=${encodeURIComponent(
        email
      )}&usercontext=${searchContext}&data=${JSON.stringify({
        hits: vesselIds.length,
        name: query,
        ...advancedSearch,
        results: vesselIds,
      })}`,
    [advancedSearch, email, query, searchContext, vesselIds]
  )
  const hasAccess = (logged && authorized) || IS_STANDALONE_APP
  const onContactUsClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.SearchVesselVV,
      action: 'Click Contact Us ',
      label: JSON.stringify({
        name: query,
        ...advancedSearch,
        results: vesselIds,
      }),
      value: vesselIds.length,
    })
  }, [advancedSearch, query, vesselIds])

  const vesselsLength = useMemo(() => {
    return vessels.reduce((acc, vessel) => {
      return acc + (vessel.relatedVessels?.length ?? 0)
    }, 0)
  }, [vessels])
  return (
    <div className={styles.homeContainer} data-testid="home">
      <header className={styles.header}>
        <h1 className={styles.logo}>Vessel Viewer</h1>

        <div className={styles.toolbar}>
          <ViewSelector />
          <LanguageToggle />
          {online && (
            <IconButton
              icon="feedback"
              onClick={openFeedback}
              tooltip={t('common.feedback', 'Feedback')}
              tooltipPlacement="bottom"
            />
          )}
          {online && (
            <IconButton
              onClick={onSettingsClick}
              type="default"
              size="default"
              icon="settings"
            ></IconButton>
          )}
          {online && !hasAccess && (
            <IconButton
              type="default"
              size="default"
              icon="user"
              onClick={onLoginClick}
            ></IconButton>
          )}
          {online && hasAccess && (
            <IconButton type="default" size="default" icon="logout" onClick={logout}></IconButton>
          )}
        </div>
      </header>
      <div className={styles.search}>
        {hasAccess && <AdvancedSearch onTyping={(isTyping) => setTyping(isTyping)} />}
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
              <div className={styles.content}>
                <div className={styles.offlineAccessEmptyState}>
                  {t(
                    'common.offlineAccessEmptyState',
                    'The vessels you save for offline access will appear here.'
                  )}
                </div>
              </div>
            )}
            <Partners />
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
                  {vessels.map((vessel: RelatedVesselSearchMerged, index) => (
                    <VesselListItem
                      key={index}
                      vessel={vessel as OfflineVessel}
                      index={index}
                      showLabelsHelp={true}
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
              {totalResults > 0 && !searching && vesselsLength < totalResults && (
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
              {!searchError &&
                !typing &&
                !searching &&
                vesselsLength >= 0 &&
                (searchSources?.length === 2 || !searchSources) && (
                  <SearchNoResultsState
                    contactUsLink={contactUsLink}
                    onContactUsClick={onContactUsClick}
                  />
                )}
              {!searchError &&
                !typing &&
                !searching &&
                vesselsLength >= 0 &&
                searchSources?.length < 2 && <SearchNoResultsFromTmtState />}
              {searchError && !typing && <SearchErrorState error={searchError}></SearchErrorState>}
              <Partners />
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Home
