import { Fragment, lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Logo, SubBrands } from '@globalfishingwatch/ui-components'

import { WorkspaceCategory } from 'data/map/workspaces'
import NavigationHistoryButton from 'features/_map/sidebar/buttons/NavigationHistoryButton'
import NavigationWorkspaceButton from 'features/_map/sidebar/buttons/NavigationWorkspaceButton'
import ShareWorkspaceButton from 'features/_map/sidebar/buttons/ShareWorkspaceButton'
import { selectHasTimeModeEnabled } from 'features/_map/sidebar/sidebar.selectors'
import { getScrollElement } from 'features/_map/sidebar/sidebar.utils'
import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'
import { selectWorkspaceHistoryNavigation } from 'features/_map/workspace/workspace.selectors'
import UserButton from 'features/_user/UserButton'
import SearchTypeChoice from 'features/_vessels/search/SearchTypeChoice'
import { selectTrackCorrectionOpen } from 'features/_vessels/track-correction/track-selection.selectors'
import LanguageToggle from 'features/i18n/LanguageToggle'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
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

  useEffect(() => {
    const scrollElement = getScrollElement()
    if (!scrollElement) return
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      setIsSticky(target?.scrollTop > 0)
    }
    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    return () => scrollElement.removeEventListener('scroll', handleScroll)
  }, [])

  const getSubBrand = useCallback((): SubBrands | undefined => {
    let subBrand: SubBrands | undefined
    if (locationCategory === WorkspaceCategory.MarineManager) subBrand = SubBrands.MarineManager
    return subBrand
  }, [locationCategory])

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
              <SearchTypeChoice className={styles.searchOption} />
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
