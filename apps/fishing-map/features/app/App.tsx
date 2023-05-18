import { useState, useCallback, useEffect, useLayoutEffect, Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import { Menu, SplitView } from '@globalfishingwatch/ui-components'
import { Workspace } from '@globalfishingwatch/api-types'
import {
  selectIsReportLocation,
  selectIsWorkspaceLocation,
  selectLocationType,
  selectUrlTimeRange,
  selectUrlViewport,
  selectWorkspaceId,
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
import useViewport, { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { selectShowTimeComparison } from 'features/reports/reports.selectors'
import { isUserLogged } from 'features/user/user.selectors'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { HOME, WORKSPACE, USER, WORKSPACES_LIST, REPORT, WORKSPACE_REPORT } from 'routes/routes'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { t } from 'features/i18n/i18n'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { FIT_BOUNDS_REPORT_PADDING, ROOT_DOM_ELEMENT } from 'data/config'
import { initializeHints } from 'features/help/hints.slice'
import AppModals from 'features/modals/Modals'
import useMapInstance from 'features/map/map-context.hooks'
import { useAppDispatch } from './app.hooks'
import { selectReadOnly, selectReportAreaBounds, selectSidebarOpen } from './app.selectors'
import styles from './App.module.css'
import { useAnalytics } from './analytics.hooks'

const Map = dynamic(() => import(/* webpackChunkName: "Map" */ 'features/map/Map'))
const Timebar = dynamic(() => import(/* webpackChunkName: "Timebar" */ 'features/timebar/Timebar'))

declare global {
  interface Window {
    gtag: any
  }
}

export const COLOR_PRIMARY_BLUE =
  (typeof window !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-primary-blue')) ||
  'rgb(22, 63, 137)'
export const COLOR_SECONDARY_BLUE =
  (typeof window !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-secondary-blue')) ||
  'rgb(22, 63, 137, .75)'
export const COLOR_GRADIENT =
  (typeof window !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--color-gradient')) ||
  'rgb(229, 240, 242)'

const Main = () => {
  const workspaceLocation = useSelector(selectIsWorkspaceLocation)
  const reportLocation = useSelector(selectIsReportLocation)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const isTimeComparisonReport = useSelector(selectShowTimeComparison)

  const showTimebar =
    (workspaceLocation || (reportLocation && !isTimeComparisonReport)) &&
    workspaceStatus === AsyncReducerStatus.Finished

  return (
    <Fragment>
      <div className={cx(styles.mapContainer, { [styles.withTimebar]: showTimebar })}>
        <Map />
      </div>
      {showTimebar && <Timebar />}
      <Footer />
    </Fragment>
  )
}

const setMobileSafeVH = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

function App(): React.ReactElement {
  useAnalytics()
  useReplaceLoginUrl()
  const map = useMapInstance()
  const dispatch = useAppDispatch()
  const sidebarOpen = useSelector(selectSidebarOpen)
  const readOnly = useSelector(selectReadOnly)
  const i18n = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const [menuOpen, setMenuOpen] = useState(false)
  const workspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isReportLocation = useSelector(selectIsReportLocation)
  const reportAreaBounds = useSelector(selectReportAreaBounds)
  const isTimeComparisonReport = useSelector(selectShowTimeComparison)
  const narrowSidebar = workspaceLocation
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const showTimebar = workspaceLocation && workspaceStatus === AsyncReducerStatus.Finished

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  useEffect(() => {
    dispatch(initializeHints())
  }, [dispatch])

  useEffect(() => {
    try {
      if (map && map?.resize) {
        map.resize()
      }
    } catch (e) {
      console.warn(e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReportLocation, sidebarOpen, showTimebar, isTimeComparisonReport])

  useEffect(() => {
    setMobileSafeVH()
    window.addEventListener('resize', setMobileSafeVH, false)
    return () => window.removeEventListener('resize', setMobileSafeVH)
  }, [])

  const fitMapBounds = useMapFitBounds()
  const { setMapCoordinates } = useViewport()
  const { setTimerange } = useTimerangeConnect()

  const locationType = useSelector(selectLocationType)
  const currentWorkspaceId = useSelector(selectCurrentWorkspaceId)
  const workspaceCustomStatus = useSelector(selectWorkspaceCustomStatus)
  const userLogged = useSelector(isUserLogged)
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
      action = dispatch(fetchWorkspaceThunk(urlWorkspaceId as string))
      const resolvedAction = await action
      if (fetchWorkspaceThunk.fulfilled.match(resolvedAction)) {
        const workspace = resolvedAction.payload as Workspace
        const viewport = urlViewport || workspace?.viewport
        if (viewport && !isReportLocation) {
          setMapCoordinates(viewport)
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
        setMapCoordinates({ latitude: 0, longitude: 0, zoom: 0 })
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

  const getSidebarName = useCallback(() => {
    if (locationType === USER) return t('user.title', 'User')
    if (locationType === WORKSPACES_LIST) return t('workspace.title_other', 'Workspaces')
    if (isReportLocation) return t('analysis.title', 'Analysis')
    return t('common.layerList', 'Layer list')
  }, [locationType, isReportLocation])

  let asideWidth = '50%'
  if (readOnly) {
    asideWidth = isReportLocation ? '45%' : '34rem'
  } else if (narrowSidebar) {
    asideWidth = '39rem'
  }

  if (!i18n.ready) {
    return null
  }

  return (
    <Fragment>
      <SplitView
        isOpen={sidebarOpen}
        showToggle={workspaceLocation}
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
    </Fragment>
  )
}

export default App
