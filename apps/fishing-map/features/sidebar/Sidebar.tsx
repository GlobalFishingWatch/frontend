import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { Spinner } from '@globalfishingwatch/ui-components'
import { selectReadOnly, selectSearchQuery } from 'features/app/app.selectors'
import {
  selectIsReportLocation,
  selectIsUserLocation,
  selectIsAnyVesselLocation,
  selectIsWorkspacesListLocation,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectHighlightedWorkspacesStatus } from 'features/workspaces-list/workspaces-list.slice'
import { isUserLogged } from 'features/user/user.slice'
import { selectUserGroupsPermissions } from 'features/user/user.selectors'
import { useDatasetModalConnect } from 'features/datasets/datasets.hook'
import { fetchUserVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import Report from 'features/reports/Report'
import VesselDetailWrapper from '../vessel/Vessel'
import styles from './Sidebar.module.css'
import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

const User = dynamic(() => import(/* webpackChunkName: "User" */ 'features/user/User'))
const Workspace = dynamic(
  () => import(/* webpackChunkName: "Workspace" */ 'features/workspace/Workspace')
)
const WorkspacesList = dynamic(
  () => import(/* webpackChunkName: "WorkspacesList" */ 'features/workspaces-list/WorkspacesList')
)
const Search = dynamic(() => import(/* webpackChunkName: "Search" */ 'features/search/Search'))
const NewDataset = dynamic(
  () => import(/* webpackChunkName: "NewDataset" */ 'features/datasets/NewDataset')
)

type SidebarProps = {
  onMenuClick: () => void
}

export function getScrollElement() {
  return document.querySelector('.scrollContainer') as HTMLElement
}

export function resetSidebarScroll() {
  const scrollContainer = getScrollElement()
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0 })
  }
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const dispatch = useAppDispatch()
  const readOnly = useSelector(selectReadOnly)
  const searchQuery = useSelector(selectSearchQuery)
  const isUserLocation = useSelector(selectIsUserLocation)
  const isWorkspacesListLocation = useSelector(selectIsWorkspacesListLocation)
  const isReportLocation = useSelector(selectIsReportLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const userLogged = useSelector(isUserLogged)
  const hasUserGroupsPermissions = useSelector(selectUserGroupsPermissions)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)
  const { datasetModal } = useDatasetModalConnect()

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

    return <Workspace />
  }, [
    userLogged,
    isUserLocation,
    isVesselLocation,
    isWorkspacesListLocation,
    isReportLocation,
    highlightedWorkspacesStatus,
  ])

  if (searchQuery !== undefined) {
    return <Search />
  }

  return (
    <div className={styles.container}>
      {!readOnly && <CategoryTabs onMenuClick={onMenuClick} />}
      {/* New dataset modal is used in user and workspace pages*/}
      {datasetModal === 'new' && <NewDataset />}
      <div className="scrollContainer">
        <SidebarHeader />
        {sidebarComponent}
      </div>
    </div>
  )
}

export default Sidebar
