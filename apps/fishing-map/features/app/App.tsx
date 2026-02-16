import { Fragment, Suspense, useCallback, useEffect, useState } from 'react'
import { FpsView } from 'react-fps'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { HeadContent, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import type { Workspace } from '@globalfishingwatch/api-types'
import { Logo, Menu, SplitView } from '@globalfishingwatch/ui-components'

import menuBgImage from 'assets/images/menubg.jpg'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { useDatasetDrag } from 'features/app/drag-dataset.hooks'
import ErrorBoundary from 'features/app/ErrorBoundary'
import { useFeatureFlagsToast } from 'features/debug/debug.hooks'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { t } from 'features/i18n/i18n'
import { useUserLanguageUpdate } from 'features/i18n/i18n.hooks'
import AppModals from 'features/modals/Modals'
import { selectScreenshotModalOpen } from 'features/modals/modals.slice'
import Sidebar from 'features/sidebar/Sidebar'
import { useFetchTrackCorrections } from 'features/track-correction/track-correction.hooks'
import { selectIsUserLogged } from 'features/user/selectors/user.selectors'
import { fetchUserThunk } from 'features/user/user.slice'
import { useFitWorkspaceBounds } from 'features/workspace/workspace.hook'
import {
  isWorkspacePasswordProtected,
  selectCurrentWorkspaceId,
  selectWorkspaceCustomStatus,
  selectWorkspaceReportId,
} from 'features/workspace/workspace.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { ConfirmLeave } from 'router/ConfirmLeave'
import { ConfirmVesselProfileLeave } from 'router/ConfirmVesselProfileLeave'
import {
  HOME,
  REPORT,
  SEARCH,
  USER,
  VESSEL,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
  WORKSPACES_LIST,
} from 'router/routes'
import { useBeforeUnload, useReplaceLoginUrl, useReplaceQueryParams } from 'router/routes.hook'
import {
  selectIsAnyAreaReportLocation,
  selectIsAnySearchLocation,
  selectIsMapDrawing,
  selectIsVesselLocation,
  selectIsWorkspaceLocation,
  selectLocationType,
  selectReportId,
  selectWorkspaceId,
} from 'router/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import { selectReadOnly, selectSidebarOpen } from './selectors/app.selectors'
import { useAnalytics } from './analytics.hooks'
import { useAppDispatch } from './app.hooks'
import Main from './Main'

import styles from './App.module.css'

declare global {
  interface Window {
    gtag: any
  }
}

function App() {
  useAnalytics()
  useDatasetDrag()
  useReplaceLoginUrl()
  useBeforeUnload()
  useUserLanguageUpdate()
  useFeatureFlagsToast()
  useFetchTrackCorrections()
  const dispatch = useAppDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const readOnly = useSelector(selectReadOnly)
  const i18n = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const vesselLocation = useSelector(selectIsVesselLocation)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isAnySearchLocation = useSelector(selectIsAnySearchLocation)

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  const locationType = useSelector(selectLocationType)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const currentReportId = useSelector(selectWorkspaceReportId)
  const reportId = useSelector(selectReportId)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const userLogged = useSelector(selectIsUserLogged)
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const fitWorkspaceBounds = useFitWorkspaceBounds()
  const isPrinting = useSelector(selectScreenshotModalOpen)
  const { replaceQueryParams } = useReplaceQueryParams()

  useEffect(() => {
    dispatch(fetchUserThunk({ guest: false }))
  }, [dispatch])

  // Workspace fetching for routes NOT under the workspace layout route:
  // - HOME (/) needs the default workspace
  // - Standalone REPORT (/report/$reportId) needs a workspace loaded
  const isHomeLocation = locationType === HOME
  const homeNeedsFetch = isHomeLocation && currentWorkspaceId !== DEFAULT_WORKSPACE_ID
  const standaloneReportNeedsFetch = locationType === REPORT
  const hasStandaloneReportIdChanged = locationType === REPORT && currentReportId !== reportId

  useEffect(() => {
    let action: any
    let actionResolved = false
    const fetchWorkspace = async () => {
      action = dispatch(fetchWorkspaceThunk({ workspaceId: urlWorkspaceId as string, reportId }))
      const resolvedAction = await action
      if (fetchWorkspaceThunk.fulfilled.match(resolvedAction)) {
        const { dataviewInstancesToUpsert, ...workspace } = resolvedAction.payload
        if (dataviewInstancesToUpsert) {
          replaceQueryParams({ dataviewInstances: dataviewInstancesToUpsert })
        }
        if (!isWorkspacePasswordProtected(workspace as Workspace)) {
          fitWorkspaceBounds(workspace as Workspace)
        }
      }
      actionResolved = true
    }
    if (
      userLogged &&
      workspaceCustomStatus !== AsyncReducerStatus.Loading &&
      (homeNeedsFetch || standaloneReportNeedsFetch || hasStandaloneReportIdChanged)
    ) {
      fetchWorkspace()
    }
    return () => {
      if (action && action.abort !== undefined && !actionResolved) {
        action.abort()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogged, homeNeedsFetch, standaloneReportNeedsFetch, hasStandaloneReportIdChanged])

  const onToggle = useCallback(() => {
    replaceQueryParams({ sidebarOpen: !sidebarOpen })
  }, [sidebarOpen])

  const debugOptions = useSelector(selectDebugOptions)
  const [isReady, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const showStats = isReady && debugOptions.mapStats === true

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
  if (readOnly) {
    asideWidth = isAreaReportLocation ? '45%' : '34rem'
  } else if (isAnySearchLocation) {
    asideWidth = '100%'
  } else if (isWorkspaceLocation) {
    asideWidth = isPrinting ? '34rem' : '39rem'
  }

  /* TODO:RR test if we can remove this */
  // if (!i18n.ready) {
  //   return null
  // }

  return (
    <Fragment>
      <HeadContent />
      {/* // TODO:RR test if this really works */}
      <ConfirmLeave />
      <ConfirmVesselProfileLeave />
      <a href="https://globalfishingwatch.org" className="print-only">
        <Logo className={styles.logo} />
      </a>
      <div style={{ position: 'fixed', zIndex: 1 }}>
        {showStats && <FpsView top="0" right="8rem" bottom="auto" left="auto" />}
        {/* If we need a memory plot we need to find a new one, this one no longer works  */}
        {/* {showStats && <MemoryStatsComponent corner="topRight" />} */}
      </div>
      <ErrorBoundary>
        <SplitView
          isOpen={sidebarOpen && !isMapDrawing}
          showToggle={isWorkspaceLocation || vesselLocation}
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
          showAsideLabel={getSidebarName()}
          showMainLabel={t((t) => t.common.map)}
          className={styles.splitContainer}
          asideClassName={styles.aside}
          mainClassName={styles.main}
        />
        {!readOnly && (
          <Menu
            appSelector={ROOT_DOM_ELEMENT}
            bgImage={menuBgImage.src}
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
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </Fragment>
  )
}

export default App
