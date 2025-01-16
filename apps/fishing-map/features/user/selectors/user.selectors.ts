import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'

import {
  ADMIN_GROUP_ID,
  GFW_DEV_GROUP_ID,
  GFW_GROUP_ID,
  JAC_GROUP_ID,
} from 'features/user/user.config'
import { AsyncReducerStatus } from 'utils/async-slice'

export const selectUserData = (state: RootState) => state.user.data
const selectUserStatus = (state: RootState) => state.user.status
export const selectUserLogged = (state: RootState) => state.user.logged
export const selectIsUserExpired = (state: RootState) => state.user.expired
export const selectUserSettings = (state: RootState) => state.user.settings

export const selectIsGFWUser = createSelector([selectUserData], (userData) => {
  return userData?.groups.includes(GFW_GROUP_ID)
})

export const selectIsJACUser = createSelector([selectUserData], (userData) => {
  return userData?.groups.includes(JAC_GROUP_ID)
})

export const selectIsGFWAdminUser = createSelector([selectUserData], (userData) => {
  return userData?.groups.includes(ADMIN_GROUP_ID)
})
export const selectIsGFWDeveloper = createSelector([selectUserData], (userData) => {
  return userData?.groups.includes(GFW_DEV_GROUP_ID)
})

export const selectIsGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})

export const selectIsUserLogged = createSelector(
  [selectUserStatus, selectUserLogged],
  (status, logged) => {
    return status === AsyncReducerStatus.Finished && logged
  }
)
