import { useState, useCallback, useEffect, Component } from 'react'
import type { AppProps } from 'next/app'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'
import { RecoilRoot } from 'recoil'
import { MapProvider } from 'react-map-gl'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { SplitView } from '@globalfishingwatch/ui-components'
import useMapInstance from 'features/map/map-context.hooks'
import Modals from 'features/modals/Modals'
import styles from './App.module.css'

import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'
import './styles.css'
import './base.css'
import './timebar-settings.css'
import { APP_VERSION } from 'data/config'

const queryClient = new QueryClient()

class ErrorBoundary extends Component<{ children: any }, { hasError: boolean }> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.warn(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

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
  const router = useRouter()
  const map = useMapInstance()

  const onToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
    if (map?.resize) {
      setTimeout(() => {
        map.resize()
      }, 1)
    }
  }, [sidebarOpen, map])

  const asideWidth = router.route === '/analysis' ? '50%' : '34rem'

  useEffect(() => {
    console.log(APP_VERSION)
  }, [])

  return (
    <RecoilRoot>
      <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
        <QueryClientProvider client={queryClient}>
          <MapProvider>
            <ErrorBoundary>
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
            </ErrorBoundary>
          </MapProvider>
        </QueryClientProvider>
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}

export default CustomApp
