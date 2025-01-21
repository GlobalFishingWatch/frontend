import React, { Fragment,useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import { Menu, SplitView } from '@globalfishingwatch/ui-components'

import menuBgImage from 'assets/images/menubg.jpg'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { t } from 'features/i18n/i18n'
import Sidebar from 'features/sidebar/Sidebar'
import { fetchUserThunk } from 'features/user/user.slice'
import { useReplaceLoginUrl } from 'routes/routes.hook'

import { useAnalytics } from './analytics.hooks'

import styles from './App.module.css'

const Map = dynamic(() => import(/* webpackChunkName: "Timebar" */ 'features/map/Map'))

declare global {
  interface Window {
    gtag: any
  }
}

const Main = () => {
  return (
    <div className={styles.main}>
      <div className={styles.mapContainer}>
        <Map />
      </div>
    </div>
  )
}

function App(): React.ReactElement<any> {
  useAnalytics()
  useReplaceLoginUrl()
  const dispatch = useAppDispatch()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    dispatch(fetchUserThunk({ guest: false }) as any)
  }, [dispatch])

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  const onToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const asideWidth = '50%'

  return (
    <Fragment>
      <SplitView
        showToggle
        isOpen={sidebarOpen}
        onToggle={onToggle}
        aside={<Sidebar onMenuClick={onMenuClick} />}
        main={<Main />}
        asideWidth={asideWidth}
        showAsideLabel={'TODO'}
        showMainLabel={t('common.map', 'Map')}
        className="split-container"
      />
      <Menu
        appSelector={ROOT_DOM_ELEMENT}
        bgImage={menuBgImage.src}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeLinkId="map-data"
      />
    </Fragment>
  )
}

export default App
