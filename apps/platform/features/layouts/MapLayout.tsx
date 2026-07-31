import { Fragment, Suspense, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { getRouteApi, Outlet } from '@tanstack/react-router'

import { Logo } from '@globalfishingwatch/ui-components/logo'
import { SplitView } from '@globalfishingwatch/ui-components/split-view'

import ContentPanel from 'features/_map/content-panel/ContentPanel'
import BasemapLabelsLocaleSync from 'features/_map/dataviews/BasemapLabelsLocaleSync'
import Sidebar from 'features/_map/sidebar/Sidebar'
import {
  selectReadOnly,
  selectScreenshotMode,
  selectSidebarOpen,
} from 'features/_map/workspace/selectors/app.selectors'
import ErrorBoundary from 'features/app/ErrorBoundary'
import { t } from 'features/i18n/i18n'
import Main from 'features/layouts/MapMainLayout'
import { selectScreenshotModalOpen } from 'features/modals/modals.slice'
import { usePersistedPanelWidth } from 'hooks/cookies.hooks'
import { ConfirmVesselProfileLeave } from 'router/ConfirmVesselProfileLeave'
import {
  SEARCH,
  USER,
  VESSEL,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
  WORKSPACES_LIST,
} from 'router/routes'
import { useReplaceQueryParams } from 'router/routes.hook'
import {
  selectIsAnyAreaReportLocation,
  selectIsAnySearchLocation,
  selectIsMapDrawing,
  selectIsVesselLocation,
  selectIsWorkspaceLocation,
  selectLocationType,
} from 'router/routes.selectors'

import styles from './layouts.module.css'

declare global {
  interface Window {
    gtag: any
  }
}

const rootRoute = getRouteApi('__root__')

function MapLayout() {
  const sidebarOpen = useSelector(selectSidebarOpen)
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const readOnly = useSelector(selectReadOnly)
  const screenshotMode = useSelector(selectScreenshotMode)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const vesselLocation = useSelector(selectIsVesselLocation)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isAnySearchLocation = useSelector(selectIsAnySearchLocation)

  const locationType = useSelector(selectLocationType)
  const isPrinting = useSelector(selectScreenshotModalOpen)
  const sidebarWidthPct = rootRoute.useLoaderData({ select: (d) => d?.asideWidthPct })
  const onSidebarWidthChange = usePersistedPanelWidth('sidebar')
  const contentPanelWidth = rootRoute.useLoaderData({ select: (d) => d?.contentPanelWidth })
  const onContentPanelWidthChange = usePersistedPanelWidth('contentPanel')
  const screenWidth = rootRoute.useLoaderData({ select: (d) => d?.screenWidth })
  const onScreenWidthChange = usePersistedPanelWidth('screen')
  const { replaceQueryParams } = useReplaceQueryParams()

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

  const RAIL = 'var(--sidebar-tabs-width)'
  let asideWidth = '50%'

  if (screenshotMode) {
    asideWidth = '0'
  } else if (readOnly) {
    asideWidth = isAreaReportLocation ? '45%' : `calc(34rem - ${RAIL})`
  } else if (isAnySearchLocation) {
    asideWidth = '100%'
  } else if (isWorkspaceLocation) {
    asideWidth = isPrinting ? '34rem' : `calc(40rem - ${RAIL})`
  }

  const isAsideResizable =
    !screenshotMode && !readOnly && !isAnySearchLocation && !isWorkspaceLocation

  return (
    <Fragment>
      <BasemapLabelsLocaleSync />
      <ConfirmVesselProfileLeave />
      <a
        href="https://globalfishingwatch.org"
        className={screenshotMode ? styles.fixedLogo : 'print-only'}
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
                <Sidebar>
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

export default MapLayout
