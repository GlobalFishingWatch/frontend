import React, { useState, useCallback, useEffect, Suspense, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
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
import { fetchUserThunk } from 'features/user/user.slice'
import { isUserLogged } from 'features/user/user.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { fetchHighlightWorkspacesThunk } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import useViewport, { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { selectIsAnalyzing } from 'features/analysis/analysis.selectors'
import styles from './App.module.css'
import { selectAnalysisQuery, selectSidebarOpen } from './app.selectors'
import { useAppDispatch } from './app.hooks'

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
  const sidebarOpen = useSelector(selectSidebarOpen)
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const userLogged = useSelector(isUserLogged)
  const locationType = useSelector(selectLocationType)
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const analysisQuery = useSelector(selectAnalysisQuery)
  const workspaceLocation = useSelector(isWorkspaceLocation)
  const isAnalysing = useSelector(selectIsAnalyzing)
  const narrowSidebar = workspaceLocation && !analysisQuery
  const urlViewport = useSelector(selectUrlViewport)

  const fitMapBounds = useMapFitBounds()
  const { setMapCoordinates } = useViewport()

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
    dispatch(fetchUserThunk())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchHighlightWorkspacesThunk())
  }, [dispatch])

  const isHomeLocation = locationType === HOME
  // TODO: decide if we want to redirect when only one category is supported and
  // we want to hide the default workspace
  // const onlyOneCategorySupported = availableCategories?.length === 1
  // const categorySupportedNotFishing =
  //   availableCategories?.[0] === WorkspaceCategories.FishingActivity

  // useEffect(() => {
  //   if (isHomeLocation && onlyOneCategorySupported && !categorySupportedNotFishing) {
  //     dispatchLocation(
  //       WORKSPACES_LIST,
  //       { category: availableCategories?.[0] as WorkspaceCategories },
  //       true
  //     )
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isHomeLocation, onlyOneCategorySupported])

  const homeNeedsFetch = isHomeLocation && currentWorkspaceId !== DEFAULT_WORKSPACE_ID
  const hasWorkspaceIdChanged = locationType === WORKSPACE && currentWorkspaceId !== urlWorkspaceId
  useEffect(() => {
    const fetchWorkspace = async () => {
      const action = await dispatch(fetchWorkspaceThunk(urlWorkspaceId as string))
      if (fetchWorkspaceThunk.fulfilled.match(action)) {
        const newViewport = urlViewport || action.payload?.viewport
        if (newViewport) {
          setMapCoordinates(newViewport)
        }
      }
    }
    if (
      userLogged &&
      workspaceCustomStatus !== AsyncReducerStatus.Loading &&
      (homeNeedsFetch || hasWorkspaceIdChanged)
    ) {
      fetchWorkspace()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogged, homeNeedsFetch, hasWorkspaceIdChanged])

  const onToggle = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }, [dispatchQueryParams, sidebarOpen])

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  return (
    /* Value as null as there is no needed to set a default value but Typescript complains */
    <MapContext.Provider value={null as any}>
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
