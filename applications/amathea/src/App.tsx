import React, { memo, useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import SplitView from '@globalfishingwatch/ui-components/dist/split-view'
import Menu from '@globalfishingwatch/ui-components/dist/menu'
import Login from './features/user/Login'
import Modal from './features/modal/Modal'
import Map from './features/map/Map'
// import Timebar from './features/timebar/Timebar'
import Sidebar from './features/sidebar/Sidebar'
import styles from './App.module.css'
import { isUserLogged } from './features/user/user.slice'

import '@globalfishingwatch/ui-components/dist/base.css'

const Main = memo(() => (
  <div className={styles.main}>
    <Map />
    {/* <Timebar /> */}
  </div>
))

function App(): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const logged = useSelector(isUserLogged)

  // const onToggleMenu = () => {
  //   setMenuOpen(!menuOpen)
  // }

  const onToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

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
      <Menu isOpen={menuOpen} onClose={(e) => setMenuOpen(false)} activeLinkId="map-data">
        Menu toggle
      </Menu>
    </Fragment>
  )
}

export default App
