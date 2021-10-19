import React, { lazy, useState, useCallback, useEffect, Suspense, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
// import RecoilizeDebugger from 'recoilize'
import { Menu, SplitView, Modal } from '@globalfishingwatch/ui-components'
import { MapContext } from 'features/map/map-context.hooks'
import useDebugMenu from 'features/debug/debug.hooks'
import useEditorMenu from 'features/editor/editor.hooks'
import {
  isWorkspaceLocation,
  selectLocationCategory,
  selectLocationType,
  selectUrlTimeRange,
  selectUrlViewport,
  selectWorkspaceId,
} from 'routes/routes.selectors'
import menuBgImage from 'assets/images/menubg.jpg'
import { useLocationConnect, useReplaceLoginUrl } from 'routes/routes.hook'
import DebugMenu from 'features/debug/DebugMenu'
import EditorMenu from 'features/editor/EditorMenu'
import Sidebar from 'features/sidebar/Sidebar'
import Footer from 'features/footer/Footer'
import {
  selectCurrentWorkspaceId,
  selectWorkspaceCustomStatus,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { fetchUserThunk, isGFWUser } from 'features/user/user.slice'
import { fetchHighlightWorkspacesThunk } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import useViewport, { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { selectIsAnalyzing } from 'features/analysis/analysis.selectors'
import { isUserLogged } from 'features/user/user.selectors'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import { HOME, WORKSPACE, USER, WORKSPACES_LIST } from 'routes/routes'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import DownloadActivityModal from 'features/download/DownloadActivityModal'
import DownloadTrackModal from 'features/download/DownloadTrackModal'
import { t } from 'features/i18n/i18n'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import Welcome, { DISABLE_WELCOME_POPUP } from 'features/welcome/Welcome'
import useLocalStorage from 'hooks/use-local-storage'
import { useAppDispatch } from './app.hooks'
import { selectAnalysisQuery, selectReadOnly, selectSidebarOpen } from './app.selectors'
import styles from './App.module.css'
import { useAnalytics } from './analytics.hooks'

const Map = lazy(() => import(/* webpackChunkName: "Map" */ 'features/map/Map'))
const Timebar = lazy(() => import(/* webpackChunkName: "Timebar" */ 'features/timebar/Timebar'))

/* Using any to avoid Typescript complaining about the value */
const MapContextProvider: any = MapContext.Provider

declare global {
  interface Window {
    gtag: any
  }
}

const Main = () => {
  const workspaceLocation = useSelector(isWorkspaceLocation)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  return (
    <div className={styles.main}>
      <Map />
      {workspaceLocation && workspaceStatus === AsyncReducerStatus.Finished && <Timebar />}
      <Footer />
    </div>
  )
}

const MARINE_MANAGER_LAST_VISIT = 'MarineManagerLastVisit'
const isFirstTimeVisit = !localStorage.getItem(MARINE_MANAGER_LAST_VISIT)

function App(): React.ReactElement {
  useAnalytics()
  useReplaceLoginUrl()
  const dispatch = useAppDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const readOnly = useSelector(selectReadOnly)
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const analysisQuery = useSelector(selectAnalysisQuery)
  const workspaceLocation = useSelector(isWorkspaceLocation)
  const isAnalysing = useSelector(selectIsAnalyzing)
  const gfwUser = useSelector(isGFWUser)
  const narrowSidebar = workspaceLocation && !analysisQuery
  const { debugActive, dispatchToggleDebugMenu } = useDebugMenu()
  const { editorActive, dispatchToggleEditorMenu } = useEditorMenu()

  const locationIsMarineManager =
    useSelector(selectLocationCategory) === WorkspaceCategories.MarineManager

  const [disabledWelcomePopup] = useLocalStorage(DISABLE_WELCOME_POPUP, false)

  const [welcomePopupOpen, setWelcomePopupOpen] = useState(
    locationIsMarineManager ? isFirstTimeVisit : !disabledWelcomePopup
  )
  const welcomePopupContentKey = locationIsMarineManager
    ? WorkspaceCategories.MarineManager
    : WorkspaceCategories.FishingActivity

  useEffect(() => {
    if (locationIsMarineManager)
      localStorage.setItem(MARINE_MANAGER_LAST_VISIT, new Date().toISOString())
  }, [locationIsMarineManager])

  const fitMapBounds = useMapFitBounds()
  const { setMapCoordinates } = useViewport()
  const { setTimerange } = useTimerangeConnect()

  const locationType = useSelector(selectLocationType)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const userLogged = useSelector(isUserLogged)
  const urlViewport = useSelector(selectUrlViewport)
  const urlTimeRange = useSelector(selectUrlTimeRange)
  const urlWorkspaceId = useSelector(selectWorkspaceId)

  // TODO review this as is needed in analysis and workspace but adds a lot of extra logic here
  // probably better to fetch in both components just checking if the workspaceId is already fetched
  const isHomeLocation = locationType === HOME
  const homeNeedsFetch = isHomeLocation && currentWorkspaceId !== DEFAULT_WORKSPACE_ID
  const hasWorkspaceIdChanged = locationType === WORKSPACE && currentWorkspaceId !== urlWorkspaceId
  useEffect(() => {
    let action: any
    let actionResolved = false
    const fetchWorkspace = async () => {
      action = dispatch(fetchWorkspaceThunk(urlWorkspaceId as string))
      const resolvedAction = await action
      if (fetchWorkspaceThunk.fulfilled.match(resolvedAction)) {
        if (!urlViewport && resolvedAction.payload?.viewport) {
          setMapCoordinates(resolvedAction.payload.viewport)
        }
        if (!urlTimeRange && resolvedAction.payload?.startAt && resolvedAction.payload?.endAt) {
          setTimerange({
            start: resolvedAction.payload?.startAt,
            end: resolvedAction.payload?.endAt,
          })
        }
      }
      actionResolved = true
    }
    if (
      userLogged &&
      workspaceCustomStatus !== AsyncReducerStatus.Loading &&
      (homeNeedsFetch || hasWorkspaceIdChanged)
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
  }, [userLogged, homeNeedsFetch, hasWorkspaceIdChanged])

  useLayoutEffect(() => {
    if (isAnalysing) {
      if (analysisQuery.bounds) {
        fitMapBounds(analysisQuery.bounds, { padding: 10 })
      } else {
        setMapCoordinates({ latitude: 0, longitude: 0, zoom: 0 })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(fetchUserThunk())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchHighlightWorkspacesThunk())
  }, [dispatch])

  const onToggle = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }, [dispatchQueryParams, sidebarOpen])

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  const getSidebarName = useCallback(() => {
    if (locationType === USER) return t('user.title', 'User')
    if (locationType === WORKSPACES_LIST) return t('workspace.title_other', 'Workspaces')
    if (isAnalysing) return t('analysis.title', 'Analysis')
    return t('common.layerList', 'Layer list')
  }, [isAnalysing, locationType])

  let asideWidth = '50%'
  if (readOnly) {
    asideWidth = analysisQuery ? '45%' : '32rem'
  } else if (narrowSidebar) {
    asideWidth = '37rem'
  }

  return (
    <MapContextProvider>
      {/* <RecoilizeDebugger /> */}
      <Suspense fallback={null}>
        <SplitView
          isOpen={sidebarOpen}
          showToggle={workspaceLocation}
          onToggle={onToggle}
          aside={<Sidebar onMenuClick={onMenuClick} />}
          main={<Main />}
          asideWidth={asideWidth}
          showAsideLabel={getSidebarName()}
          showMainLabel={t('common.map', 'Map')}
          className="split-container"
        />
      </Suspense>
      {!readOnly && (
        <Menu
          bgImage={menuBgImage}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          activeLinkId="map-data"
        />
      )}
      {gfwUser && (
        <Modal title="Secret debug menu 🤖" isOpen={debugActive} onClose={dispatchToggleDebugMenu}>
          <DebugMenu />
        </Modal>
      )}
      {gfwUser && (
        <Modal
          title="Workspace editor 📝"
          isOpen={editorActive}
          shouldCloseOnEsc={false}
          contentClassName={styles.editorModal}
          onClose={dispatchToggleEditorMenu}
        >
          <EditorMenu />
        </Modal>
      )}
      <Suspense fallback={null}>
        <DownloadActivityModal />
      </Suspense>
      <Suspense fallback={null}>
        <DownloadTrackModal />
      </Suspense>
      {welcomePopupOpen && !readOnly && (
        <Suspense fallback={null}>
          <Modal
            header={false}
            isOpen={welcomePopupOpen}
            onClose={() => setWelcomePopupOpen(false)}
          >
            <Welcome
              contentKey={welcomePopupContentKey}
              showDisableCheckbox={!locationIsMarineManager}
            />
          </Modal>
        </Suspense>
      )}
    </MapContextProvider>
  )
}

export default App
