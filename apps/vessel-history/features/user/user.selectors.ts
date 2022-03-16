import { createSelector } from '@reduxjs/toolkit'
import { selectUserData } from './user.slice'

const DEFAULT_GROUP_ID = 'Default'

export const selectUserGroups = createSelector([selectUserData], (userData) => {
    return userData?.groups
})
export const selectUserGroupsClean = createSelector([selectUserGroups], (userGroups) => {
    return userGroups?.filter((g) => g !== DEFAULT_GROUP_ID)
})