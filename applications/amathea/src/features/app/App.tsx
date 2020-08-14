import React, { Suspense, lazy, memo, Fragment, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import { useUserConnect } from 'features/user/user.hook'
import { useAOIConnect } from 'features/areas-of-interest/areas-of-interest.hook'
import { useDatasetsConnect } from 'features/datasets/datasets.hook'
import Login from 'features/user/Login'
import Modal from 'features/modal/Modal'
import SidebarHeader from 'common/SidebarHeader'
import { isWorkspaceEditorPage } from 'routes/routes.selectors'
import { useDataviewsConnect } from 'features/dataviews/dataviews.hook'
import menuBgImage from 'assets/images/menubg.jpg'
import { toggleMenu, isMenuOpen, isSidebarOpen, toggleSidebar } from './app.slice'
import styles from './App.module.css'
import '@globalfishingwatch/ui-components/dist/base.css'

const Map = lazy(() => import('features/map/Map'))
const Timebar = lazy(() => import('features/timebar/Timebar'))
const Sidebar = lazy(() => import('features/sidebar/Sidebar'))
const WorkspaceEditor = lazy(() => import('features/workspace-editor/WorkspaceEditor'))

const Main = memo(() => {
  const isWorkspaceEditor = useSelector(isWorkspaceEditorPage)
  return (
    <Suspense fallback={null}>
      <div className={styles.main}>
        <Map />
        {isWorkspaceEditor && <Timebar />}
      </div>
    </Suspense>
  )
})

const SidebarWrapper = memo(() => {
  const isWorkspaceEditor = useSelector(isWorkspaceEditorPage)
  return (
    <Suspense fallback={null}>
      <SidebarHeader />
      {isWorkspaceEditor ? <WorkspaceEditor /> : <Sidebar />}
    </Suspense>
  )
})

function App(): React.ReactElement {
  const dispatch = useDispatch()
  const menuOpen = useSelector(isMenuOpen)
  const sidebarOpen = useSelector(isSidebarOpen)
  const { logged, status } = useUserConnect()
  const { fetchAOI } = useAOIConnect()
  const { fetchDatasets } = useDatasetsConnect()
  const { fetchDataviews } = useDataviewsConnect()

  useEffect(() => {
    fetchAOI()
    fetchDatasets()
    fetchDataviews()
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
      {status === 'loading' || !logged ? (
        <div className={styles.placeholder}>Loading</div>
      ) : (
        <SplitView
          isOpen={sidebarOpen}
          onToggle={onToggleSidebar}
          aside={<SidebarWrapper />}
          main={<Main />}
          asideWidth="50%"
          className="split-container"
        />
      )}
      <Modal />
      <Menu bgImage={menuBgImage} isOpen={menuOpen} onClose={onToggleMenu} activeLinkId="map-data">
        Menu toggle
      </Menu>
    </Fragment>
  )
}

export default App
