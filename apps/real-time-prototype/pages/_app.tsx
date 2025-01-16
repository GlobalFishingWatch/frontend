import { Component, useCallback, useEffect,useState } from 'react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { RecoilRoot } from 'recoil'
import { RecoilURLSyncJSONNext } from 'recoil-sync-next'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { redirectToLogin, useGFWLogin } from '@globalfishingwatch/react-hooks'
import { SplitView } from '@globalfishingwatch/ui-components'

import { API_BASE } from 'data/config'

import './styles.css'
import './base.css'
import styles from './App.module.css'

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

function CustomApp({ Component, pageProps }: AppProps) {
  const [lastUpdate, setLastUpdate] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showLatestPositions, setShowLatestPositions] = useState(true)

  const login = useGFWLogin(GFWAPI)
  useEffect(() => {
    if (!login.loading && !login.logged) {
      redirectToLogin()
    }
  }, [login])

  const getLastUpdate = async () => {
    const lastUpdate = await GFWAPI.fetch<{ lastUpdateDate: string }>(
      `${API_BASE}realtime-tracks/last-update?cache=false`
    )
    setLastUpdate(lastUpdate.lastUpdateDate)
  }

  useEffect(() => {
    if (login.logged) {
      getLastUpdate()
    }
  }, [login.logged])

  const onToggle = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const asideWidth = '32rem'
  return (
    <RecoilRoot>
      <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
        <ErrorBoundary>
          <SplitView
            showToggle
            isOpen={sidebarOpen}
            onToggle={onToggle}
            aside={
              login.logged ? (
                <Component
                  {...pageProps}
                  lastUpdate={lastUpdate}
                  showLatestPositions={showLatestPositions}
                  setShowLatestPositions={setShowLatestPositions}
                />
              ) : null
            }
            main={
              login.logged && (
                <div className={styles.main}>
                  <div className={styles.mapContainer}>
                    <Map lastUpdate={lastUpdate} showLatestPositions={showLatestPositions} />
                  </div>
                </div>
              )
            }
            asideWidth={asideWidth}
            showMainLabel="Map"
            className="split-container"
          />
        </ErrorBoundary>
      </RecoilURLSyncJSONNext>
    </RecoilRoot>
  )
}

export default CustomApp
