import { createSelector } from '@reduxjs/toolkit'

import type { UserGroupId } from '@globalfishingwatch/api-types'
import {
  getPrivateGroupDatasetCode,
  getPrivateSearchDatasetIds,
  isPrivateDatasetId,
  isPrivateGroupDataset,
  PRIVATE_SUPPORTED_GROUPS,
} from '@globalfishingwatch/datasets-client'

import {
  selectIsGFWUser,
  selectIsUserExpired,
  selectUserData,
} from 'features/_user/selectors/user.selectors'

const selectUserGroups = createSelector(
  [selectUserData, selectIsUserExpired],
  (userData, isUserExpired) => (isUserExpired ? undefined : userData?.groups)
)

export const selectPrivateUserGroups = createSelector(
  [selectUserGroups, selectIsGFWUser],
  (userGroups = [], gfwUser) => {
    const groupsWithAccess = gfwUser
      ? PRIVATE_SUPPORTED_GROUPS.map((g) => g.toLowerCase())
      : userGroups.filter((g) => PRIVATE_SUPPORTED_GROUPS.includes(g)).map((g) => g.toLowerCase())

    return groupsWithAccess as UserGroupId[]
  }
)

const selectPrivateDatasetPermissions = createSelector([selectUserData], (userData) => {
  return (userData?.permissions ?? []).filter(
    (permission) => permission.type === 'dataset' && isPrivateDatasetId(permission.value)
  )
})

const selectPrivateDatasetPermissionValues = createSelector(
  [selectPrivateDatasetPermissions],
  (permissions) => [...new Set(permissions.map((permission) => permission.value))]
)

export const selectPrivateSearchDatasetIds = createSelector([selectUserData], (userData) =>
  getPrivateSearchDatasetIds(userData?.permissions)
)

const hasPrivateDatasetPermission = (group: string, permissionValues: string[]) => {
  const code = getPrivateGroupDatasetCode(group)
  return code !== undefined && permissionValues.some((value) => isPrivateGroupDataset(value, code))
}

export const selectPrivateUserGroupsWithDatasetPermission = createSelector(
  [selectPrivateUserGroups, selectPrivateDatasetPermissionValues],
  (privateUserGroups, permissionValues) => {
    return privateUserGroups.filter((group) => hasPrivateDatasetPermission(group, permissionValues))
  }
)

// Groups the user belongs to but has no private dataset permission for
// so the API configuration is missing even though the group is set up.
export const selectGroupsWithoutDatasetPermission = createSelector(
  [selectUserGroups, selectPrivateDatasetPermissionValues],
  (userGroups = [], permissionValues) => {
    return userGroups.filter(
      (group) =>
        getPrivateGroupDatasetCode(group) !== undefined &&
        !hasPrivateDatasetPermission(group, permissionValues)
    )
  }
)
