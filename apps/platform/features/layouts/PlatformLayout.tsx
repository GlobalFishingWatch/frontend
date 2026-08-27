import { Fragment, Suspense, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { getRouteApi, Outlet } from '@tanstack/react-router'
import cx from 'classnames'

import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Menu } from '@globalfishingwatch/ui-components/menu'

import menuBgImage from 'assets/images/menubg.jpg'
import { PLATFORM_CONTAINER_DOM_ID } from 'data/map/config'
import ContentPanel from 'features/_map/content-panel/ContentPanel'
import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'
import { useAppShell } from 'features/app/app-shell.hooks'
import ErrorBoundary from 'features/app/ErrorBoundary'
import AppModals from 'features/modals/Modals'
import LegacyNav from 'features/nav/LegacyNav'
import { PLATFORM_MODE } from 'features/nav/nav.config'
import PlatformNav from 'features/nav/PlatformNav'
import { usePersistedPanelWidth } from 'hooks/cookies.hooks'
import { ConfirmLeave } from 'router/ConfirmLeave'
import { selectIsHelpHubLocation } from 'router/routes.selectors'

import styles from './layouts.module.css'

const rootRoute = getRouteApi('__root__')

function PlatformLayout() {
  useAppShell()

  const contentPanelWidth = rootRoute.useLoaderData({ select: (d) => d?.contentPanelWidth })
  const screenWidth = rootRoute.useLoaderData({ select: (d) => d?.screenWidth })
  const onContentPanelWidthChange = usePersistedPanelWidth('contentPanel')

  const readOnly = useSelector(selectReadOnly)
  const isHelpHubLocation = useSelector(selectIsHelpHubLocation)
  const [menuOpen, setMenuOpen] = useState(false)

  const isSmallPhone = useSmallScreen(SMALL_PHONE_BREAKPOINT, {
    initialScreenWidth: screenWidth ?? undefined,
  })

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  return (
    <Fragment>
      <ConfirmLeave />
      <div
        id={PLATFORM_CONTAINER_DOM_ID}
        className={cx(styles.platformContainer, {
          [styles.helpHubBackground]: isHelpHubLocation,
        })}
      >
        {!isSmallPhone &&
          (PLATFORM_MODE ? <PlatformNav /> : <LegacyNav onMenuClick={onMenuClick} />)}
        <div className={styles.platformContent}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
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
      {/* Platform mode drops the hamburger for the expanding rail, so nothing can open this. */}
      {!readOnly && !PLATFORM_MODE && (
        <Menu
          bgImage={menuBgImage}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          activeLinkId="map-data"
        />
      )}
      <AppModals />
      <ToastContainer position="top-center" className={styles.toastContainer} closeButton={false} />
    </Fragment>
  )
}

export default PlatformLayout
