import React, { lazy, useState, useMemo, useCallback, Suspense, useEffect, useRef } from 'react'
import cx from 'classnames'
import Split from 'react-split'
import Map from 'components/map/map.container'
import Loader from 'components/loader/loader'
import { useSmallScreen } from 'hooks/screen.hooks'
import { ReactComponent as IconMap } from 'assets/icons/map.svg'
import { ReactComponent as IconSidebar } from 'assets/icons/list.svg'
import styles from './home.module.css'

type viewState = 'sidebar' | 'map'

const SidebarComponent = (hasVessel: boolean) => {
  const path = hasVessel ? 'vessel/sidebar-vessel.container' : 'home/sidebar-home.container'
  return lazy(() => import(`../../components/sidebar/${path}`))
}

const isSidebarSmall = (size: number) => (window.innerWidth / 100) * size <= 500

interface HomeProps {
  hasVessel: boolean
  datasetLoaded: boolean
  datasetNotFound: boolean
  setLatestDataset: () => void
  setSidebarSize: (size: number) => void
}

const HomePage: React.FC<HomeProps> = (props): React.ReactElement => {
  const { hasVessel, datasetNotFound, setLatestDataset, datasetLoaded, setSidebarSize } = props
  const [view, setView] = useState<viewState>('sidebar')
  const splitRef = useRef<any>()
  const [sidebarIsReady, setSidebarIsReady] = useState<boolean>(false)
  const smallScreen = useSmallScreen()
  const splitSizes = useMemo(() => (hasVessel ? [50, 50] : [34, 66]), [hasVessel])
  const [sidebarType, setSidebarType] = useState<'regular' | 'small'>(
    isSidebarSmall(splitSizes[0]) ? 'small' : 'regular'
  )

  const onSidebarIsReady = useCallback((sizes: any) => {
    setSidebarIsReady(true)
  }, [])

  const handleSidebarResize = useCallback(
    (sizes: any) => {
      const size = splitRef.current?.split?.getSizes()[0]
      const type = isSidebarSmall(size) ? 'small' : 'regular'
      setSidebarType(type)
      setSidebarSize(size)
    },
    [setSidebarSize]
  )

  useEffect(() => {
    handleSidebarResize(splitSizes)
  }, [handleSidebarResize, splitSizes])

  const ComponentSidebar = useMemo(() => {
    return SidebarComponent(hasVessel)
  }, [hasVessel])

  const switchView = useCallback(() => {
    setView(view === 'sidebar' ? 'map' : 'sidebar')
  }, [view])

  const content = useMemo(() => {
    return [
      (!smallScreen || view === 'sidebar') && (
        <section
          key="sidebar"
          className={cx(styles.sidebarContainer, { [styles.sidebarWide]: hasVessel })}
        >
          <Suspense fallback={<Loader />}>
            <ComponentSidebar sidebarSize={sidebarType} onReady={onSidebarIsReady} />
          </Suspense>
        </section>
      ),
      (!smallScreen || view === 'map') && (
        <aside key="map" className={styles.mapContainer}>
          {datasetLoaded && sidebarIsReady && <Map />}
        </aside>
      ),
    ]
  }, [datasetLoaded, hasVessel, onSidebarIsReady, sidebarIsReady, sidebarType, smallScreen, view])

  if (datasetNotFound) {
    return (
      <main className={styles.errorContainer}>
        <h2>The requested dataset was not found</h2>
        <button className={styles.errorButton} onClick={setLatestDataset}>
          Use latest available
        </button>
      </main>
    )
  }

  return (
    <main>
      {smallScreen ? (
        content
      ) : (
        <Split
          ref={splitRef}
          className={styles.splitContainer}
          sizes={splitSizes}
          minSize={450}
          gutterSize={0}
          onDragEnd={handleSidebarResize}
        >
          {content}
        </Split>
      )}
      {smallScreen && (
        <button
          data-cy="mobile-content-switcher"
          onClick={switchView}
          className={cx(styles.toggleView, { [styles.inverted]: view === 'map' })}
          title={view === 'sidebar' ? 'Show map' : 'Close map'}
        >
          {view === 'sidebar' ? <IconMap /> : <IconSidebar />}
        </button>
      )}
    </main>
  )
}

export default HomePage
