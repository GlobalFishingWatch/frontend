import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { Spinner } from '@globalfishingwatch/ui-components'
import { selectReadOnly, selectSearchQuery } from 'features/app/app.selectors'
import { selectLocationType } from 'routes/routes.selectors'
import { USER, WORKSPACES_LIST } from 'routes/routes'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectHighlightedWorkspacesStatus } from 'features/workspaces-list/workspaces-list.slice'
import { selectIsAnalyzing } from 'features/analysis/analysis.selectors'
import { isUserLogged } from 'features/user/user.selectors'
import styles from './Sidebar.module.css'
import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

const Analysis = dynamic(
  () => import(/* webpackChunkName: "Analyis" */ 'features/analysis/Analysis')
)
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
const VesselGroupModal = dynamic(
  () => import(/* webpackChunkName: "VesselGroup" */ 'features/vesselGroup/VesselGroupModal')
)

type SidebarProps = {
  onMenuClick: () => void
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const readOnly = useSelector(selectReadOnly)
  const isAnalyzing = useSelector(selectIsAnalyzing)
  const searchQuery = useSelector(selectSearchQuery)
  const locationType = useSelector(selectLocationType)
  const userLogged = useSelector(isUserLogged)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)

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

    return <Workspace />
  }, [locationType, userLogged, highlightedWorkspacesStatus])

  if (searchQuery !== undefined) {
    return <Search />
  }

  if (isAnalyzing) {
    return <Analysis />
  }

  return (
    <div className={styles.container}>
      {!readOnly && <CategoryTabs onMenuClick={onMenuClick} />}
      {/* New dataset modal is used in user and workspace pages*/}
      <NewDataset />
      <VesselGroupModal />
      <div className="scrollContainer">
        <SidebarHeader />
        {sidebarComponent}
      </div>
    </div>
  )
}

export default Sidebar
