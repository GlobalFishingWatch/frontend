import { AppProps } from 'next/app'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'
import { RecoilRoot } from 'recoil'
import { MapProvider } from 'react-map-gl'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { SplitView } from '@globalfishingwatch/ui-components'
import useMapInstance from 'features/map/map-context.hooks'
import Modals from 'features/modals/Modals'
import styles from './App.module.css'

import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'
import './styles.css'
import './base.css'
import './timebar-settings.css'

const queryClient = new QueryClient()

const Map = dynamic(() => import(/* webpackChunkName: "Map" */ 'features/map/Map'), {
  ssr: false,
})
const Timebar = dynamic(
  () => import(/* webpackChunkName: "Timebar" */ 'features/timebar/Timebar'),
  {
    ssr: false,
  }
)

function CustomApp({ Component, pageProps }: AppProps) {
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
    <RecoilRoot>
      <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
        <QueryClientProvider client={queryClient}>
          <MapProvider>
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
            <Modals />
          </MapProvider>
        </QueryClientProvider>
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}

export default CustomApp
