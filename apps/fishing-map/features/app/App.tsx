import { Fragment, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { FpsView } from 'react-fps'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import type { Workspace } from '@globalfishingwatch/api-types'
import { Logo, Menu, SplitView } from '@globalfishingwatch/ui-components'

import menuBgImage from 'assets/images/menubg.jpg'
import { FIT_BOUNDS_REPORT_PADDING, ROOT_DOM_ELEMENT } from 'data/config'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { useDatasetDrag } from 'features/app/drag-dataset.hooks'
import ErrorBoundary from 'features/app/ErrorBoundary'
import { useFeatureFlagsToast } from 'features/debug/debug.hooks'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { t } from 'features/i18n/i18n'
import { useUserLanguageUpdate } from 'features/i18n/i18n.hooks'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import AppModals from 'features/modals/Modals'
import { selectScreenshotModalOpen } from 'features/modals/modals.slice'
import { selectReportAreaBounds } from 'features/reports/reports.config.selectors'
import Sidebar from 'features/sidebar/Sidebar'
import { useFetchTrackCorrections } from 'features/track-correction/track-correction.hooks'
import { selectTrackCorrectionOpen } from 'features/track-correction/track-selection.selectors'
import { selectIsUserLogged } from 'features/user/selectors/user.selectors'
import { fetchUserThunk } from 'features/user/user.slice'
import { useFitWorkspaceBounds } from 'features/workspace/workspace.hook'
import {
  isWorkspacePasswordProtected,
  selectCurrentWorkspaceId,
  selectWorkspaceCustomStatus,
} from 'features/workspace/workspace.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import {
  HOME,
  PORT_REPORT,
  REPORT,
  SEARCH,
  USER,
  VESSEL,
  VESSEL_GROUP_REPORT,
  WORKSPACE,
  WORKSPACE_REPORT,
  WORKSPACE_SEARCH,
  WORKSPACE_VESSEL,
  WORKSPACES_LIST,
} from 'routes/routes'
import { useBeforeUnload, useLocationConnect, useReplaceLoginUrl } from 'routes/routes.hook'
import {
  selectIsAnyAreaReportLocation,
  selectIsAnySearchLocation,
  selectIsAnyVesselLocation,
  selectIsMapDrawing,
  selectIsVesselGroupReportLocation,
  selectIsVesselLocation,
  selectIsWorkspaceLocation,
  selectLocationType,
  selectWorkspaceId,
} from 'routes/routes.selectors'
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
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const vesselLocation = useSelector(selectIsVesselLocation)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const reportAreaBounds = useSelector(selectReportAreaBounds)
  const isAnySearchLocation = useSelector(selectIsAnySearchLocation)
  const isAnyVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  const fitMapBounds = useMapFitBounds()
  const setMapCoordinates = useSetMapCoordinates()

  const locationType = useSelector(selectLocationType)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const userLogged = useSelector(selectIsUserLogged)
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const fitWorkspaceBounds = useFitWorkspaceBounds()
  const isPrinting = useSelector(selectScreenshotModalOpen)

  // TODO review this as is needed in analysis and workspace but adds a lot of extra logic here
  // probably better to fetch in both components just checking if the workspaceId is already fetched
  const isHomeLocation = locationType === HOME
  const homeNeedsFetch = isHomeLocation && currentWorkspaceId !== DEFAULT_WORKSPACE_ID
  // Checking only when REPORT entrypoint or WORKSPACE_REPORT when workspace is not loaded
  const locationNeedsFetch =
    locationType === REPORT ||
    locationType === VESSEL_GROUP_REPORT ||
    locationType === PORT_REPORT ||
    ((locationType === WORKSPACE_REPORT || isAnyVesselLocation) &&
      currentWorkspaceId !== urlWorkspaceId)
  const hasWorkspaceIdChanged = locationType === WORKSPACE && currentWorkspaceId !== urlWorkspaceId

  useEffect(() => {
    let action: any
    let actionResolved = false
    const fetchWorkspace = async () => {
      action = dispatch(fetchWorkspaceThunk({ workspaceId: urlWorkspaceId as string }))
      const resolvedAction = await action
      if (fetchWorkspaceThunk.fulfilled.match(resolvedAction)) {
        const workspace = resolvedAction.payload as Workspace
        if (!isVesselGroupReportLocation && !isWorkspacePasswordProtected(workspace)) {
          fitWorkspaceBounds(workspace)
        }
      }
      actionResolved = true
    }
    if (
      userLogged &&
      workspaceCustomStatus !== AsyncReducerStatus.Loading &&
      (homeNeedsFetch || locationNeedsFetch || hasWorkspaceIdChanged)
    ) {
      // TODO Can we arrive in a situation where no workspace is ever loaded?
      // In that case static timerange will need to be set manually
      fetchWorkspace()
    }
    return () => {
      if (action && action.abort !== undefined && !actionResolved) {
        action.abort()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogged, homeNeedsFetch, locationNeedsFetch, hasWorkspaceIdChanged])

  useLayoutEffect(() => {
    if (isAreaReportLocation) {
      if (reportAreaBounds) {
        fitMapBounds(reportAreaBounds, { padding: FIT_BOUNDS_REPORT_PADDING })
      } else {
        setMapCoordinates({ latitude: 0, longitude: 0, zoom: 0 })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(fetchUserThunk({ guest: false }))
  }, [dispatch])

  const onToggle = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }, [dispatchQueryParams, sidebarOpen])

  const debugOptions = useSelector(selectDebugOptions)
  const [isReady, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const showStats = isReady && debugOptions.mapStats === true

  const getSidebarName = useCallback(() => {
    if (locationType === USER) return t('user.title')
    if (locationType === WORKSPACES_LIST) return t('workspace.title_other')
    if (locationType === SEARCH || locationType === WORKSPACE_SEARCH) return t('search.title')
    if (locationType === VESSEL || locationType === WORKSPACE_VESSEL) return t('vessel.title')
    if (isAreaReportLocation) return t('analysis.title')
    return t('common.layerList')
  }, [locationType, isAreaReportLocation])

  let asideWidth = '50%'
  if (readOnly) {
    asideWidth = isAreaReportLocation ? '45%' : '34rem'
  } else if (isAnySearchLocation) {
    asideWidth = '100%'
  } else if (isWorkspaceLocation) {
    asideWidth = isPrinting ? '34rem' : '39rem'
  }

  if (!i18n.ready) {
    return null
  }

  return (
    <Fragment>
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
          aside={<Sidebar onMenuClick={onMenuClick} />}
          main={<Main />}
          asideWidth={asideWidth}
          showAsideLabel={getSidebarName()}
          showMainLabel={t('common.map')}
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
    </Fragment>
  )
}

export default App
