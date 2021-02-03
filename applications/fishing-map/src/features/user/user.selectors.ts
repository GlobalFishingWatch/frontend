import { createSelector } from '@reduxjs/toolkit'
import { selectWorkspaces } from 'features/workspaces-list/workspaces-list.slice'
import { AsyncReducerStatus } from 'types'
import {
  selectUserStatus,
  selectUserLogged,
  selectAllUserDatasets,
  GUEST_USER_TYPE,
  selectUserData,
} from './user.slice'

export const isGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})

export const isUserLogged = createSelector(
  [selectUserStatus, selectUserLogged],
  (status, logged) => {
    return status === AsyncReducerStatus.Finished && logged
  }
)

export const isUserAuthorized = createSelector([isUserLogged, selectUserData], (logged, user) => {
  return (
    user?.permissions.find(
      (permission) =>
        permission.type === 'application' &&
        permission.value === 'fishing-map' &&
        permission.action === 'map.load'
    ) !== undefined
  )
})

export const selectUserId = createSelector([selectUserData], (userData) => {
  return userData?.id
})

export const selectUserWorkspaces = createSelector(
  [selectUserData, selectWorkspaces],
  (userData, workspaces) => {
    return workspaces?.filter((workspace) => workspace.ownerId === userData?.id).reverse()
  }
)

export const selectUserDatasets = createSelector(
  [selectAllUserDatasets, selectUserId],
  (datasets, userId) => datasets?.filter((d) => d.ownerId === userId)
)
