import React, { Suspense, lazy, useCallback, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import { useDatasetsAPI } from 'features/datasets/datasets.hook'
import Login from 'features/user/Login'
import Modal from 'features/modal/Modal'
import { MapboxRefProvider } from 'features/map/map.context'
import SidebarHeader from 'common/SidebarHeader'
import { isWorkspaceEditorPage } from 'routes/routes.selectors'
import menuBgImage from 'assets/images/menubg.jpg'
import { toggleMenu, isMenuOpen, isSidebarOpen, toggleSidebar } from './app.slice'
import styles from './App.module.css'
import '@globalfishingwatch/ui-components/dist/base.css'

const Map = lazy(() => import('features/map/Map'))
const Timebar = lazy(() => import('features/timebar/Timebar'))
const Sidebar = lazy(() => import('features/sidebar/Sidebar'))

function Main() {
  const isWorkspaceEditor = useSelector(isWorkspaceEditorPage)
  return (
    <Suspense fallback={null}>
      <div className={styles.main}>
        <Map />
        {isWorkspaceEditor && <Timebar />}
      </div>
    </Suspense>
  )
}

function SidebarWrapper() {
  return (
    <Suspense fallback={null}>
      <SidebarHeader />
      <Sidebar />
    </Suspense>
  )
}

function App(): React.ReactElement {
  const dispatch = useDispatch()
  const menuOpen = useSelector(isMenuOpen)
  const sidebarOpen = useSelector(isSidebarOpen)
  const { fetchDatasets } = useDatasetsAPI()

  useEffect(() => {
    fetchDatasets()
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
      <MapboxRefProvider>
        <SplitView
          isOpen={sidebarOpen}
          onToggle={onToggleSidebar}
          aside={<SidebarWrapper />}
          main={<Main />}
          asideWidth="50%"
          className="split-container"
        />
      </MapboxRefProvider>
      <Modal />
      <Menu
        bgImage={menuBgImage}
        isOpen={menuOpen}
        onClose={onToggleMenu}
        activeLinkId="map-data"
      />
    </Fragment>
  )
}

export default App
