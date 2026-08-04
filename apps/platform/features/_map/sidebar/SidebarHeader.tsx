import { Fragment, lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice, Logo, SubBrands } from '@globalfishingwatch/ui-components'

import { WorkspaceCategory } from 'data/map/workspaces'
import NavigationHistoryButton from 'features/_map/sidebar/buttons/NavigationHistoryButton'
import NavigationWorkspaceButton from 'features/_map/sidebar/buttons/NavigationWorkspaceButton'
import ShareWorkspaceButton from 'features/_map/sidebar/buttons/ShareWorkspaceButton'
import { selectHasTimeModeEnabled } from 'features/_map/sidebar/sidebar.selectors'
import { getScrollElement } from 'features/_map/sidebar/sidebar.utils'
import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'
import { selectWorkspaceHistoryNavigation } from 'features/_map/workspace/workspace.selectors'
import UserButton from 'features/_user/UserButton'
import type { SearchType } from 'features/_vessels/search/search.config'
import {
  CALLSIGN_MIN_LENGTH,
  EMPTY_SEARCH_FILTERS,
  IMO_LENGTH,
  SSVID_LENGTH,
} from 'features/_vessels/search/search.config'
import { selectSearchOption, selectSearchQuery } from 'features/_vessels/search/search.config.selectors'
import { useSearchFiltersConnect } from 'features/_vessels/search/search.hook'
import { cleanVesselSearchResults } from 'features/_vessels/search/search.slice'
import { selectTrackCorrectionOpen } from 'features/_vessels/track-correction/track-selection.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import LanguageToggle from 'features/i18n/LanguageToggle'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import {
  selectIsAnyAreaReportLocation,
  selectIsAnyReportLocation,
  selectIsAnySearchLocation,
  selectIsAnyVesselLocation,
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
  selectIsWorkspaceLocation,
  selectLocationCategory,
} from 'router/routes.selectors'

import styles from './SidebarHeader.module.css'

/**
 * Lazy: none of these render on /user or /vessel-search, and each statically reaches 45-157 modules
 * across features/_reports, features/vessel and features/workspace. Keeping them static made the
 * map-free shell pull the whole report and vessel graph. Measure with
 * `node scripts/reachable-features.mjs features/_map/sidebar/SidebarHeader.tsx`.
 */
const ReportTitle = lazy(() => import('features/_reports/report-area/title/ReportTitle'))
const PortReportHeader = lazy(() => import('features/_reports/report-port/PortReportHeader'))
const VesselGroupReportTitle = lazy(
  () => import('features/_reports/report-vessel-group/VesselGroupReportTitle')
)
const VesselHeader = lazy(() => import('features/_vessels/vessel/VesselHeader'))
const SaveReportButton = lazy(() => import('features/_map/sidebar/buttons/SaveReportButton'))
const SaveWorkspaceButton = lazy(() => import('features/_map/sidebar/buttons/SaveWorkspaceButton'))
const TimeModeSelector = lazy(() => import('features/_map/sidebar/TimeModeSelector'))

function SidebarHeader() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const readOnly = useSelector(selectReadOnly)
  const [isSticky, setIsSticky] = useState(false)
  const locationCategory = useSelector(selectLocationCategory)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const hasTimeModeEnabled = useSelector(selectHasTimeModeEnabled)
  const isSearchLocation = useSelector(selectIsAnySearchLocation)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const workspaceHistoryNavigation = useSelector(selectWorkspaceHistoryNavigation)
  const isClientHydrated = useIsClientHydrated()
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)
  const isSmallScreen = useSmallScreen(SMALL_PHONE_BREAKPOINT)
  const activeSearchOption = useSelector(selectSearchOption)
  const searchQuery = useSelector(selectSearchQuery)
  const { searchFilters } = useSearchFiltersConnect()
  const scrollElement = getScrollElement()

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      if (target?.scrollTop > 0) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [scrollElement])

  const getSubBrand = useCallback((): SubBrands | undefined => {
    let subBrand: SubBrands | undefined
    if (locationCategory === WorkspaceCategory.MarineManager) subBrand = SubBrands.MarineManager
    return subBrand
  }, [locationCategory])

  const searchOptions: ChoiceOption<SearchType>[] = useMemo(() => {
    return [
      {
        id: 'basic' as SearchType,
        label: t((t) => t.search.basic),
      },
      {
        id: 'advanced' as SearchType,
        label: t((t) => t.search.advanced),
      },
    ]
  }, [t])

  const onSearchOptionChange = (option: ChoiceOption<SearchType>) => {
    trackEvent({
      category: TrackCategory.SearchVessel,
      action: 'Toggle search type to filter results',
      label: option.id,
    })
    let additionalParams = {}
    if (option.id === 'advanced') {
      if (searchQuery?.length === SSVID_LENGTH && !isNaN(Number(searchQuery))) {
        additionalParams = { ssvid: searchQuery }
      } else if (searchQuery?.length === IMO_LENGTH && !isNaN(Number(searchQuery))) {
        additionalParams = { imo: searchQuery }
      } else if (searchQuery?.length >= CALLSIGN_MIN_LENGTH && /^[A-Z0-9]+$/.test(searchQuery)) {
        additionalParams = { callsign: searchQuery }
      } else {
        additionalParams = { query: searchQuery }
      }
    } else {
      if (searchQuery || searchFilters.ssvid || searchFilters.imo) {
        additionalParams = {
          query: searchQuery || searchFilters.ssvid || searchFilters.imo,
        }
      }
    }
    dispatch(cleanVesselSearchResults())
    replaceQueryParams({ searchOption: option.id, ...EMPTY_SEARCH_FILTERS, ...additionalParams })
  }

  const sectionHeaderComponent = useMemo(() => {
    if (isAnyVesselLocation) {
      return <VesselHeader isSticky={isSticky} />
    }
    if (isAreaReportLocation) {
      return <ReportTitle isSticky={isSticky} />
    }
    if (isPortReportLocation) {
      return <PortReportHeader />
    }
    if (isVesselGroupReportLocation) {
      return <VesselGroupReportTitle />
    }
  }, [
    isAnyVesselLocation,
    isAreaReportLocation,
    isPortReportLocation,
    isSticky,
    isVesselGroupReportLocation,
  ])

  return (
    <div className={cx({ [styles.sticky]: isSticky }, styles.container)}>
      <div className={cx(styles.sidebarHeader)}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} subBrand={getSubBrand()} />
        </a>
        {!readOnly && (
          <Fragment>
            {/* TODO:CVP2 add save report in isAnyReportLocation when this PR https://github.com/GlobalFishingWatch/api-monorepo-node/pull/289 is merged */}
            <Suspense fallback={null}>
              {isAreaReportLocation && <SaveReportButton />}
              {isWorkspaceLocation && !isTrackCorrectionOpen && <SaveWorkspaceButton />}
            </Suspense>
            {(isWorkspaceLocation || isAnyVesselLocation || isAnyReportLocation) &&
              !isTrackCorrectionOpen && <ShareWorkspaceButton />}
            {isSmallScreen && <LanguageToggle className={styles.lngToggle} position="rightDown" />}
            {isSmallScreen && <UserButton className={styles.userButton} />}
            {isSearchLocation && !readOnly && !isSmallScreen && (
              <Choice
                options={searchOptions}
                activeOption={activeSearchOption}
                onSelect={onSearchOptionChange}
                size="medium"
                className={styles.searchOption}
              />
            )}
            {isClientHydrated &&
              (workspaceHistoryNavigation?.length ? (
                <NavigationHistoryButton />
              ) : (
                <NavigationWorkspaceButton />
              ))}
          </Fragment>
        )}
      </div>
      <Suspense fallback={null}>
        {hasTimeModeEnabled && <TimeModeSelector />}
        {sectionHeaderComponent}
      </Suspense>
    </div>
  )
}

export default SidebarHeader
