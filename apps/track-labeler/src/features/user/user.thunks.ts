import type { Dispatch } from 'redux'
import type { StateGetter } from 'redux-first-router'

import { GFWAPI } from '@globalfishingwatch/api-client'

import { selectLocationQuery } from '../../routes/routes.selectors'
import type { AppState } from '../../types/redux.types'

import { fetchUserComplete, fetchUserError,fetchUserInit } from './user.actions'
import { isUserLogged, userLoaded } from './user.slice'

export const userLoginThunk = async (
  dispatch: Dispatch,
  getState: StateGetter<AppState>
): Promise<boolean> => {
  const query = selectLocationQuery(getState())
  const accessToken = query ? query['access-token'] : ''

  try {
    dispatch(fetchUserInit())
    const user = await GFWAPI.login({ accessToken })
    if (user) {
      dispatch(userLoaded(user))
      dispatch(fetchUserComplete({ data: user }))
      return true
    }
    return false
  } catch (e: any) {
    dispatch(fetchUserError({ error: e }))
    return false
  }
}

export const checkUserLoggedThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const userLogged = isUserLogged(state)
  return userLogged || userLoginThunk(dispatch, getState)
}
