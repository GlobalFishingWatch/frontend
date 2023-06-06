import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { Spinner } from '@globalfishingwatch/ui-components'
import { selectReadOnly, selectSearchQuery } from 'features/app/app.selectors'
import { selectIsReportLocation, selectLocationType } from 'routes/routes.selectors'
import { USER, WORKSPACES_LIST } from 'routes/routes'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectHighlightedWorkspacesStatus } from 'features/workspaces-list/workspaces-list.slice'
import { isUserLogged, selectUserGroupsPermissions } from 'features/user/user.selectors'
import { fetchResourceThunk } from 'features/resources/resources.slice'
import { parseTrackEventChunkProps } from 'features/timebar/timebar.utils'
import { parseUserTrackCallback } from 'features/resources/resources.utils'
import { useDatasetModalConnect } from 'features/datasets/datasets.hook'
import { fetchUserVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import Report from 'features/reports/Report'
import { selectDataviewsResources } from 'features/dataviews/dataviews.slice'
import { DatasetTypes } from '../../../../libs/api-types/src/datasets'
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

export function resetSidebarScroll() {
  const scrollContainer = document.querySelector('.scrollContainer')
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0 })
  }
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const dispatch = useAppDispatch()
  const readOnly = useSelector(selectReadOnly)
  const searchQuery = useSelector(selectSearchQuery)
  const locationType = useSelector(selectLocationType)
  const isReportLocation = useSelector(selectIsReportLocation)
  const dataviewsResources = useSelector(selectDataviewsResources)
  const userLogged = useSelector(isUserLogged)
  const hasUserGroupsPermissions = useSelector(selectUserGroupsPermissions)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)
  const { datasetModal } = useDatasetModalConnect()

  useEffect(() => {
    if (hasUserGroupsPermissions) {
      dispatch(fetchUserVesselGroupsThunk())
    }
  }, [dispatch, hasUserGroupsPermissions])

  useEffect(() => {
    if (dataviewsResources?.resources?.length) {
      const infoResources = dataviewsResources?.resources
      //   .filter(
      //   (r) => r.dataset.type === DatasetTypes.Vessels
      // )
      infoResources.forEach((resource) => {
        dispatch(
          fetchResourceThunk({
            resource,
            resourceKey: resource.key,
            parseEventCb: parseTrackEventChunkProps,
            parseUserTrackCb: parseUserTrackCallback,
          })
        )
      })
    }
  }, [dispatch, dataviewsResources])

  const sidebarComponent = useMemo(() => {
    if (!userLogged) {
      return <Spinner />
    }

    if (locationType === USER) {
      return <User />
    }

    if (locationType === WORKSPACES_LIST) {
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
  }, [userLogged, locationType, isReportLocation, highlightedWorkspacesStatus])

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
