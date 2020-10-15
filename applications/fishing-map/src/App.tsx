import React, { memo, useState, Fragment, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import { AsyncReducerStatus } from 'types'
import { MapboxRefProvider } from 'features/map/map.context'
import { fetchWorkspaceThunk, selectWorkspaceStatus } from 'features/workspace/workspace.slice'
import { selectDataviewsResourceQueries } from 'features/workspace/workspace.selectors'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import menuBgImage from 'assets/images/menubg.jpg'
import { selectActive, toggleDebugMenu } from 'features/debug/debug.slice'
import DebugMenu from './features/debug/DebugMenu'
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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'd') {
        dispatch(toggleDebugMenu())
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [dispatch])
  const debugActive = useSelector(selectActive)

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

  const resourceQueries = useSelector(selectDataviewsResourceQueries)
  useEffect(() => {
    if (resourceQueries) {
      resourceQueries.forEach((resourceQuery) => {
        dispatch(fetchResourceThunk(resourceQuery))
      })
    }
  }, [dispatch, resourceQueries])

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
      {debugActive && <DebugMenu />}
    </Fragment>
  )
}

export default App
