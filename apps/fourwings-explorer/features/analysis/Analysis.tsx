import { useState, useCallback, Fragment } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { SplitView } from '@globalfishingwatch/ui-components'
import useMapInstance from 'features/map/map-context.hooks'
import Modals from 'features/modals/Modals'
import styles from './Analysis.module.css'

const Map = dynamic(() => import(/* webpackChunkName: "Timebar" */ 'features/map/Map'))

const Sidebar = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <div className={styles.main}>
      <div className={styles.mapContainer}>
        <h2>Analysis for: {id}</h2>
      </div>
    </div>
  )
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

  const asideWidth = '32rem'

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
