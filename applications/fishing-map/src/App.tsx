import React, { memo, useState, Fragment, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AsyncReducerStatus } from 'types'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import { MapboxRefProvider } from 'features/map/map.context'
import { fetchWorkspaceThunk, selectWorkspaceStatus } from 'features/workspace/workspace.slice'
import menuBgImage from 'assets/images/menubg.jpg'
import Login from './features/user/Login'
import Map from './features/map/Map'
import Timebar from './features/timebar/Timebar'
import Sidebar from './features/sidebar/Sidebar'
import styles from './App.module.css'
import { isUserLogged } from './features/user/user.slice'

import '@globalfishingwatch/ui-components/dist/base.css'

const Main = memo(() => (
  <div className={styles.main}>
    <Map />
    <Timebar />
  </div>
))

function App(): React.ReactElement {
  const dispatch = useDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const logged = useSelector(isUserLogged)
  const workspaceStatus = useSelector(selectWorkspaceStatus)

  const onToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  useEffect(() => {
    if (logged) {
      dispatch(fetchWorkspaceThunk())
    }
  }, [dispatch, logged])

  return (
    <Fragment>
      <Login />
      {!logged || workspaceStatus !== AsyncReducerStatus.Finished ? (
        <div className={styles.placeholder}>
          <Spinner />
        </div>
      ) : (
        <MapboxRefProvider>
          <SplitView
            isOpen={sidebarOpen}
            onToggle={onToggle}
            aside={<Sidebar onMenuClick={onMenuClick} />}
            main={<Main />}
            asideWidth="32rem"
            className="split-container"
          />
        </MapboxRefProvider>
      )}
      <Menu
        bgImage={menuBgImage}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeLinkId="map-data"
      />
    </Fragment>
  )
}

export default App
