import { createSelector } from '@reduxjs/toolkit'
import { GUEST_USER_TYPE, selectUserData } from 'features/user/user.slice'

export const isGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})
