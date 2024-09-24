import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { Spinner } from '@globalfishingwatch/ui-components'
import { SMALL_PHONE_BREAKPOINT, useSmallScreen } from '@globalfishingwatch/react-hooks'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import {
  selectIsAnyReportLocation,
  selectIsAnySearchLocation,
  selectIsAnyVesselLocation,
  selectIsUserLocation,
  selectIsVesselGroupReportLocation,
  selectIsWorkspacesListLocation,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectHighlightedWorkspacesStatus } from 'features/workspaces-list/workspaces-list.slice'
import { selectHasUserGroupsPermissions } from 'features/user/selectors/user.permissions.selectors'
import { selectIsUserLogged } from 'features/user/selectors/user.selectors'
import { fetchVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDataviewsResources } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import styles from './Sidebar.module.css'
import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

const AreaReport = dynamic(
  () => import(/* webpackChunkName: "Report" */ 'features/reports/areas/Report')
)
const VesselGroupReport = dynamic(
  () => import(/* webpackChunkName: "Report" */ 'features/reports/vessel-groups/VesselGroupReport')
)
const VesselDetailWrapper = dynamic(
  () => import(/* webpackChunkName: "VesselDetailWrapper" */ 'features/vessel/Vessel')
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
  const isWorkspacesListLocation = useSelector(selectIsWorkspacesListLocation)
  const isSearchLocation = useSelector(selectIsAnySearchLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const dataviewsResources = useSelector(selectDataviewsResources)
  const isAreaReportLocation = useSelector(selectIsAnyReportLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const userLogged = useSelector(selectIsUserLogged)
  const hasUserGroupsPermissions = useSelector(selectHasUserGroupsPermissions)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)

  useEffect(() => {
    if (hasUserGroupsPermissions) {
      dispatch(fetchVesselGroupsThunk())
    }
  }, [dispatch, hasUserGroupsPermissions])

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
    if (!userLogged) {
      return <Spinner />
    }

    if (isUserLocation) {
      return <User />
    }

    if (isVesselLocation) {
      return <VesselDetailWrapper />
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
    isSearchLocation,
    isUserLocation,
    isVesselGroupReportLocation,
    isVesselLocation,
    isWorkspacesListLocation,
    userLogged,
  ])

  return (
    <div className={styles.container}>
      {!readOnly && !isSmallScreen && <CategoryTabs onMenuClick={onMenuClick} />}
      {/* New dataset modal is used in user and workspace pages*/}
      <div className="scrollContainer" data-test="sidebar-container">
        <SidebarHeader />
        {sidebarComponent}
      </div>
    </div>
  )
}

export default Sidebar
