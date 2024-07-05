import { useState, useCallback, useEffect, useLayoutEffect, Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import MemoryStatsComponent from 'next-react-memory-stats'
import { ToastContainer } from 'react-toastify'
import { FpsView } from 'react-fps'
import { Logo, Menu, SplitView } from '@globalfishingwatch/ui-components'
import { Workspace } from '@globalfishingwatch/api-types'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import {
  selectIsAnySearchLocation,
  selectIsVesselLocation,
  selectIsAnyReportLocation,
  selectIsWorkspaceLocation,
  selectLocationType,
  selectUrlTimeRange,
  selectUrlViewport,
  selectWorkspaceId,
  selectIsMapDrawing,
} from 'routes/routes.selectors'
import menuBgImage from 'assets/images/menubg.jpg'
import { useLocationConnect, useReplaceLoginUrl } from 'routes/routes.hook'
import Sidebar from 'features/sidebar/Sidebar'
import Footer from 'features/footer/Footer'
import {
  selectCurrentWorkspaceId,
  selectWorkspaceCustomStatus,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { fetchUserThunk } from 'features/user/user.slice'
import { fetchHighlightWorkspacesThunk } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectShowTimeComparison } from 'features/reports/reports.selectors'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import {
  HOME,
  WORKSPACE,
  USER,
  WORKSPACES_LIST,
  VESSEL,
  WORKSPACE_VESSEL,
  REPORT,
  WORKSPACE_REPORT,
  SEARCH,
  WORKSPACE_SEARCH,
} from 'routes/routes'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { t } from 'features/i18n/i18n'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { FIT_BOUNDS_REPORT_PADDING, ROOT_DOM_ELEMENT } from 'data/config'
import AppModals from 'features/modals/Modals'
import { useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useSetViewState } from 'features/map/map-viewport.hooks'
import { useDatasetDrag } from 'features/app/drag-dataset.hooks'
import { selectReportAreaBounds } from 'features/app/selectors/app.reports.selector'
import { selectIsUserLogged } from 'features/user/selectors/user.selectors'
import ErrorBoundary from 'features/app/ErrorBoundary'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { useAppDispatch } from './app.hooks'
import { selectReadOnly, selectSidebarOpen } from './selectors/app.selectors'
import { useAnalytics } from './analytics.hooks'
import styles from './App.module.css'
import 'react-toastify/dist/ReactToastify.min.css'

const Map = dynamic(() => import(/* webpackChunkName: "Map" */ 'features/map/Map'))
const Timebar = dynamic(() => import(/* webpackChunkName: "Timebar" */ 'features/timebar/Timebar'))

declare global {
  interface Window {
    gtag: any
  }
}

const Main = () => {
  const workspaceLocation = useSelector(selectIsWorkspaceLocation)
  const locationType = useSelector(selectLocationType)
  const reportLocation = useSelector(selectIsAnyReportLocation)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const isTimeComparisonReport = useSelector(selectShowTimeComparison)
  const isSmallScreen = useSmallScreen()

  const isRouteWithTimebar = locationType === VESSEL
  const isRouteWithMap = locationType !== SEARCH
  const isWorkspacesRouteWithTimebar =
    workspaceLocation ||
    locationType === WORKSPACE_VESSEL ||
    (reportLocation && !isTimeComparisonReport)
  const showTimebar =
    isRouteWithTimebar ||
    (isWorkspacesRouteWithTimebar && workspaceStatus === AsyncReducerStatus.Finished)

  return (
    <Fragment>
      {isRouteWithMap && (
        <div
          className={cx(styles.mapContainer, {
            [styles.withTimebar]: showTimebar,
            [styles.withSmallScreenSwitch]: isSmallScreen,
            [styles.withTimebarAndSmallScreenSwitch]: showTimebar && isSmallScreen,
          })}
        >
          <Map />
        </div>
      )}
      {showTimebar && <Timebar />}

      <Footer />
    </Fragment>
  )
}

const setMobileSafeVH = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

function App() {
  useAnalytics()
  useDatasetDrag()
  useReplaceLoginUrl()
  const dispatch = useAppDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const readOnly = useSelector(selectReadOnly)
  const i18n = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const workspaceLocation = useSelector(selectIsWorkspaceLocation)
  const vesselLocation = useSelector(selectIsVesselLocation)
  const isReportLocation = useSelector(selectIsAnyReportLocation)
  const reportAreaBounds = useSelector(selectReportAreaBounds)
  const isAnySearchLocation = useSelector(selectIsAnySearchLocation)

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  useEffect(() => {
    setMobileSafeVH()
    window.addEventListener('resize', setMobileSafeVH, false)
    return () => window.removeEventListener('resize', setMobileSafeVH)
  }, [])

  const fitMapBounds = useMapFitBounds()
  const setViewState = useSetViewState()
  const { setTimerange } = useTimerangeConnect()

  const locationType = useSelector(selectLocationType)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const userLogged = useSelector(selectIsUserLogged)
  const urlViewport = useSelector(selectUrlViewport)
  const urlTimeRange = useSelector(selectUrlTimeRange)
  const urlWorkspaceId = useSelector(selectWorkspaceId)

  // TODO review this as is needed in analysis and workspace but adds a lot of extra logic here
  // probably better to fetch in both components just checking if the workspaceId is already fetched
  const isHomeLocation = locationType === HOME
  const homeNeedsFetch = isHomeLocation && currentWorkspaceId !== DEFAULT_WORKSPACE_ID
  // Checking only when REPORT entrypoint or WORKSPACE_REPORT when workspace is not loaded
  const locationNeedsFetch =
    locationType === REPORT ||
    (locationType === WORKSPACE_REPORT && currentWorkspaceId !== urlWorkspaceId)
  const hasWorkspaceIdChanged = locationType === WORKSPACE && currentWorkspaceId !== urlWorkspaceId

  useEffect(() => {
    let action: any
    let actionResolved = false
    const fetchWorkspace = async () => {
      action = dispatch(fetchWorkspaceThunk({ workspaceId: urlWorkspaceId as string }))
      const resolvedAction = await action
      if (fetchWorkspaceThunk.fulfilled.match(resolvedAction)) {
        const workspace = resolvedAction.payload as Workspace
        const viewport = urlViewport || workspace?.viewport
        if (viewport && !isReportLocation) {
          setViewState(viewport)
        }
        if (!urlTimeRange && workspace?.startAt && workspace?.endAt) {
          setTimerange({
            start: workspace?.startAt,
            end: workspace?.endAt,
          })
        }
      }
      actionResolved = true
    }
    if (
      userLogged &&
      workspaceCustomStatus !== AsyncReducerStatus.Loading &&
      (homeNeedsFetch || locationNeedsFetch || hasWorkspaceIdChanged)
    ) {
      // TODO Can we arrive in a situation where no workspace is ever loaded?
      // In that case static timerange will need to be set manually
      fetchWorkspace()
    }
    return () => {
      if (action && action.abort !== undefined && !actionResolved) {
        action.abort()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLogged, homeNeedsFetch, locationNeedsFetch, hasWorkspaceIdChanged])

  useLayoutEffect(() => {
    if (isReportLocation) {
      if (reportAreaBounds) {
        fitMapBounds(reportAreaBounds, { padding: FIT_BOUNDS_REPORT_PADDING })
      } else {
        setViewState({ latitude: 0, longitude: 0, zoom: 0 })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(fetchUserThunk({ guest: false }))
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchHighlightWorkspacesThunk())
  }, [dispatch])

  const onToggle = useCallback(() => {
    dispatchQueryParams({ sidebarOpen: !sidebarOpen })
  }, [dispatchQueryParams, sidebarOpen])

  const debugOptions = useSelector(selectDebugOptions)
  const [isReady, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const showStats = isReady && debugOptions.mapStats === true

  const getSidebarName = useCallback(() => {
    if (locationType === USER) return t('user.title', 'User')
    if (locationType === WORKSPACES_LIST) return t('workspace.title_other', 'Workspaces')
    if (locationType === SEARCH || locationType === WORKSPACE_SEARCH)
      return t('search.title', 'Search')
    if (locationType === VESSEL || locationType === WORKSPACE_VESSEL)
      return t('vessel.title', 'Vessel profile')
    if (isReportLocation) return t('analysis.title', 'Analysis')
    return t('common.layerList', 'Layer list')
  }, [locationType, isReportLocation])

  let asideWidth = '50%'
  if (readOnly) {
    asideWidth = isReportLocation ? '45%' : '34rem'
  } else if (isAnySearchLocation) {
    asideWidth = '100%'
  } else if (workspaceLocation) {
    asideWidth = '39rem'
  }

  if (!i18n.ready) {
    return null
  }

  return (
    <Fragment>
      <a href="https://globalfishingwatch.org" className="print-only">
        <Logo className={styles.logo} />
      </a>
      <div style={{ position: 'fixed', zIndex: 1 }}>
        {showStats && <FpsView top="0" right="8rem" bottom="auto" left="auto" />}
        {showStats && <MemoryStatsComponent corner="topRight" />}
      </div>
      <ErrorBoundary>
        <SplitView
          isOpen={sidebarOpen && !isMapDrawing}
          showToggle={workspaceLocation || vesselLocation}
          onToggle={onToggle}
          aside={<Sidebar onMenuClick={onMenuClick} />}
          main={<Main />}
          asideWidth={asideWidth}
          showAsideLabel={getSidebarName()}
          showMainLabel={t('common.map', 'Map')}
          className={styles.splitContainer}
          asideClassName={styles.aside}
          mainClassName={styles.main}
        />
        {!readOnly && (
          <Menu
            appSelector={ROOT_DOM_ELEMENT}
            bgImage={menuBgImage.src}
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            activeLinkId="map-data"
          />
        )}
        <AppModals />
        <ToastContainer
          position="top-center"
          className={styles.toastContainer}
          closeButton={false}
        />
      </ErrorBoundary>
    </Fragment>
  )
}

export default App
