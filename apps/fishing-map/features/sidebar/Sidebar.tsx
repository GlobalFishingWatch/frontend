import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { Spinner } from '@globalfishingwatch/ui-components'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import {
  selectIsAnyReportLocation,
  selectIsAnySearchLocation,
  selectIsAnyVesselLocation,
  selectIsUserLocation,
  selectIsWorkspacesListLocation,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectHighlightedWorkspacesStatus } from 'features/workspaces-list/workspaces-list.slice'
import { selectUserGroupsPermissions } from 'features/user/selectors/user.permissions.selectors'
import { selectIsUserLogged } from 'features/user/selectors/user.selectors'
import { fetchUserVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import styles from './Sidebar.module.css'
import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

const Report = dynamic(() => import(/* webpackChunkName: "Report" */ 'features/reports/Report'))
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
  const isSmallScreen = useSmallScreen()
  const isUserLocation = useSelector(selectIsUserLocation)
  const isWorkspacesListLocation = useSelector(selectIsWorkspacesListLocation)
  const isSearchLocation = useSelector(selectIsAnySearchLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isReportLocation = useSelector(selectIsAnyReportLocation)
  const userLogged = useSelector(selectIsUserLogged)
  const hasUserGroupsPermissions = useSelector(selectUserGroupsPermissions)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)

  useEffect(() => {
    if (hasUserGroupsPermissions) {
      dispatch(fetchUserVesselGroupsThunk())
    }
  }, [dispatch, hasUserGroupsPermissions])

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

    if (isReportLocation) {
      return <Report />
    }

    if (isSearchLocation) {
      return <Search />
    }

    return <Workspace />
  }, [
    highlightedWorkspacesStatus,
    isReportLocation,
    isSearchLocation,
    isUserLocation,
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
