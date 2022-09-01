import { useState, useCallback, Component } from 'react'
import { AppProps } from 'next/app'
import { FpsView } from 'react-fps'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { SplitView } from '@globalfishingwatch/ui-components'
import styles from './App.module.css'

import './styles.css'
import './base.css'
import './timebar-settings.css'

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

  const onToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const asideWidth = '32rem'
  return (
    <RecoilRoot>
      {/* <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}> */}
      <QueryClientProvider client={queryClient}>
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
          {typeof window !== 'undefined' && <FpsView bottom="0" left="0" top="auto" />}
        </ErrorBoundary>
      </QueryClientProvider>
      {/* </RecoilURLSyncJSONNext> */}
    </RecoilRoot>
  )
}

export default CustomApp
