import { Fragment, Suspense, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { getRouteApi, Outlet, useSearch } from '@tanstack/react-router'

import { Logo, Menu, SplitView } from '@globalfishingwatch/ui-components'

import menuBgImage from 'assets/images/menubg.jpg'
import { ROOT_DOM_ELEMENT } from 'data/config'
import {
  CONTENT_PANEL_WIDTH_COOKIE_KEY,
  SCREEN_WIDTH_COOKIE_KEY,
  SIDEBAR_WIDTH_COOKIE_KEY,
} from 'features/app/app.config'
import { useDatasetDrag } from 'features/app/drag-dataset.hooks'
import ErrorBoundary from 'features/app/ErrorBoundary'
import ContentPanel from 'features/content-panel/ContentPanel'
import { useFeatureFlagsToast } from 'features/debug/debug.hooks'
import { useActivityDownloadTimeoutRefresh } from 'features/download/downloadActivity.hooks'
import { t } from 'features/i18n/i18n'
import { useUserLanguageUpdate } from 'features/i18n/i18n.hooks'
import AppModals from 'features/modals/Modals'
import { selectScreenshotModalOpen } from 'features/modals/modals.slice'
import Sidebar from 'features/sidebar/Sidebar'
import { useFetchTrackCorrections } from 'features/track-correction/track-correction.hooks'
import { useLoginPopupListener } from 'features/user/user.hooks'
import { fetchUserThunk } from 'features/user/user.slice'
import { useEnsureWorkspaceLoad } from 'features/workspace/workspace.hook'
import { ConfirmLeave } from 'router/ConfirmLeave'
import { ConfirmVesselProfileLeave } from 'router/ConfirmVesselProfileLeave'
import {
  SEARCH,
  USER,
  VESSEL,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
  WORKSPACES_LIST,
} from 'router/routes'
import { useBeforeUnload, useReplaceQueryParams } from 'router/routes.hook'
import {
  selectIsAnyAreaReportLocation,
  selectIsAnySearchLocation,
  selectIsMapDrawing,
  selectIsVesselLocation,
  selectIsWorkspaceLocation,
  selectLocationType,
} from 'router/routes.selectors'
import { usePersistedCookieNumber } from 'utils/cookies'
import { getIsBrowser } from 'utils/dom'

import { selectReadOnly, selectScreenshotMode, selectSidebarOpen } from './selectors/app.selectors'
import { useAnalytics } from './analytics.hooks'
import { useAppDispatch } from './app.hooks'
import Main from './Main'

import styles from './App.module.css'

declare global {
  interface Window {
    gtag: any
  }
}

const rootRoute = getRouteApi('__root__')

function App() {
  useAnalytics()
  useDatasetDrag()
  useBeforeUnload()
  useUserLanguageUpdate()
  useFeatureFlagsToast()
  useFetchTrackCorrections()
  useActivityDownloadTimeoutRefresh()
  useEnsureWorkspaceLoad()
  useLoginPopupListener()

  const dispatch = useAppDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const readOnly = useSelector(selectReadOnly)
  const screenshotMode = useSelector(selectScreenshotMode)
  const [menuOpen, setMenuOpen] = useState(false)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const vesselLocation = useSelector(selectIsVesselLocation)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isAnySearchLocation = useSelector(selectIsAnySearchLocation)

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  const locationType = useSelector(selectLocationType)
  const isPrinting = useSelector(selectScreenshotModalOpen)
  const sidebarWidthPct = rootRoute.useLoaderData({ select: (d) => d?.asideWidthPct })
  const onSidebarWidthChange = usePersistedCookieNumber(SIDEBAR_WIDTH_COOKIE_KEY)
  const contentPanelWidth = rootRoute.useLoaderData({ select: (d) => d?.contentPanelWidth })
  const onContentPanelWidthChange = usePersistedCookieNumber(CONTENT_PANEL_WIDTH_COOKIE_KEY)
  const screenWidth = rootRoute.useLoaderData({ select: (d) => d?.screenWidth })
  const onScreenWidthChange = usePersistedCookieNumber(SCREEN_WIDTH_COOKIE_KEY)
  const { replaceQueryParams } = useReplaceQueryParams()

  useEffect(() => {
    dispatch(fetchUserThunk({ guest: false }))
  }, [dispatch])

  const onToggle = useCallback(() => {
    replaceQueryParams({ sidebarOpen: !sidebarOpen })
  }, [replaceQueryParams, sidebarOpen])

  const getSidebarName = useCallback(() => {
    if (locationType === USER) return t((t) => t.user.title)
    if (locationType === WORKSPACES_LIST) return t((t) => t.workspace.titlePlural)
    if (locationType === SEARCH || locationType === WORKSPACE_SEARCH)
      return t((t) => t.search.title)
    if (locationType === VESSEL || locationType === WORKSPACE_VESSEL)
      return t((t) => t.vessel.title)
    if (isAreaReportLocation) return t((t) => t.analysis.title)
    return t((t) => t.common.layerList)
  }, [locationType, isAreaReportLocation])

  let asideWidth = '50%'

  if (screenshotMode) {
    asideWidth = '0'
  } else if (readOnly) {
    asideWidth = isAreaReportLocation ? '45%' : '34rem'
  } else if (isAnySearchLocation) {
    asideWidth = '100%'
  } else if (isWorkspaceLocation) {
    asideWidth = isPrinting ? '34rem' : '40rem'
  }

  const isAsideResizable =
    !screenshotMode && !readOnly && !isAnySearchLocation && !isWorkspaceLocation

  const isPopup = useSearch({ strict: false, select: (s) => s?.isPopup })
  if ((getIsBrowser() && window.opener) || isPopup) {
    return null
  }

  return (
    <Fragment>
      <ConfirmLeave />
      <ConfirmVesselProfileLeave />
      <a
        href="https://globalfishingwatch.org"
        className={screenshotMode ? styles.logo : 'print-only'}
      >
        <Logo type={screenshotMode ? 'invert' : 'default'} />
      </a>
      <div className={styles.appLayout}>
        <div id="app-layout-content" className={styles.appLayoutContent}>
          <ErrorBoundary>
            <SplitView
              isOpen={sidebarOpen && !isMapDrawing}
              showToggle={(isWorkspaceLocation || vesselLocation) && !screenshotMode}
              onToggle={onToggle}
              aside={
                <Sidebar onMenuClick={onMenuClick}>
                  <Suspense fallback={null}>
                    <Outlet />
                  </Suspense>
                </Sidebar>
              }
              main={<Main />}
              asideWidth={asideWidth}
              initialAsideWidthPct={sidebarWidthPct ?? undefined}
              onAsideWidthChange={onSidebarWidthChange}
              initialScreenWidth={screenWidth ?? undefined}
              onScreenWidthChange={onScreenWidthChange}
              resizable={isAsideResizable}
              showAsideLabel={getSidebarName()}
              showMainLabel={t((t) => t.common.map)}
              className={styles.splitContainer}
              asideClassName={styles.aside}
              mainClassName={styles.main}
            />

            {!readOnly && (
              <Menu
                appSelector={ROOT_DOM_ELEMENT}
                bgImage={menuBgImage}
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                activeLinkId="map-data"
              />
            )}
            <AppModals />
            <ToastContainer
              position="top-center"
              className={styles.toastContainer}
              closeButton={false}
            />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <ContentPanel
              initialPanelWidth={contentPanelWidth ?? undefined}
              onPanelWidthChange={onContentPanelWidthChange}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Fragment>
  )
}

export default App
