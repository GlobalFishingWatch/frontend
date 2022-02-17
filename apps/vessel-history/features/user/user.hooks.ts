import { useCallback, useEffect, useMemo } from 'react'
import { event as uaEvent } from 'react-ga'
import { useSelector, useDispatch } from 'react-redux'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { GFWAPI, getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import { AUTHORIZED_PERMISSION } from 'data/config'
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
    return user && checkExistPermissionInList(user.permissions, AUTHORIZED_PERMISSION)
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
