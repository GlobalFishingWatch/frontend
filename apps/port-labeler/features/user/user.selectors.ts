import { createSelector } from '@reduxjs/toolkit'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'

import type { UserPermission } from '@globalfishingwatch/api-types'

import { AsyncReducerStatus } from 'utils/async-slice'

import { selectUserData,selectUserLogged, selectUserStatus } from './user.slice'

const DEFAULT_GROUP_ID = 'Default'
const PRIVATE_SUPPORTED_GROUPS = ['Indonesia', 'Peru', 'Panama', 'Brazil', 'Mexico', 'Ecuador']

export const isUserLogged = createSelector(
  [selectUserStatus, selectUserLogged],
  (status, logged) => {
    return status === AsyncReducerStatus.Finished && logged
  }
)

export const hasUserPermission = (permission: UserPermission) =>
  createSelector([selectUserData], (userData) => {
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

export const selectUserId = createSelector([selectUserData], (userData) => {
  return userData?.id
})

export const selectUserGroups = createSelector([selectUserData], (userData) => {
  return userData?.groups
})

export const selectUserGroupsClean = createSelector([selectUserGroups], (userGroups) => {
  return userGroups?.filter((g) => g !== DEFAULT_GROUP_ID)
})
