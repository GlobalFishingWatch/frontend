import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Search from 'features/search/Search'
import { selectSearchQuery } from 'features/app/app.selectors'
import { selectLocationType } from 'routes/routes.selectors'
import { USER, WORKSPACES_LIST } from 'routes/routes'
import User from 'features/user/User'
import Workspace from 'features/workspace/Workspace'
import WorkspacesList from 'features/workspaces-list/WorkspacesList'
import styles from './Sidebar.module.css'
import CategoryTabs from './CategoryTabs'
import SidebarHeader from './SidebarHeader'

type SidebarProps = {
  onMenuClick: () => void
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const searchQuery = useSelector(selectSearchQuery)
  const locationType = useSelector(selectLocationType)

  const sidebarComponent = useMemo(() => {
    if (locationType === USER) {
      return <User />
    }
    if (locationType === WORKSPACES_LIST) {
      return <WorkspacesList />
    }
    // TODO: show loading when datasets and dataviews pending
    return <Workspace />
  }, [locationType])

  if (searchQuery !== undefined) {
    return <Search />
  }
  return (
    <div className={styles.container}>
      <CategoryTabs onMenuClick={onMenuClick} />
      <div className="scrollContainer">
        <SidebarHeader />
        {sidebarComponent}
      </div>
    </div>
  )
}

export default Sidebar
