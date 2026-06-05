import { useCallback, useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import type { Tab } from '@globalfishingwatch/ui-components'
import { Spinner, Tabs } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectIsUserLogged,
  selectUserData,
  selectUserStatus,
} from 'features/user/selectors/user.selectors'
import { fetchVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import {
  // fetchDefaultWorkspaceThunk,
  fetchWorkspacesThunk,
} from 'features/workspaces-list/workspaces-list.slice'
import LocalStorageLoginLink from 'router/LoginLink'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectUserTab } from 'router/routes.selectors'
import { UserTab } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

import UserDatasets from './UserDatasets'
import UserInfo from './UserInfo'
import UserReports from './UserReports'
import UserVesselGroups from './UserVesselGroups'
import UserWorkspaces from './UserWorkspaces'

import styles from './User.module.css'

function User() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const userLogged = useSelector(selectIsUserLogged)
  const userData = useSelector(selectUserData)
  const userStatus = useSelector(selectUserStatus)
  const userTab = useSelector(selectUserTab)
  const userTabs = useMemo(() => {
    const tabs = [
      {
        id: UserTab.Info,
        title: t((t) => t.user.info),
        content: <UserInfo />,
      },
      {
        id: UserTab.Workspaces,
        title: t((t) => t.workspace.titlePlural),
        testId: 'user-workspace',
        content: <UserWorkspaces />,
      },
      {
        id: UserTab.Datasets,
        title: t((t) => t.dataset.title),
        content: <UserDatasets />,
      },
      {
        id: UserTab.Reports,
        title: t((t) => t.common.reports),
        content: <UserReports />,
      },
      {
        id: UserTab.VesselGroups,
        title: t((t) => t.vesselGroup.vesselGroups),
        content: <UserVesselGroups />,
      },
    ]
    return tabs
  }, [t])

  const onTabClick = useCallback(
    (tab: Tab<UserTab>) => {
      replaceQueryParams({ userTab: tab.id })
    },
    [replaceQueryParams]
  )

  useEffect(() => {
    if (userLogged && userData?.id) {
      dispatch(fetchWorkspacesThunk({}))
    }
  }, [dispatch, userData?.id, userLogged])

  useEffect(() => {
    dispatch(fetchVesselGroupsThunk())
  }, [dispatch])

  if (userStatus === AsyncReducerStatus.Loading) {
    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    )
  }

  if (!userLogged || !userData) return null

  if (!userLogged || !userData || userData?.type === GUEST_USER_TYPE) {
    return (
      <div className={cx(styles.container, styles.centered)}>
        <span>
          <Trans i18nKey={(t) => t.user.loginRequired}>
            Register or <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink>{' '}
            to see your user panel
          </Trans>
        </span>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Tabs tabs={userTabs} activeTab={userTab} onTabClick={onTabClick} />
    </div>
  )
}

export default User
