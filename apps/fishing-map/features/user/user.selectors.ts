import { createSelector } from '@reduxjs/toolkit'
import { orderBy, uniqBy } from 'lodash'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { DatasetStatus, DatasetCategory, UserPermission } from '@globalfishingwatch/api-types'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  selectContextAreasDataviews,
  selectEnvironmentalDataviews,
} from 'features/dataviews/dataviews.selectors'
import { selectWorkspaces } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { PRIVATE_SUFIX, USER_SUFIX } from 'data/config'
import { RootState } from 'store'
import {
  selectAllVesselGroups,
  selectWorkspaceVesselGroups,
} from 'features/vessel-groups/vessel-groups.slice'
import {
  selectUserStatus,
  selectUserLogged,
  selectUserData,
  DEFAULT_GROUP_ID,
  PRIVATE_SUPPORTED_GROUPS,
  isGFWUser,
} from './user.slice'

export const isUserLogged = createSelector(
  [selectUserStatus, selectUserLogged],
  (status, logged) => {
    return status === AsyncReducerStatus.Finished && logged
  }
)

export const hasUserPermission = (permission: UserPermission) =>
  createSelector([selectUserData], (userData): boolean => {
    if (!userData?.permissions) return false
    return checkExistPermissionInList(userData.permissions, permission)
  })

export const selectUserWorkspaceEditPermissions = hasUserPermission({
  type: 'entity',
  value: 'workspace',
  action: 'create-all',
})

export const selectUserDataviewEditPermissions = hasUserPermission({
  type: 'entity',
  value: 'dataview',
  action: 'create-all',
})

export const selectUserGroupsPermissions = hasUserPermission({
  type: 'entity',
  value: 'vessel-group',
  action: 'create',
})

export const selectUserId = createSelector([selectUserData], (userData) => {
  return userData?.id
})

export const selectUserGroups = createSelector([selectUserData], (userData) => {
  return userData?.groups
})

export const selectUserGroupsClean = createSelector([selectUserGroups], (userGroups) => {
  return userGroups?.filter((g) => g !== DEFAULT_GROUP_ID)
})

export const selectUserWorkspaces = createSelector(
  [(state: RootState) => selectUserData(state), (state: RootState) => selectWorkspaces(state)],
  (userData, workspaces) => {
    return orderBy(
      workspaces?.filter((workspace) => workspace.ownerId === userData?.id),
      'createdAt',
      'desc'
    )
  }
)

export const selectPrivateUserGroups = createSelector(
  [selectUserGroups, isGFWUser],
  (userGroups = [], gfwUser) => {
    const groupsWithAccess = gfwUser
      ? PRIVATE_SUPPORTED_GROUPS.map((g) => g.toLowerCase())
      : userGroups.filter((g) => PRIVATE_SUPPORTED_GROUPS.includes(g)).map((g) => g.toLowerCase())

    return groupsWithAccess
  }
)

export const selectUserWorkspacesPrivate = createSelector(
  [selectPrivateUserGroups, (state: RootState) => selectWorkspaces(state)],
  (groupsWithAccess = [], workspaces) => {
    const privateWorkspaces = workspaces?.filter(
      (workspace) =>
        workspace.id.includes(PRIVATE_SUFIX) &&
        !workspace.id.includes(USER_SUFIX) &&
        groupsWithAccess.some((g) => workspace.id.includes(g))
    )
    return orderBy(privateWorkspaces, 'createdAt', 'desc')
  }
)

export const selectUserDatasets = createSelector(
  [(state: RootState) => selectAllDatasets(state), selectUserId],
  (datasets, userId) =>
    datasets?.filter((d) => d.ownerId === userId && d.status !== DatasetStatus.Deleted)
)

export const selectUserDatasetsByCategory = (datasetCategory: DatasetCategory) =>
  createSelector([selectUserDatasets], (datasets) =>
    datasets?.filter((d) => d.category === datasetCategory)
  )

export const selectUserDatasetsNotUsed = (datasetCategory: DatasetCategory) => {
  const dataviewsSelector =
    datasetCategory === DatasetCategory.Context
      ? selectContextAreasDataviews
      : selectEnvironmentalDataviews
  return createSelector(
    [selectUserDatasetsByCategory(datasetCategory), dataviewsSelector],
    (datasets, dataviews) => {
      const dataviewDatasets = dataviews?.flatMap(
        (dataview) => dataview.datasets?.flatMap(({ id }) => id || []) || []
      )
      return datasets.filter(
        ({ id, status }) => !dataviewDatasets?.includes(id) && status !== DatasetStatus.Error
      )
    }
  )
}

export const selectUserVesselGroups = createSelector(
  [selectAllVesselGroups, selectUserId],
  (vesselGroups, userId) => {
    return vesselGroups?.filter((d) => d.ownerId === userId)
  }
)

export const selectAllVisibleVesselGroups = createSelector(
  [selectUserVesselGroups, selectWorkspaceVesselGroups],
  (vesselGroups = [], workspaceVesselGroups = []) => {
    return uniqBy([...vesselGroups, ...workspaceVesselGroups], 'id')
  }
)
