import { useCallback, useEffect, useMemo } from 'react'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { useSelector, useDispatch } from 'react-redux'
import { AsyncReducerStatus } from 'lib/async-slice'
import { GFWAPI, getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import { UserPermission } from '@globalfishingwatch/api-types'
import { APPLICATION_ID } from 'components/data/config'
import {
  fetchUserThunk,
  logoutUserThunk,
  selectUserData,
  selectUserLogged,
  selectUserStatus,
} from './user.slice'

export const checkActionPermission = (action: string, permissions: UserPermission[]) => {
  const permission = { type: 'application', value: APPLICATION_ID, action }
  return checkExistPermissionInList(permissions, permission)
}

export const useUser = () => {
  const dispatch = useDispatch()

  const logged = useSelector(selectUserLogged)
  const user = useSelector(selectUserData)
  const status = useSelector(selectUserStatus)

  const accessToken = typeof window === 'undefined' ? null : getAccessTokenFromUrl()
  const token = GFWAPI.getToken()
  const refreshToken = GFWAPI.getRefreshToken()

  const authorized = useMemo(() => {
    // TODO: Check for specific permission to access the minisite if required
    return user // && checkActionPermission('read', user.permissions)
  }, [user])

  const logout = useCallback(() => {
    dispatch(logoutUserThunk({ loginRedirect: false }))
  }, [dispatch])

  useEffect(() => {
    if (!logged && (token || refreshToken || accessToken)) {
      dispatch(fetchUserThunk({ guest: false }))
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
