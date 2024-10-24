import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { redirectToLogin } from '@globalfishingwatch/react-hooks'
import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import {
  // fetchDefaultWorkspaceThunk,
  fetchWorkspacesThunk,
} from 'features/workspaces-list/workspaces-list.slice'
import { fetchAllDatasetsThunk } from 'features/datasets/datasets.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import { UserTab } from 'types'
import { useLocationConnect } from 'routes/routes.hook'
import { selectUserTab } from 'routes/routes.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { selectIsUserLogged, selectUserData } from 'features/user/selectors/user.selectors'
import styles from './User.module.css'
import UserWorkspaces from './UserWorkspaces'
import UserWorkspacesPrivate from './UserWorkspacesPrivate'
import UserDatasets from './UserDatasets'
import UserReports from './UserReports'
import UserInfo from './UserInfo'
import UserVesselGroups from './UserVesselGroups'

function User() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userLogged = useSelector(selectIsUserLogged)
  const userData = useSelector(selectUserData)
  const userTab = useSelector(selectUserTab)
  const { dispatchQueryParams } = useLocationConnect()

  const userTabs = useMemo(() => {
    const tabs = [
      {
        id: UserTab.Info,
        title: t('user.info', 'User Info'),
        content: <UserInfo />,
      },
      {
        id: UserTab.Workspaces,
        title: t('workspace.title_other', 'Workspaces'),
        testId: 'user-workspace',
        content: (
          <Fragment>
            <UserWorkspacesPrivate />
            <UserWorkspaces />
          </Fragment>
        ),
      },
      {
        id: UserTab.Datasets,
        title: t('dataset.title_other', 'Datasets'),
        content: (
          <Fragment>
            <UserDatasets />
          </Fragment>
        ),
      },
      {
        id: UserTab.Reports,
        title: t('common.reports', 'Reports'),
        content: <UserReports />,
      },
      {
        id: UserTab.VesselGroups,
        title: t('vesselGroup.vesselGroups', 'Vessel Groups'),
        content: <UserVesselGroups />,
      },
    ]
    return tabs
  }, [t])

  const onTabClick = useCallback(
    (tab: Tab<UserTab>) => {
      dispatchQueryParams({ userTab: tab.id })
    },
    [dispatchQueryParams]
  )

  useEffect(() => {
    if (userLogged && userData?.id) {
      dispatch(fetchWorkspacesThunk({}))
    }
  }, [dispatch, userData?.id, userLogged])

  useEffect(() => {
    dispatch(fetchWorkspaceThunk({ workspaceId: '' }))
    // dispatch(fetchDefaultWorkspaceThunk())
    dispatch(fetchAllDatasetsThunk())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchVesselGroupsThunk())
  }, [dispatch])

  useEffect(() => {
    if (userData?.type === GUEST_USER_TYPE) {
      redirectToLogin()
    }
  }, [userData?.type])

  if (!userLogged || !userData) return null

  if (!userLogged || !userData || userData?.type === GUEST_USER_TYPE) {
    return (
      <div className={styles.container}>
        <Spinner />
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
