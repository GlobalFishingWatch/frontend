import { useCallback, useEffect, useMemo, useState } from 'react'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { useSelector } from 'react-redux'
import { AsyncReducerStatus } from 'lib/async-slice'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'app/hooks'
import { GFWAPI, getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import { UserPermission } from '@globalfishingwatch/api-types'
import {
  fetchUserThunk,
  isGuestUser,
  logoutUserThunk,
  selectUserData,
  selectUserLogged,
  selectUserStatus,
  updateUserAdditionaInformationThunk,
  UserApiAdditionalInformation,
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
  const dispatch = useAppDispatch()

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

  useEffect(() => {
    if (!logged && !loading && (token || refreshToken || accessToken)) {
      dispatch(fetchUserThunk({ guest: false }))
    } else if (
      redirectToLogin &&
      !loading &&
      ((!user && !logged) || guestUser) &&
      !loggingIn &&
      loginLink
    ) {
      router.push(loginLink)
    }
  }, [
    accessToken,
    dispatch,
    guestUser,
    loading,
    logged,
    loggingIn,
    loginLink,
    redirectToLogin,
    refreshToken,
    router,
    token,
    user,
  ])

  return {
    loading,
    logged,
    user,
    guestUser,
    authorized,
    logout,
  }
}

export const useUserAdditionalInformation = () => {
  const dispatch = useAppDispatch()
  const user: UserApiAdditionalInformation = useSelector(selectUserData)
  const status = useSelector(selectUserStatus)
  const [userAdditionalInformation, setUserAdditionalInformation] =
    useState<UserApiAdditionalInformation>(user)

  const update = useCallback(() => {
    dispatch(updateUserAdditionaInformationThunk(userAdditionalInformation))
  }, [dispatch, userAdditionalInformation])

  return {
    userAdditionalInformation,
    setUserAdditionalInformation,
    status,
    update,
  }
}
