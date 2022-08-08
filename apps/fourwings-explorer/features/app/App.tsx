import { useState, useCallback, Fragment } from 'react'
import dynamic from 'next/dynamic'
import { SplitView } from '@globalfishingwatch/ui-components'
import Sidebar from 'features/sidebar/Sidebar'
import useMapInstance from 'features/map/map-context.hooks'
import Modals from 'features/modals/Modals'
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const map = useMapInstance()

  const onToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
    if (map?.resize) {
      setTimeout(() => {
        map.resize()
      }, 1)
    }
  }, [sidebarOpen, map])

  const asideWidth = '50%'

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
        showMainLabel="Map"
        className="split-container"
      />
      <Modals />
    </Fragment>
  )
}

export default App
