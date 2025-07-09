import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice, IconButton, Logo, SubBrands } from '@globalfishingwatch/ui-components'

import { WorkspaceCategory } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectIsWorkspaceGeneratorEnabled } from 'features/debug/debug.selectors'
import LanguageToggle from 'features/i18n/LanguageToggle'
import { setModalOpen } from 'features/modals/modals.slice'
import ReportTitle from 'features/reports/report-area/title/ReportTitle'
import PortReportHeader from 'features/reports/report-port/PortReportHeader'
import VesselGroupReportTitle from 'features/reports/report-vessel-group/VesselGroupReportTitle'
import type { SearchType } from 'features/search/search.config'
import {
  CALLSIGN_MIN_LENGTH,
  EMPTY_SEARCH_FILTERS,
  IMO_LENGTH,
  SSVID_LENGTH,
} from 'features/search/search.config'
import { selectSearchOption, selectSearchQuery } from 'features/search/search.config.selectors'
import { useSearchFiltersConnect } from 'features/search/search.hook'
import { cleanVesselSearchResults } from 'features/search/search.slice'
import NavigationHistoryButton from 'features/sidebar/buttons/NavigationHistoryButton'
import NavigationWorkspaceButton from 'features/sidebar/buttons/NavigationWorkspaceButton'
import SaveReportButton from 'features/sidebar/buttons/SaveReportButton'
import SaveWorkspaceButton from 'features/sidebar/buttons/SaveWorkspaceButton'
import ShareWorkspaceButton from 'features/sidebar/buttons/ShareWorkspaceButton'
import { getScrollElement } from 'features/sidebar/sidebar.utils'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import UserButton from 'features/user/UserButton'
import VesselHeader from 'features/vessel/VesselHeader'
import { selectWorkspaceHistoryNavigation } from 'features/workspace/workspace.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectIsAnyAreaReportLocation,
  selectIsAnySearchLocation,
  selectIsAnyVesselLocation,
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
  selectIsWorkspaceLocation,
  selectLocationCategory,
} from 'routes/routes.selectors'

import styles from './SidebarHeader.module.css'

function SidebarHeader() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const readOnly = useSelector(selectReadOnly)
  const [isSticky, setIsSticky] = useState(false)
  const locationCategory = useSelector(selectLocationCategory)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isSearchLocation = useSelector(selectIsAnySearchLocation)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const workspaceHistoryNavigation = useSelector(selectWorkspaceHistoryNavigation)
  const isWorkspaceGeneratorEnabled = useSelector(selectIsWorkspaceGeneratorEnabled)
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isSmallScreen = useSmallScreen(SMALL_PHONE_BREAKPOINT)
  const activeSearchOption = useSelector(selectSearchOption)
  const isGFWUser = useSelector(selectIsGFWUser)
  const { dispatchQueryParams } = useLocationConnect()
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
        label: t('search.basic'),
      },
      {
        id: 'advanced' as SearchType,
        label: t('search.advanced'),
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
    dispatchQueryParams({ searchOption: option.id, ...EMPTY_SEARCH_FILTERS, ...additionalParams })
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
    <div className={cx({ [styles.sticky]: isSticky })}>
      <div className={cx(styles.sidebarHeader)}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} subBrand={getSubBrand()} />
        </a>
        {!readOnly && (
          <Fragment>
            {isGFWUser && isWorkspaceGeneratorEnabled && (
              <IconButton
                icon="magic"
                size="medium"
                onClick={() => dispatch(setModalOpen({ id: 'workspaceGenerator', open: true }))}
              />
            )}
            {/* TODO:CVP2 add save report in isAnyReportLocation when this PR https://github.com/GlobalFishingWatch/api-monorepo-node/pull/289 is merged */}
            {isAreaReportLocation && <SaveReportButton />}
            {isWorkspaceLocation && <SaveWorkspaceButton />}
            {(isWorkspaceLocation || isAreaReportLocation || isAnyVesselLocation) && (
              <ShareWorkspaceButton />
            )}
            {isSmallScreen && <LanguageToggle className={styles.lngToggle} position="rightDown" />}
            {isSmallScreen && <UserButton className={styles.userButton} />}
            {isSearchLocation && !readOnly && !isSmallScreen && (
              <Choice
                options={searchOptions}
                activeOption={activeSearchOption}
                onSelect={onSearchOptionChange}
                size="small"
                className={styles.searchOption}
              />
            )}
            {workspaceHistoryNavigation?.length ? (
              <NavigationHistoryButton />
            ) : (
              <NavigationWorkspaceButton />
            )}
          </Fragment>
        )}
      </div>
      {sectionHeaderComponent}
    </div>
  )
}

export default SidebarHeader
