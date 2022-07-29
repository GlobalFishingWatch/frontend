import { useState, useCallback, Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import { Menu, SplitView } from '@globalfishingwatch/ui-components'
import { useLocationConnect } from 'routes/routes.hook'
import Sidebar from 'features/sidebar/Sidebar'
import { t } from 'features/i18n/i18n'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { selectSidebarOpen } from 'routes/routes.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import styles from './App.module.css'

const Map = dynamic(() => import(/* webpackChunkName: "Timebar" */ 'features/map/Map'))
const Timebar = dynamic(() => import(/* webpackChunkName: "Timebar" */ 'features/timebar/Timebar'))

declare global {
  interface Window {
    gtag: any
  }
}

export const COLOR_PRIMARY_BLUE =
  (typeof window !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary-blue')) ||
  'rgb(22, 63, 137)'
export const COLOR_GRADIENT =
  (typeof window !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-gradient')) ||
  'rgb(229, 240, 242)'

const Main = () => {
  return (
    <div className={styles.main}>
      <div className={styles.mapContainer}>
        <Map />
      </div>
      <Timebar />
    </div>
  )
}

function App(): React.ReactElement {
  const i18n = useTranslation()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const map = useMapInstance()
  const { dispatchQueryParams } = useLocationConnect()

  const onToggle = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }, [dispatchQueryParams, sidebarOpen])

  useEffect(() => {
    if (map) {
      map.resize()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarOpen])

  const asideWidth = '50%'

  if (!i18n.ready) {
    return null
  }

  return (
    <Fragment>
      <SplitView
        showToggle
        isOpen={sidebarOpen}
        onToggle={onToggle}
        aside={<Sidebar />}
        main={<Main />}
        asideWidth={asideWidth}
        showAsideLabel={'TODO'}
        showMainLabel={t('common.map', 'Map')}
        className="split-container"
      />
    </Fragment>
  )
}

export default App
