import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Spinner, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { DatasetCategory } from '@globalfishingwatch/api-types'
import { redirectToLogin } from '@globalfishingwatch/react-hooks'
import EditDataset from 'features/datasets/EditDataset'
import {
  fetchDefaultWorkspaceThunk,
  fetchWorkspacesThunk,
} from 'features/workspaces-list/workspaces-list.slice'
import { fetchAllDatasetsThunk } from 'features/datasets/datasets.slice'
import { useDatasetModalConnect } from 'features/datasets/datasets.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import styles from './User.module.css'
import { GUEST_USER_TYPE, selectUserData } from './user.slice'
import { isUserLogged } from './user.selectors'
import UserWorkspaces from './UserWorkspaces'
import UserWorkspacesPrivate from './UserWorkspacesPrivate'
import UserDatasets from './UserDatasets'
import UserInfo from './UserInfo'

const USER_TABS = [
  {
    id: 'info',
    title: 'Info',
    content: <UserInfo />,
  },
  {
    id: 'workspaces',
    title: 'Workspaces',
    content: (
      <Fragment>
        <UserWorkspacesPrivate />
        <UserWorkspaces />
      </Fragment>
    ),
  },
  {
    id: 'datasets',
    title: 'Datasets',
    content: (
      <Fragment>
        <UserDatasets datasetCategory={DatasetCategory.Environment} />
        <UserDatasets datasetCategory={DatasetCategory.Context} />
      </Fragment>
    ),
  },
]

function User() {
  const dispatch = useAppDispatch()
  const userLogged = useSelector(isUserLogged)
  const userData = useSelector(selectUserData)
  const { datasetModal, editingDatasetId } = useDatasetModalConnect()
  const [activeTab, setActiveTab] = useState<Tab | undefined>(USER_TABS?.[0])

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
        tabs={USER_TABS}
        activeTab={activeTab?.id}
        onTabClick={(tab: Tab) => setActiveTab(tab)}
      />
      {datasetModal === 'edit' && editingDatasetId !== undefined && <EditDataset />}
    </div>
  )
}

export default User
