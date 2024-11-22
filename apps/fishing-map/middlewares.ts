import { Middleware } from 'redux'
import { RootState } from 'reducers'
import { isRejectedWithValue, ThunkDispatch } from '@reduxjs/toolkit'
import { isUnauthorized } from '@globalfishingwatch/api-client'
import { AsyncError } from 'utils/async-slice'
import { setLoginExpired } from 'features/user/user.slice'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'

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
