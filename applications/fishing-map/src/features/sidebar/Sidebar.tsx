import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Sticky from 'react-sticky-el'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import { saveCurrentWorkspaceThunk } from 'features/workspace/workspace.slice'
import {
  selectWorkspaceCustom,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import Search from 'features/search/Search'
import { selectSearchQuery } from 'features/app/app.selectors'
import { AsyncReducerStatus } from 'types'
import copyToClipboard from 'utils/clipboard'
import { selectLocationType, selectWorkspaceId } from 'routes/routes.selectors'
import { USER, WORKSPACES_LIST } from 'routes/routes'
import User from 'features/user/User'
import Workspace from 'features/workspace/Workspace'
import WorkspacesList from 'features/workspaces-list/WorkspacesList'
import styles from './Sidebar.module.css'
import CategoryTabs from './CategoryTabs'

type SidebarProps = {
  onMenuClick: () => void
}

function SidebarHeader() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [finished, setFinished] = useState(false)
  const workspaceId = useSelector(selectWorkspaceId)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceCustom = useSelector(selectWorkspaceCustom)

  const onShareClick = useCallback(() => {
    dispatch(saveCurrentWorkspaceThunk())
  }, [dispatch])

  useEffect(() => {
    let id: any
    if (workspaceStatus === AsyncReducerStatus.Finished && workspaceCustom === true) {
      setFinished(true)
      copyToClipboard(`${window.location.origin}/${workspaceId}`)
      id = setTimeout(() => setFinished(false), 5000)
    }

    return () => {
      if (id) {
        clearTimeout(id)
      }
    }
  }, [workspaceCustom, workspaceId, workspaceStatus])

  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <Logo className={styles.logo} />
        <IconButton
          icon={finished ? 'tick' : 'share'}
          size="medium"
          className="print-hidden"
          onClick={onShareClick}
          loading={workspaceStatus === AsyncReducerStatus.Loading && workspaceCustom === true}
          tooltip={
            finished
              ? t(
                  'common.copiedToClipboard',
                  'The link to share this view has been copied to your clipboard'
                )
              : t('common.share', 'Click to share the current view')
          }
          tooltipPlacement="bottom"
        />
      </div>
    </Sticky>
  )
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
