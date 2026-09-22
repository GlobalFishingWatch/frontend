import { createSelector } from '@reduxjs/toolkit'

import type { UserGroupId } from '@globalfishingwatch/api-types'

import { selectUserData } from 'features/_user/selectors/user.selectors'
import { GFW_GROUP_ID, PRIVATE_SUPPORTED_GROUPS } from 'features/_user/user.config'

const selectUserGroups = createSelector([selectUserData], (userData) => {
  return userData?.groups
})

const selectIsGFWUserIgnoringExpiry = createSelector([selectUserGroups], (userGroups) => {
  return userGroups?.includes(GFW_GROUP_ID)
})

export const selectPrivateUserGroups = createSelector(
  [selectUserGroups, selectIsGFWUserIgnoringExpiry],
  (userGroups = [], gfwUser) => {
    const groupsWithAccess = gfwUser
      ? PRIVATE_SUPPORTED_GROUPS.map((g) => g.toLowerCase())
      : userGroups.filter((g) => PRIVATE_SUPPORTED_GROUPS.includes(g)).map((g) => g.toLowerCase())

    return groupsWithAccess as UserGroupId[]
  }
)
