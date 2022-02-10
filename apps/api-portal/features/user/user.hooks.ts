import { useCallback, useEffect, useMemo } from 'react'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { useSelector, useDispatch } from 'react-redux'
import { AsyncReducerStatus } from 'lib/async-slice'
import { useRouter } from 'next/router'
import { GFWAPI, getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import { UserPermission } from '@globalfishingwatch/api-types'
import {
  fetchUserThunk,
  isGuestUser,
  logoutUserThunk,
  selectUserData,
  selectUserLogged,
  selectUserStatus,
} from './user.slice'

export type UserAction = 'read' | 'create' | 'delete'

export const checkUserApplicationPermission = (
  action: UserAction,
  permissions: UserPermission[]
) => {
  const permission = { type: 'entity', value: 'user-application', action }
  return checkExistPermissionInList(permissions, permission)
}

export const useUser = (redirectToLogin: boolean) => {
  const dispatch = useDispatch()

  const logged = useSelector(selectUserLogged)
  const user = useSelector(selectUserData)
  const guestUser = useSelector(isGuestUser)
  const status = useSelector(selectUserStatus)
  const router = useRouter()

  const accessToken = typeof window === 'undefined' ? null : getAccessTokenFromUrl()
  const token = GFWAPI.getToken()
  const refreshToken = GFWAPI.getRefreshToken()
  const loading = status !== AsyncReducerStatus.Finished && status !== AsyncReducerStatus.Idle
  const loggingIn = !!accessToken

  const authorized = useMemo(() => {
    return user && checkUserApplicationPermission('read', user.permissions)
  }, [user])

  const logout = useCallback(() => {
    dispatch(logoutUserThunk({ loginRedirect: true }))
  }, [dispatch])

  const loginLink = GFWAPI.getLoginUrl(
    typeof window === 'undefined' ? '' : window.location.toString()
  )

  if (redirectToLogin && !loading && !user && !logged && !loggingIn && loginLink) {
    router.push(loginLink)
  }

  useEffect(() => {
    if (!logged && (token || refreshToken || accessToken)) {
      dispatch(fetchUserThunk({ guest: false }))
    }
  }, [accessToken, dispatch, logged, refreshToken, token])

  return {
    loading,
    logged,
    user,
    guestUser,
    authorized,
    logout,
  }
}
