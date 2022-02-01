import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { AppState } from 'types/redux.types'
import { getLocationQuery } from 'redux-modules/router/route.selectors'
import { fetchUserInit, fetchUserComplete, fetchUserError } from './user.actions'
import { isUserLogged } from './user.selectors'

export const userLoginThunk = async (
  dispatch: Dispatch,
  getState: StateGetter<AppState>
): Promise<boolean> => {
  const query = getLocationQuery(getState())
  const accessToken = query ? query['access-token'] : ''

  try {
    dispatch(fetchUserInit())
    const user = await GFWAPI.login({ accessToken })
    if (user) {
      dispatch(fetchUserComplete({ data: user }))
      return true
    }
    return false
  } catch (e) {
    dispatch(fetchUserError({ error: e }))
    return false
  }
}

export const checkuserLoggedThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const userLogged = isUserLogged(state)
  return userLogged || userLoginThunk(dispatch, getState)
}
