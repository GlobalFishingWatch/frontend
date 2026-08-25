import { Suspense, useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from '@tanstack/react-router'
import cx from 'classnames'

import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Logo } from '@globalfishingwatch/ui-components/logo'

import NavigationHistoryButton from 'features/_map/sidebar/buttons/NavigationHistoryButton'
import { SCROLL_CONTAINER_DOM_ID } from 'features/_map/sidebar/sidebar.utils'
import SearchTypeChoice from 'features/_vessels/search/SearchTypeChoice'
import HelpHubBreadcrumb from 'features/help/HelpHubBreadcrumb'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import { selectIsHelpHubLocation, selectIsStandaloneSearchLocation } from 'router/routes.selectors'

import styles from './layouts.module.css'

/**
 * Layout for platform pages with no map and no sidebar — currently /user, /vessel-search and
 * /help-and-resources.
 *
 * It still provides `SCROLL_CONTAINER_DOM_ID`. That element is an app-wide contract, not a Sidebar
 * detail: 15 modules reach for it, including router/router-sync.ts (scroll reset on every
 * navigation), VesselGroupModal and ExpandedContainer. Dropping it here would break those on these
 * routes.
 */
function ContentLayout() {
  const isClientHydrated = useIsClientHydrated()
  const isStandaloneSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const isHelpHubLocation = useSelector(selectIsHelpHubLocation)
  const isSmallScreen = useSmallScreen(SMALL_PHONE_BREAKPOINT)
  const [isScrolled, setIsScrolled] = useState(false)

  return (
    <div className={styles.contentLayout}>
      <div
        className={cx(styles.contentHeader, {
          [styles.contentHeaderScrolled]: isScrolled,
        })}
      >
        <a href="https://globalfishingwatch.org">
          <Logo />
        </a>
        <div className={styles.contentHeaderActions}>
          {isStandaloneSearchLocation && !isSmallScreen && <SearchTypeChoice />}
          {isClientHydrated && <NavigationHistoryButton />}
        </div>
      </div>
      <div
        id={SCROLL_CONTAINER_DOM_ID}
        className={cx('scrollContainer', styles.contentScrollContainer)}
        data-testid="content-container"
        onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 0)}
      >
        {isHelpHubLocation && <HelpHubBreadcrumb />}
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default ContentLayout
