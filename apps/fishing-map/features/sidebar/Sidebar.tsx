import React, { lazy, Suspense, useMemo } from 'react'
import { useSelector } from 'react-redux'
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

const Analysis = lazy(() => import(/* webpackChunkName: "Analyis" */ 'features/analysis/Analysis'))
const User = lazy(() => import(/* webpackChunkName: "User" */ 'features/user/User'))
const Workspace = lazy(
  () => import(/* webpackChunkName: "Workspace" */ 'features/workspace/Workspace')
)
const WorkspacesList = lazy(
  () => import(/* webpackChunkName: "WorkspacesList" */ 'features/workspaces-list/WorkspacesList')
)
const Search = lazy(() => import(/* webpackChunkName: "Search" */ 'features/search/Search'))
const NewDataset = lazy(
  () => import(/* webpackChunkName: "NewDataset" */ 'features/datasets/NewDataset')
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
    return (
      <Suspense fallback={null}>
        <Search />
      </Suspense>
    )
  }

  if (isAnalyzing) {
    return (
      <Suspense fallback={null}>
        <Analysis />
      </Suspense>
    )
  }

  return (
    <div className={styles.container}>
      {!readOnly && <CategoryTabs onMenuClick={onMenuClick} />}
      {/* New dataset modal is used in user and workspace pages*/}
      <NewDataset />
      <div className="scrollContainer">
        <SidebarHeader />
        <Suspense fallback={null}>{sidebarComponent}</Suspense>
      </div>
    </div>
  )
}

export default Sidebar
