import { useState, useCallback, Fragment, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import { SplitView } from '@globalfishingwatch/ui-components'
import Sidebar from 'features/sidebar/Sidebar'
import { t } from 'features/i18n/i18n'
import useMapInstance from 'features/map/map-context.hooks'
import styles from './App.module.css'

const Map = dynamic(() => import(/* webpackChunkName: "Timebar" */ 'features/map/Map'))
const Timebar = dynamic(() => import(/* webpackChunkName: "Timebar" */ 'features/timebar/Timebar'))

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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const map = useMapInstance()

  const onToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  useEffect(() => {
    if (map?.resize) {
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
