import { createSelector } from '@reduxjs/toolkit'
import { selectWorkspaces } from 'features/workspaces-list/workspaces-list.slice'
import { selectUserStatus, selectUserLogged, selectUserData, GUEST_USER_TYPE } from './user.slice'

export const isGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})

export const isUserLogged = createSelector(
  [selectUserStatus, selectUserLogged],
  (status, logged) => {
    return status === 'finished' && logged
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

export const selectUserWorkspaces = createSelector(
  [selectUserData, selectWorkspaces],
  (userData, workspaces) => {
    return workspaces?.filter((workspace) => workspace.ownerId === userData?.id).reverse()
  }
)
