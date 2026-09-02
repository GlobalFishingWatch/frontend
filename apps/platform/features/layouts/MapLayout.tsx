import { Fragment, Suspense, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { getRouteApi, Outlet, useRouterState } from '@tanstack/react-router'

import { SPLIT_VIEW_DOM_ID } from '@globalfishingwatch/ui-components/dom-ids'
import { Logo } from '@globalfishingwatch/ui-components/logo'
import { SplitView } from '@globalfishingwatch/ui-components/split-view'

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
import { useOnboardingAutoOpen } from 'features/onboarding/onboarding.hooks'
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
  selectIsMapDrawing,
  selectIsVesselLocation,
  selectIsWorkspaceLocation,
  selectIsWorkspaceSearchLocation,
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
  useOnboardingAutoOpen()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const readOnly = useSelector(selectReadOnly)
  const screenshotMode = useSelector(selectScreenshotMode)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const vesselLocation = useSelector(selectIsVesselLocation)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isWorkspaceSearchLocation = useSelector(selectIsWorkspaceSearchLocation)

  const locationType = useSelector(selectLocationType)
  const isPrinting = useSelector(selectScreenshotModalOpen)
  const sidebarWidthPct = rootRoute.useLoaderData({ select: (d) => d?.asideWidthPct })
  const onSidebarWidthChange = usePersistedPanelWidth('sidebar')
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
  let fixedAsideWidth: string | null = null

  if (screenshotMode) {
    fixedAsideWidth = '0'
  } else if (readOnly) {
    fixedAsideWidth = isAreaReportLocation ? '45%' : `calc(34rem - ${RAIL})`
  } else if (isWorkspaceSearchLocation) {
    fixedAsideWidth = '100%'
  } else if (isWorkspaceLocation) {
    fixedAsideWidth = isPrinting ? '34rem' : `calc(40rem - ${RAIL})`
  }

  const asideWidth = fixedAsideWidth ?? '50%'
  const isAsideResizable = fixedAsideWidth === null

  const isNavigating = useRouterState({ select: (s) => s.status === 'pending' })
  const [committedAside, setCommittedAside] = useState({ asideWidth, isAsideResizable })
  if (
    !isNavigating &&
    (committedAside.asideWidth !== asideWidth ||
      committedAside.isAsideResizable !== isAsideResizable)
  ) {
    setCommittedAside({ asideWidth, isAsideResizable })
  }

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
        <div id={SPLIT_VIEW_DOM_ID} className={styles.appLayoutContent}>
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
              asideWidth={committedAside.asideWidth}
              initialAsideWidthPct={sidebarWidthPct ?? undefined}
              onAsideWidthChange={onSidebarWidthChange}
              initialScreenWidth={screenWidth ?? undefined}
              onScreenWidthChange={onScreenWidthChange}
              resizable={committedAside.isAsideResizable}
              showAsideLabel={getSidebarName()}
              showMainLabel={t((t) => t.common.map)}
              className={styles.splitContainer}
              asideClassName={styles.aside}
              mainClassName={styles.main}
            />
          </ErrorBoundary>
        </div>
      </div>
    </Fragment>
  )
}

export default MapLayout
