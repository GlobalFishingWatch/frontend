import React, { memo, useState, Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { MapboxRefProvider } from 'features/map/map.context'
import { fetchWorkspaceThunk, selectWorkspaceStatus } from 'features/workspace/workspace.slice'
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
  const logged = useSelector(isUserLogged)
  const workspaceStatus = useSelector(selectWorkspaceStatus)

  const onToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    if (logged) {
      dispatch(fetchWorkspaceThunk())
    }
  }, [dispatch, logged])

  return (
    <Fragment>
      <Login />
      {!logged || workspaceStatus !== 'finished' ? (
        <div className={styles.placeholder}>
          <Spinner />
        </div>
      ) : (
        <MapboxRefProvider>
          <SplitView
            isOpen={sidebarOpen}
            onToggle={onToggle}
            aside={<Sidebar />}
            main={<Main />}
            asideWidth="32rem"
            className="split-container"
          />
        </MapboxRefProvider>
      )}
    </Fragment>
  )
}

export default App
