import { createSelector } from '@reduxjs/toolkit'
import { selectWorkspaces } from 'features/workspaces-list/workspaces-list.slice'
import { selectUserStatus, selectUserLogged, selectUserData } from './user.slice'

export const isUserLogged = createSelector(
  [selectUserStatus, selectUserLogged],
  (status, logged) => {
    return status === 'finished' && logged
  }
)

const LIMITED_ACCESS_USER = process.env.REACT_APP_LIMITED_ACCESS_USER === 'true'
export const isUserAuthorized = createSelector([isUserLogged, selectUserData], (logged, user) => {
  if (!logged) return false

  if (!LIMITED_ACCESS_USER) return true

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
