import { Middleware } from 'redux'
import { RootState } from 'reducers'
import { isRejectedWithValue, ThunkDispatch } from '@reduxjs/toolkit'
import { isAuthError } from '@globalfishingwatch/api-client'
import { AsyncError } from 'utils/async-slice'
import { setLoginExpired } from 'features/user/user.slice'

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
      if (isAuthError(action.payload as AsyncError)) {
        dispatch(setLoginExpired(true))
      }
    }
    next(action)
  }
