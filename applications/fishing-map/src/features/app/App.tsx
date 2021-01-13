import React, { useState, Fragment, useCallback, useMemo, useEffect, Suspense } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Button from '@globalfishingwatch/ui-components/dist/button'
import useDebugMenu from 'features/debug/debug.hooks'
import { MapboxRefProvider } from 'features/map/map.context'
import { isWorkspaceLocation } from 'routes/routes.selectors'
import menuBgImage from 'assets/images/menubg.jpg'
import { useLocationConnect } from 'routes/routes.hook'
import DebugMenu from 'features/debug/DebugMenu'
import Map from 'features/map/Map'
import Timebar from 'features/timebar/Timebar'
import Sidebar from 'features/sidebar/Sidebar'
import { logoutUserThunk, fetchUserThunk } from 'features/user/user.slice'
import { isUserAuthorized, isUserLogged } from 'features/user/user.selectors'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'types'
import { selectSidebarOpen } from './app.selectors'
import styles from './App.module.css'

import '@globalfishingwatch/ui-components/dist/base.css'

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
  const userAuthorized = useSelector(isUserAuthorized)
  const narrowSidebar = useSelector(isWorkspaceLocation)

  const { debugActive, dispatchToggleDebugMenu } = useDebugMenu()

  useEffect(() => {
    dispatch(fetchUserThunk())
  }, [dispatch])

  const onToggle = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }, [dispatchQueryParams, sidebarOpen])

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  const Content = useMemo(() => {
    if (!userLogged) {
      return <Spinner />
    }

    if (!userAuthorized) {
      return (
        <div className={styles.placeholder}>
          <h2>We're sorry but your user is not authorized to use this app yet</h2>
          <Button
            onClick={() => {
              dispatch(logoutUserThunk())
            }}
          >
            Logout
          </Button>
        </div>
      )
    }

    return (
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
    )
  }, [dispatch, narrowSidebar, onMenuClick, onToggle, sidebarOpen, userAuthorized, userLogged])

  return (
    <Fragment>
      {Content}
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
