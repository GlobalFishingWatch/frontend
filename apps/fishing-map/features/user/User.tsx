import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Spinner } from '@globalfishingwatch/ui-components'
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
import { fetchVesselGroups } from 'features/vesselGroup/vessel-groups.slice'
import styles from './User.module.css'
import { GUEST_USER_TYPE, selectUserData } from './user.slice'
import { isUserLogged } from './user.selectors'
import UserWorkspaces from './UserWorkspaces'
import UserWorkspacesPrivate from './UserWorkspacesPrivate'
import UserDatasets from './UserDatasets'
import UserInfo from './UserInfo'

function User() {
  const dispatch = useAppDispatch()
  const userLogged = useSelector(isUserLogged)
  const userData = useSelector(selectUserData)
  const { datasetModal, editingDatasetId } = useDatasetModalConnect()

  useEffect(() => {
    if (userLogged && userData?.id) {
      dispatch(fetchWorkspacesThunk({}))
    }
  }, [dispatch, userData?.id, userLogged])

  useEffect(() => {
    dispatch(fetchDefaultWorkspaceThunk())
    dispatch(fetchAllDatasetsThunk())
    dispatch(fetchVesselGroups())
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
      <UserInfo />
      <UserWorkspacesPrivate />
      <UserWorkspaces />
      <UserDatasets datasetCategory={DatasetCategory.Environment} />
      <UserDatasets datasetCategory={DatasetCategory.Context} />
      {datasetModal === 'edit' && editingDatasetId !== undefined && <EditDataset />}
    </div>
  )
}

export default User
