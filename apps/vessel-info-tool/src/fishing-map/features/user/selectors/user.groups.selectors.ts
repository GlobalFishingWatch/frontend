import { createSelector } from '@reduxjs/toolkit'

import { selectIsGFWUser, selectUserData } from 'features/user/selectors/user.selectors'
import { PRIVATE_SUPPORTED_GROUPS } from 'features/user/user.config'

import type { UserGroup } from '../user.slice'

const selectUserGroups = createSelector([selectUserData], (userData) => {
  return userData?.groups
})

export const selectPrivateUserGroups = createSelector(
  [selectUserGroups, selectIsGFWUser],
  (userGroups = [], gfwUser) => {
    const groupsWithAccess = gfwUser
      ? PRIVATE_SUPPORTED_GROUPS.map((g) => g.toLowerCase())
      : userGroups.filter((g) => PRIVATE_SUPPORTED_GROUPS.includes(g)).map((g) => g.toLowerCase())

    return groupsWithAccess as UserGroup[]
  }
)
