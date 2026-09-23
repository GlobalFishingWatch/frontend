import { createSelector } from '@reduxjs/toolkit'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import {
  ADMIN_GROUP_ID,
  GFW_DEV_GROUP_ID,
  GFW_GROUP_ID,
  GFW_TEST_GROUP_ID,
  JAC_GROUP_ID,
} from '@globalfishingwatch/datasets-client'

import type { RootState } from 'reducers'

export const selectUserData = (state: RootState) => state.user.data
export const selectUserLogged = (state: RootState) => state.user.logged
export const selectIsUserExpired = (state: RootState) => state.user.expired
export const selectUserSettings = (state: RootState) => state.user.settings
export const selectUserLanguage = (state: RootState) => state.user.language
export const selectLoginSource = (state: RootState) => state.user.loginSource

const selectActiveUserGroups = createSelector(
  [selectUserData, selectIsUserExpired],
  (userData, isUserExpired) => (isUserExpired ? undefined : userData?.groups)
)

export const selectUserGroups = createSelector([selectActiveUserGroups], (userGroups) => {
  return (userGroups || []).map((group) => group.toLowerCase())
})

export const selectIsGFWUser = createSelector([selectActiveUserGroups], (userGroups) => {
  return userGroups?.includes(GFW_GROUP_ID)
})

export const selectIsJACUser = createSelector([selectActiveUserGroups], (userGroups) => {
  return userGroups?.includes(JAC_GROUP_ID)
})

export const selectIsGFWAdminUser = createSelector([selectActiveUserGroups], (userGroups) => {
  return userGroups?.some((g) => g.toLowerCase() === ADMIN_GROUP_ID.toLowerCase())
})
export const selectIsGFWDeveloper = createSelector([selectActiveUserGroups], (userGroups) => {
  return userGroups?.includes(GFW_DEV_GROUP_ID)
})
export const selectIsGFWTestGroup = createSelector([selectActiveUserGroups], (userGroups) => {
  return userGroups?.includes(GFW_TEST_GROUP_ID)
})

export const selectIsGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})
