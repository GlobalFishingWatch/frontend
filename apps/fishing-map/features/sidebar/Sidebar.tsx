import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectHasDeprecatedDataviewInstances } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectDataviewsResources } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { selectIsUserLogged } from 'features/user/selectors/user.selectors'
import { fetchVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import { selectHighlightedWorkspacesStatus } from 'features/workspaces-list/workspaces-list.slice'
import {
  selectIsAnyAreaReportLocation,
  selectIsAnySearchLocation,
  selectIsAnyVesselLocation,
  selectIsPortReportLocation,
  selectIsUserLocation,
  selectIsVesselGroupReportLocation,
  selectIsWorkspacesListLocation,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

import styles from './Sidebar.module.css'

export const SCROLL_CONTAINER_DOM_ID = 'scroll-container'

const AreaReport = dynamic(
  () => import(/* webpackChunkName: "Report" */ 'features/reports/report-area/AreaReport')
)
const PortsReport = dynamic(
  () => import(/* webpackChunkName: "Report" */ 'features/reports/report-port/PortsReport')
)
const VesselGroupReport = dynamic(
  () =>
    import(
      /* webpackChunkName: "Report" */ 'features/reports/report-vessel-group/VesselGroupReport'
    )
)
const VesselProfile = dynamic(
  () => import(/* webpackChunkName: "VesselProfile" */ 'features/vessel/Vessel')
)
const User = dynamic(() => import(/* webpackChunkName: "User" */ 'features/user/User'))
const Workspace = dynamic(
  () => import(/* webpackChunkName: "Workspace" */ 'features/workspace/Workspace')
)
const WorkspacesList = dynamic(
  () => import(/* webpackChunkName: "WorkspacesList" */ 'features/workspaces-list/WorkspacesList')
)
const Search = dynamic(() => import(/* webpackChunkName: "Search" */ 'features/search/Search'))

type SidebarProps = {
  onMenuClick: () => void
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const dispatch = useAppDispatch()
  const readOnly = useSelector(selectReadOnly)
  const isSmallScreen = useSmallScreen(SMALL_PHONE_BREAKPOINT)
  const isUserLocation = useSelector(selectIsUserLocation)
  const isUserLogged = useSelector(selectIsUserLogged)
  const hasDeprecatedDataviewInstances = useSelector(selectHasDeprecatedDataviewInstances)
  const isWorkspacesListLocation = useSelector(selectIsWorkspacesListLocation)
  const isSearchLocation = useSelector(selectIsAnySearchLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const dataviewsResources = useSelector(selectDataviewsResources)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)

  useEffect(() => {
    if (isUserLogged) {
      dispatch(fetchVesselGroupsThunk())
    }
  }, [dispatch, isUserLogged])

  useEffect(() => {
    if (dataviewsResources?.resources?.length) {
      const infoResources = dataviewsResources?.resources.filter(
        (r) => r.dataset.type === DatasetTypes.Vessels
      )
      infoResources.forEach((resource) => {
        dispatch(
          fetchResourceThunk({
            resource,
            resourceKey: resource.key,
            // parseEventCb: parseTrackEventChunkProps,
            // parseUserTrackCb: parseUserTrackCallback,
          })
        )
      })
    }
  }, [dispatch, dataviewsResources])

  const sidebarComponent = useMemo(() => {
    if (!isUserLogged) {
      return <Spinner />
    }

    if (isUserLocation) {
      return <User />
    }

    if (isVesselLocation) {
      return <VesselProfile />
    }

    if (isWorkspacesListLocation) {
      return highlightedWorkspacesStatus === AsyncReducerStatus.Loading ? (
        <Spinner />
      ) : (
        <WorkspacesList />
      )
    }

    if (isAreaReportLocation) {
      return <AreaReport />
    }

    if (isPortReportLocation) {
      return <PortsReport />
    }

    if (isVesselGroupReportLocation) {
      return <VesselGroupReport />
    }

    if (isSearchLocation) {
      return <Search />
    }

    return <Workspace />
  }, [
    highlightedWorkspacesStatus,
    isAreaReportLocation,
    isPortReportLocation,
    isSearchLocation,
    isUserLocation,
    isVesselGroupReportLocation,
    isVesselLocation,
    isWorkspacesListLocation,
    isUserLogged,
  ])

  return (
    <div className={styles.container}>
      {!readOnly && !isSmallScreen && <CategoryTabs onMenuClick={onMenuClick} />}
      {/* New dataset modal is used in user and workspace pages*/}
      <div
        id={SCROLL_CONTAINER_DOM_ID}
        className="scrollContainer"
        data-test="sidebar-container"
        style={hasDeprecatedDataviewInstances ? { pointerEvents: 'none' } : {}}
      >
        <SidebarHeader />
        {sidebarComponent}
      </div>
    </div>
  )
}

export default Sidebar
