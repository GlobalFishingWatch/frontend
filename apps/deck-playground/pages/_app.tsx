import { useState, useCallback, useEffect } from 'react'
import { AppProps } from 'next/app'
import { FpsView } from 'react-fps'
import MemoryStatsComponent from 'next-react-memory-stats'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'
import { RecoilRoot } from 'recoil'
import dynamic from 'next/dynamic'
import { SplitView } from '@globalfishingwatch/ui-components'
import styles from './App.module.css'

import './styles.css'
import './base.css'
import './timebar-settings.css'

const Map = dynamic(() => import(/* webpackChunkName: "Map" */ 'features/map/Map'), {
  ssr: false,
})
const Timebar = dynamic(
  () =>
    import(/* webpackChunkName: "Timebar" */ 'features/timebar/Timebar').then(
      (mod) => mod.default as any
    ),
  {
    ssr: false,
  }
)

function CustomApp({ Component, pageProps }: AppProps) {
  const [showFps, setShowFps] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => setShowFps(true), [])

  const onToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const asideWidth = '32rem'
  return (
    <RecoilRoot>
      <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
        <SplitView
          showToggle
          isOpen={sidebarOpen}
          onToggle={onToggle}
          aside={<Component {...pageProps} />}
          main={
            <div className={styles.main}>
              <div className={styles.mapContainer}>
                <Map />
              </div>
              <Timebar />
            </div>
          }
          asideWidth={asideWidth}
          showMainLabel="Map"
          className="split-container"
        />
        {showFps && <FpsView bottom="0" left="0" top="auto" />}
        {showFps && <MemoryStatsComponent />}
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}

export default CustomApp
