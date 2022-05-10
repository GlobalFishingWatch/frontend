import React, { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Menu, SplitView } from '@globalfishingwatch/ui-components'
import { MapContext } from 'features/map/map-context.hooks'
import menuBgImage from 'assets/images/menubg.jpg'
import { useReplaceLoginUrl } from 'routes/routes.hook'
import Sidebar from 'features/sidebar/Sidebar'
import { t } from 'features/i18n/i18n'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { fetchUserThunk } from 'features/user/user.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import styles from './App.module.css'
import { useAnalytics } from './analytics.hooks'

const Map = dynamic(() => import(/* webpackChunkName: "Timebar" */ 'features/map/Map'))

/* Using any to avoid Typescript complaining about the value */
const MapContextProvider: any = MapContext.Provider

declare global {
  interface Window {
    gtag: any
  }
}

export const COLOR_PRIMARY_BLUE =
  typeof window !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue('--color-primary-blue')
    : 'rgb(22, 63, 137)'
export const COLOR_GRADIENT =
  typeof window !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue('--color-gradient')
    : 'rgb(229, 240, 242)'

const Main = () => {
  return (
    <div className={styles.main}>
      <div className={styles.mapContainer}>
        <Map />
      </div>
    </div>
  )
}

function App(): React.ReactElement {
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
    <MapContextProvider>
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
    </MapContextProvider>
  )
}

export default App
