import React, { memo, useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const logged = useSelector(isUserLogged)

  const onToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Fragment>
      <Login />
      {!logged ? (
        <div className={styles.placeholder}>
          <Spinner />
        </div>
      ) : (
        <SplitView
          isOpen={sidebarOpen}
          onToggle={onToggle}
          aside={<Sidebar />}
          main={<Main />}
          asideWidth="30%"
          className="split-container"
        />
      )}
    </Fragment>
  )
}

export default App
