import { Suspense } from 'react'
import { getRouteApi, Outlet } from '@tanstack/react-router'
import cx from 'classnames'

import { Logo } from '@globalfishingwatch/ui-components/logo'

import ContentPanel from 'features/_map/content-panel/ContentPanel'
import NavigationHistoryButton from 'features/_map/sidebar/buttons/NavigationHistoryButton'
import { SCROLL_CONTAINER_DOM_ID } from 'features/_map/sidebar/sidebar.utils'
import ErrorBoundary from 'features/app/ErrorBoundary'
import { usePersistedPanelWidth } from 'hooks/cookies.hooks'
import { useIsClientHydrated } from 'hooks/ssr.hooks'

import styles from './layouts.module.css'

const rootRoute = getRouteApi('__root__')

/**
 * Layout for platform pages with no map and no sidebar — currently /user and /vessel-search.
 *
 * It still provides `SCROLL_CONTAINER_DOM_ID`. That element is an app-wide contract, not a Sidebar
 * detail: 15 modules reach for it, including router/router-sync.ts (scroll reset on every
 * navigation), VesselGroupModal and ExpandedContainer. Dropping it here would break those on these
 * routes.
 */
function ContentLayout() {
  const isClientHydrated = useIsClientHydrated()
  const contentPanelWidth = rootRoute.useLoaderData({ select: (d) => d?.contentPanelWidth })
  const screenWidth = rootRoute.useLoaderData({ select: (d) => d?.screenWidth })
  const onContentPanelWidthChange = usePersistedPanelWidth('contentPanel')

  return (
    <div className={styles.appLayout}>
      <div className={styles.contentLayout}>
        <div className={cx(styles.contentHeader)}>
          <a href="https://globalfishingwatch.org">
            <Logo />
          </a>
          {isClientHydrated && <NavigationHistoryButton />}
        </div>
        <div
          id={SCROLL_CONTAINER_DOM_ID}
          className={cx('scrollContainer', styles.contentScrollContainer)}
          data-testid="content-container"
        >
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </div>
      </div>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <ContentPanel
            initialPanelWidth={contentPanelWidth ?? undefined}
            initialScreenWidth={screenWidth ?? undefined}
            onPanelWidthChange={onContentPanelWidthChange}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default ContentLayout
