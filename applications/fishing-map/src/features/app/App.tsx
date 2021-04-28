import React, { useState, useCallback, useEffect, Suspense, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
// import RecoilizeDebugger from 'recoilize'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import { MapContext } from 'features/map/map-context.hooks'
import useDebugMenu from 'features/debug/debug.hooks'
import {
  isWorkspaceLocation,
  selectLocationType,
  selectUrlViewport,
  selectWorkspaceId,
} from 'routes/routes.selectors'
import menuBgImage from 'assets/images/menubg.jpg'
import { useLocationConnect } from 'routes/routes.hook'
import DebugMenu from 'features/debug/DebugMenu'
import Sidebar from 'features/sidebar/Sidebar'
import Map from 'features/map/Map'
import Timebar from 'features/timebar/Timebar'
import Footer from 'features/footer/Footer'
import {
  selectCurrentWorkspaceId,
  selectWorkspaceCustomStatus,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { fetchUserThunk, selectUserData } from 'features/user/user.slice'
import { fetchHighlightWorkspacesThunk } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import useViewport, { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { selectIsAnalyzing } from 'features/analysis/analysis.selectors'
import { isUserLogged } from 'features/user/user.selectors'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { HOME, WORKSPACE } from 'routes/routes'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { useAppDispatch } from './app.hooks'
import { selectAnalysisQuery, selectSidebarOpen } from './app.selectors'
import styles from './App.module.css'

declare global {
  interface Window {
    gtag: any
  }
}

const GOOGLE_UNIVERSAL_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_UNIVERSAL_ANALYTICS_ID

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

function App(): React.ReactElement {
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const sidebarOpen = useSelector(selectSidebarOpen)
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const analysisQuery = useSelector(selectAnalysisQuery)
  const workspaceLocation = useSelector(isWorkspaceLocation)
  const isAnalysing = useSelector(selectIsAnalyzing)
  const narrowSidebar = workspaceLocation && !analysisQuery

  const fitMapBounds = useMapFitBounds()
  const { setMapCoordinates } = useViewport()

  const locationType = useSelector(selectLocationType)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const userLogged = useSelector(isUserLogged)
  const urlViewport = useSelector(selectUrlViewport)
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
      }
      actionResolved = true
    }
    if (
      userLogged &&
      workspaceCustomStatus !== AsyncReducerStatus.Loading &&
      (homeNeedsFetch || hasWorkspaceIdChanged)
    ) {
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

  const { debugActive, dispatchToggleDebugMenu } = useDebugMenu()

  useEffect(() => {
    if (userData && GOOGLE_UNIVERSAL_ANALYTICS_ID && window.gtag) {
      window.gtag('config', GOOGLE_UNIVERSAL_ANALYTICS_ID, {
        user_id: userData.id,
        custom_map: {
          dimension1: 'userId',
          dimension3: 'userGroup',
          dimension4: 'userOrgType',
          dimension5: 'userOrganization',
          dimension6: 'userCountry',
          dimension7: 'userLanguage',
        },
      })
      window.gtag('event', 'login', {
        userId: userData.id,
        userGroup: userData.groups,
        userOrgType: userData.organizationType,
        userOrganization: userData.organization,
        userCountry: userData.country,
        userLanguage: userData.language,
      })
    }
  }, [userData])

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

  return (
    /* Value as null as there is no needed to set a default value but Typescript complains */
    <MapContext.Provider value={null as any}>
      {/* <RecoilizeDebugger /> */}
      <Suspense fallback={null}>
        <SplitView
          isOpen={sidebarOpen}
          onToggle={onToggle}
          aside={<Sidebar onMenuClick={onMenuClick} />}
          main={<Main />}
          asideWidth={narrowSidebar ? '37rem' : '50%'}
          className="split-container"
        />
      </Suspense>
      <Menu
        bgImage={menuBgImage}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeLinkId="map-data"
      />
      <Modal
        title="Secret debug menu 🤖"
        isOpen={debugActive}
        onClose={() => dispatchToggleDebugMenu()}
      >
        <DebugMenu />
      </Modal>
    </MapContext.Provider>
  )
}

export default App
