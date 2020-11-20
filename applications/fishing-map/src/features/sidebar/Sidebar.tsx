import React, { useCallback, Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Sticky from 'react-sticky-el'
import { useTranslation } from 'react-i18next'
import { IconButton, Logo } from '@globalfishingwatch/ui-components'
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
import { selectWorkspaceId } from 'routes/routes.selectors'
import styles from './Sidebar.module.css'
import HeatmapsSection from './heatmaps/HeatmapsSection'
import VesselsSection from './vessels/VesselsSection'
import ContextArea from './context-areas/ContextAreaSection'

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
          tooltip={t('common.open_menu', 'Open menu')}
          onClick={onMenuClick}
        />
        <Logo className={styles.logo} />
        <IconButton
          icon={finished ? 'tick' : 'share'}
          size="medium"
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
            className={styles.userBtn}
            onClick={onLogoutClick}
            icon="logout"
          >
            {initials}
          </IconButton>
        ) : (
          <IconButton icon="user" tooltip={t('common.login', 'Login')} tooltipPlacement="bottom" />
        )}
      </div>
    </Sticky>
  )
}

function Sidebar({ onMenuClick }: SidebarProps) {
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const searchQuery = useSelector(selectSearchQuery)
  const { t } = useTranslation()

  if (searchQuery !== undefined) {
    return <Search />
  }

  return (
    <div className="scrollContainer">
      <SidebarHeader onMenuClick={onMenuClick} />
      {workspaceStatus === 'error' ? (
        <div className={styles.placeholder}>
          {t(
            'errors.workspaceLoad',
            'There was an error loading the workspace, please try again later'
          )}
        </div>
      ) : (
        <Fragment>
          <HeatmapsSection />
          <VesselsSection />
          <ContextArea />
        </Fragment>
      )}
    </div>
  )
}

export default Sidebar
