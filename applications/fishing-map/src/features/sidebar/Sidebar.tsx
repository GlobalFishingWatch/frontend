import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'redux-first-router-link'
import Sticky from 'react-sticky-el'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import { selectUserData, logoutUserThunk } from 'features/user/user.slice'
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

type SidebarProps = {
  onMenuClick: () => void
}

function SidebarHeader({ onMenuClick }: SidebarProps) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [finished, setFinished] = useState(false)
  const userData = useSelector(selectUserData)
  const workspaceId = useSelector(selectWorkspaceId)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceCustom = useSelector(selectWorkspaceCustom)
  const initials = `${userData?.firstName?.slice(0, 1)}${userData?.lastName?.slice(0, 1)}`

  const onShareClick = useCallback(() => {
    dispatch(saveCurrentWorkspaceThunk())
  }, [dispatch])

  const onLogoutClick = useCallback(() => {
    dispatch(logoutUserThunk())
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
        <IconButton
          icon="menu"
          className="print-hidden"
          tooltip={t('common.open_menu', 'Open menu')}
          onClick={onMenuClick}
        />
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
        {userData ? (
          <IconButton
            size="medium"
            tooltip={
              <span>
                {`${userData.firstName} ${userData.lastName}`}
                <br />
                {userData.email}
                <br />
                {t('common.logout', 'Logout')}
              </span>
            }
            tooltipPlacement="bottom"
            className={cx('print-hidden', styles.userBtn)}
            onClick={onLogoutClick}
            icon="logout"
          >
            {initials}
          </IconButton>
        ) : (
          <IconButton
            icon="user"
            className="print-hidden"
            tooltip={t('common.login', 'Login')}
            tooltipPlacement="bottom"
          />
        )}
      </div>
    </Sticky>
  )
}

function CategoryTabs() {
  return (
    <ul>
      <li>
        <Link
          to={{
            type: WORKSPACES_LIST,
            payload: { workspaceId: undefined, category: 'fishing-map' },
            query: {},
            replaceQuery: true,
          }}
        >
          FISHING SECTION
        </Link>
      </li>
      <li>
        <Link
          to={{
            type: WORKSPACES_LIST,
            // TODO: extract categories to config.ts
            payload: { workspaceId: undefined, category: 'marine-reserves' },
            query: {},
            replaceQuery: true,
          }}
        >
          MARINE RESERVES SECTION
        </Link>
      </li>
      <li>
        <Link to={{ type: USER, payload: {}, query: {}, replaceQuery: true }}>USER SECTION</Link>
      </li>
    </ul>
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
      <CategoryTabs />
      <div className="scrollContainer">
        <SidebarHeader onMenuClick={onMenuClick} />
        {sidebarComponent}
      </div>
    </div>
  )
}

export default Sidebar
