import React, { memo, Fragment, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import { useLocationConnect } from 'routes/routes.hook'
import { WORKSPACE_EDITOR } from 'routes/routes'
import { useAOIConnect } from 'features/areas-of-interest/areas-of-interest.hook'
import { useWorkspacesConnect } from 'features/workspaces/workspaces.hook'
import Login from '../user/Login'
import Modal from '../modal/Modal'
import Map from '../map/Map'
import Timebar from '../timebar/Timebar'
import Sidebar from '../sidebar/Sidebar'
import { isUserLogged } from '../user/user.slice'
import { toggleMenu, isMenuOpen, isSidebarOpen, toggleSidebar } from './app.slice'
import styles from './App.module.css'
import '@globalfishingwatch/ui-components/dist/base.css'

const Main = memo(() => {
  const { location } = useLocationConnect()
  return (
    <div className={styles.main}>
      <Map />
      {location.type === WORKSPACE_EDITOR && <Timebar />}
    </div>
  )
})

function App(): React.ReactElement {
  const menuOpen = useSelector(isMenuOpen)
  const sidebarOpen = useSelector(isSidebarOpen)
  const logged = useSelector(isUserLogged)
  const dispatch = useDispatch()

  const { fetchAOI } = useAOIConnect()
  const { fetchWorkspaces } = useWorkspacesConnect()
  useEffect(() => {
    fetchAOI()
    fetchWorkspaces()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onToggleMenu = useCallback(() => {
    dispatch(toggleMenu())
  }, [dispatch])

  const onToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar())
  }, [dispatch])

  return (
    <Fragment>
      <Login />
      {!logged ? (
        <div className={styles.placeholder}>Loading</div>
      ) : (
        <SplitView
          isOpen={sidebarOpen}
          onToggle={onToggleSidebar}
          aside={<Sidebar />}
          main={<Main />}
          asideWidth="50%"
          className="split-container"
        />
      )}
      <Modal />
      <Menu isOpen={menuOpen} onClose={onToggleMenu} activeLinkId="map-data">
        Menu toggle
      </Menu>
    </Fragment>
  )
}

export default App
