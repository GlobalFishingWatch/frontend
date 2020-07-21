import React, { Suspense, lazy, memo, Fragment, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import { useLocationConnect } from 'routes/routes.hook'
import { WORKSPACE_EDITOR } from 'routes/routes'
import { useUserConnect } from 'features/user/user.hook'
import Login from 'features/user/Login'
import WorkspaceEditor from 'features/workspace-editor/WorkspaceEditor'
import Modal from 'features/modal/Modal'
import Sidebar from 'features/sidebar/Sidebar'
import { toggleMenu, isMenuOpen, isSidebarOpen, toggleSidebar } from './app.slice'
import styles from './App.module.css'
import '@globalfishingwatch/ui-components/dist/base.css'

const Timebar = lazy(() => import('features/timebar/Timebar'))
const Map = lazy(() => import('features/map/Map'))

const Main = memo(() => {
  const { location } = useLocationConnect()
  return (
    <Suspense fallback={null}>
      <div className={styles.main}>
        <Map />
        {location.type === WORKSPACE_EDITOR && <Timebar />}
      </div>
    </Suspense>
  )
})

function App(): React.ReactElement {
  const menuOpen = useSelector(isMenuOpen)
  const sidebarOpen = useSelector(isSidebarOpen)
  const { logged, status } = useUserConnect()
  const dispatch = useDispatch()
  const { location } = useLocationConnect()

  const onToggleMenu = useCallback(() => {
    dispatch(toggleMenu())
  }, [dispatch])

  const onToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar())
  }, [dispatch])

  return (
    <Fragment>
      <Login />
      {status === 'loading' || !logged ? (
        <div className={styles.placeholder}>Loading</div>
      ) : (
        <SplitView
          isOpen={sidebarOpen}
          onToggle={onToggleSidebar}
          aside={location.type === WORKSPACE_EDITOR ? <WorkspaceEditor /> : <Sidebar />}
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
