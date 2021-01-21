import React, { useState, Fragment, useCallback, useEffect, Suspense } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import useDebugMenu from 'features/debug/debug.hooks'
import { MapboxRefProvider } from 'features/map/map.context'
import { isWorkspaceLocation, selectLocationType, selectWorkspaceId } from 'routes/routes.selectors'
import menuBgImage from 'assets/images/menubg.jpg'
import { useLocationConnect } from 'routes/routes.hook'
import DebugMenu from 'features/debug/DebugMenu'
import Map from 'features/map/Map'
import Timebar from 'features/timebar/Timebar'
import Sidebar from 'features/sidebar/Sidebar'
import {
  selectCurrentWorkspaceId,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'types'
import { fetchUserThunk } from 'features/user/user.slice'
import { isUserLogged } from 'features/user/user.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import styles from './App.module.css'
import { selectSidebarOpen } from './app.selectors'

const Main = () => {
  const workspaceLocation = useSelector(isWorkspaceLocation)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  return (
    <div className={styles.main}>
      <Map />
      {workspaceLocation && workspaceStatus === AsyncReducerStatus.Finished && <Timebar />}
    </div>
  )
}

function App(): React.ReactElement {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const userLogged = useSelector(isUserLogged)
  const locationType = useSelector(selectLocationType)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceId = useSelector(selectWorkspaceId)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const narrowSidebar = useSelector(isWorkspaceLocation)

  const { debugActive, dispatchToggleDebugMenu } = useDebugMenu()

  useEffect(() => {
    dispatch(fetchUserThunk())
  }, [dispatch])

  useEffect(() => {
    if (userLogged) {
      if (
        (locationType === HOME && workspaceStatus !== AsyncReducerStatus.Finished) ||
        (locationType === WORKSPACE && currentWorkspaceId !== workspaceId)
      ) {
        dispatch(fetchWorkspaceThunk(workspaceId as string))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogged, workspaceId])

  const onToggle = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }, [dispatchQueryParams, sidebarOpen])

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  return (
    <Fragment>
      <MapboxRefProvider>
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
      </MapboxRefProvider>
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
    </Fragment>
  )
}

export default App
