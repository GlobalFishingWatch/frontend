import { useState, useCallback, useEffect, useLayoutEffect, Fragment } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
import { Menu, SplitView } from '@globalfishingwatch/ui-components'
import { Workspace } from '@globalfishingwatch/api-types'
import {
  isWorkspaceLocation,
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
import { selectIsAnalyzing } from 'features/analysis/analysis.selectors'
import { isUserLogged } from 'features/user/user.selectors'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { HOME, WORKSPACE, USER, WORKSPACES_LIST } from 'routes/routes'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { t } from 'features/i18n/i18n'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { FIT_BOUNDS_ANALYSIS_PADDING, ROOT_DOM_ELEMENT } from 'data/config'
import { initializeHints } from 'features/help/hints/hints.slice'
import AppModals from 'features/app/AppModals'
import useMapInstance from 'features/map/map-context.hooks'
import { useAppDispatch } from './app.hooks'
import { selectAnalysisQuery, selectReadOnly, selectSidebarOpen } from './app.selectors'
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
  const workspaceLocation = useSelector(isWorkspaceLocation)
  const workspaceStatus = useSelector(selectWorkspaceStatus)

  return (
    <div className={styles.main}>
      <div className={styles.mapContainer}>{<Map />}</div>
      {workspaceLocation && workspaceStatus === AsyncReducerStatus.Finished && <Timebar />}
      <Footer />
    </div>
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
  const analysisQuery = useSelector(selectAnalysisQuery)
  const workspaceLocation = useSelector(isWorkspaceLocation)
  const isAnalysing = useSelector(selectIsAnalyzing)
  const narrowSidebar = workspaceLocation && !analysisQuery

  const onMenuClick = useCallback(() => {
    setMenuOpen(true)
  }, [])

  useEffect(() => {
    dispatch(initializeHints())
  }, [dispatch])

  useEffect(() => {
    if (map) {
      map.resize()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalysing, sidebarOpen])

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
  const hasWorkspaceIdChanged = locationType === WORKSPACE && currentWorkspaceId !== urlWorkspaceId
  useEffect(() => {
    let action: any
    let actionResolved = false
    const fetchWorkspace = async () => {
      action = dispatch(fetchWorkspaceThunk(urlWorkspaceId as string))
      const resolvedAction = await action
      if (fetchWorkspaceThunk.fulfilled.match(resolvedAction)) {
        const workspace = resolvedAction.payload as Workspace
        if (!urlViewport && workspace?.viewport) {
          setMapCoordinates(workspace.viewport)
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
      (homeNeedsFetch || hasWorkspaceIdChanged)
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
  }, [userLogged, homeNeedsFetch, hasWorkspaceIdChanged])

  useLayoutEffect(() => {
    if (isAnalysing) {
      if (analysisQuery.bounds) {
        fitMapBounds(analysisQuery.bounds, { padding: FIT_BOUNDS_ANALYSIS_PADDING })
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
    if (isAnalysing) return t('analysis.title', 'Analysis')
    return t('common.layerList', 'Layer list')
  }, [isAnalysing, locationType])

  let asideWidth = '50%'
  if (readOnly) {
    asideWidth = analysisQuery ? '45%' : '32rem'
  } else if (narrowSidebar) {
    asideWidth = '37rem'
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
        className="split-container"
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
