import { useCallback, useEffect, useMemo } from 'react'
import { intersection } from 'lodash'
import { event as uaEvent } from 'react-ga'
import { useSelector, useDispatch } from 'react-redux'
import { GFWAPI, getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import { AUTHORIZED_USER_GROUPS } from 'data/config'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  fetchUserThunk,
  logoutUserThunk,
  selectUserData,
  selectUserLogged,
  selectUserStatus,
} from './user.slice'

export const useUser = () => {
  const dispatch = useDispatch()

  const logged = useSelector(selectUserLogged)
  const user = useSelector(selectUserData)
  const status = useSelector(selectUserStatus)

  const accessToken = getAccessTokenFromUrl()
  const token = GFWAPI.getToken()
  const refreshToken = GFWAPI.getRefreshToken()

  const authorized = useMemo(() => {
    return user && intersection(user.groups, AUTHORIZED_USER_GROUPS).length > 0
  }, [user])

  const logout = useCallback(() => {
    uaEvent({
      category: 'General VV features',
      action: 'Logout',
    })
    dispatch(logoutUserThunk({ redirectTo: 'home' }))
  }, [dispatch])

  useEffect(() => {
    if (!logged && (token || refreshToken || accessToken)) {
      dispatch(fetchUserThunk())
    }
  }, [accessToken, dispatch, logged, refreshToken, token])

  return {
    loading: status !== AsyncReducerStatus.Finished && status !== AsyncReducerStatus.Idle,
    logged,
    user,
    authorized,
    logout,
  }
}
