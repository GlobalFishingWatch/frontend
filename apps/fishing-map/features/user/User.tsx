import { Fragment, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { DatasetCategory } from '@globalfishingwatch/api-types'
import { redirectToLogin } from '@globalfishingwatch/react-hooks'
import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import EditDataset from 'features/datasets/EditDataset'
import {
  fetchDefaultWorkspaceThunk,
  fetchWorkspacesThunk,
} from 'features/workspaces-list/workspaces-list.slice'
import { fetchAllDatasetsThunk } from 'features/datasets/datasets.slice'
import { useDatasetModalConnect } from 'features/datasets/datasets.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchUserVesselGroupsThunk } from 'features/vessel-groups/vessel-groups.slice'
import styles from './User.module.css'
import { selectUserData } from './user.slice'
import { isUserLogged, selectUserGroupsPermissions } from './user.selectors'
import UserWorkspaces from './UserWorkspaces'
import UserWorkspacesPrivate from './UserWorkspacesPrivate'
import UserDatasets from './UserDatasets'
import UserInfo from './UserInfo'
import UserVesselGroups from './UserVesselGroups'

function User() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userLogged = useSelector(isUserLogged)
  const userData = useSelector(selectUserData)
  const hasUserGroupsPermissions = useSelector(selectUserGroupsPermissions)
  const { datasetModal, editingDatasetId } = useDatasetModalConnect()

  const userTabs = useMemo(() => {
    const tabs = [
      {
        id: 'info',
        title: t('user.info', 'User Info'),
        content: <UserInfo />,
      },
      {
        id: 'workspaces',
        title: t('workspace.title_other', 'Workspaces'),
        content: (
          <Fragment>
            <UserWorkspacesPrivate />
            <UserWorkspaces />
          </Fragment>
        ),
      },
      {
        id: 'datasets',
        title: t('dataset.title_other', 'Datasets'),
        content: (
          <Fragment>
            <UserDatasets datasetCategory={DatasetCategory.Environment} />
            <UserDatasets datasetCategory={DatasetCategory.Context} />
          </Fragment>
        ),
      },
    ]
    if (hasUserGroupsPermissions) {
      tabs.push({
        id: 'vesselGroups',
        title: t('vesselGroup.vesselGroups', 'Vessel Groups'),
        content: <UserVesselGroups />,
      })
    }
    return tabs
  }, [hasUserGroupsPermissions, t])
  const [activeTab, setActiveTab] = useState<Tab | undefined>(userTabs?.[0])

  useEffect(() => {
    if (userLogged && userData?.id) {
      dispatch(fetchWorkspacesThunk({}))
    }
  }, [dispatch, userData?.id, userLogged])

  useEffect(() => {
    dispatch(fetchDefaultWorkspaceThunk())
    dispatch(fetchAllDatasetsThunk())
  }, [dispatch])

  useEffect(() => {
    if (hasUserGroupsPermissions) {
      dispatch(fetchUserVesselGroupsThunk())
    }
  }, [dispatch, hasUserGroupsPermissions])

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
      <Tabs
        tabs={userTabs}
        activeTab={activeTab?.id}
        onTabClick={(tab: Tab) => setActiveTab(tab)}
      />
      {datasetModal === 'edit' && editingDatasetId !== undefined && <EditDataset />}
    </div>
  )
}

export default User
