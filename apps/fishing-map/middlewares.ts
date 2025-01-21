import type { ThunkDispatch } from '@reduxjs/toolkit'
import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'
import type { Middleware } from 'redux'

import { isUnauthorized } from '@globalfishingwatch/api-client'

import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { setLoginExpired } from 'features/user/user.slice'
import type { AsyncError } from 'utils/async-slice'

export const logoutUserMiddleware: Middleware =
  ({
    getState,
    dispatch,
  }: {
    getState: () => RootState
    dispatch: ThunkDispatch<RootState, any, any>
  }) =>
  (next) =>
  (action) => {
    if (isRejectedWithValue(action)) {
      const state = getState()
      const isGuestUser = selectIsGuestUser(state)
      if (!isGuestUser && isUnauthorized(action.payload as AsyncError)) {
        dispatch(setLoginExpired(true))
      }
    }
    next(action)
  }
