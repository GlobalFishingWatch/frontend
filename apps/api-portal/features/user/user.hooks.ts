import { useCallback, useEffect, useMemo, useState } from 'react'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { useSelector } from 'react-redux'
import { AsyncReducerStatus } from 'lib/async-slice'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'app/hooks'
import { GFWAPI, getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import {
  UserApiAdditionalInformation,
  UserPermission,
  USER_APPLICATION_INTENDED_USES,
} from '@globalfishingwatch/api-types'
import {
  fetchUserThunk,
  isGuestUser,
  logoutUserThunk,
  selectUserData,
  selectUserLogged,
  selectUserStatus,
  selectUserUpdateStatus,
  updateUserAdditionaInformationThunk,
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

type FieldValidationError<T> = {
  [Field in keyof T]: string
}

export const useUserAdditionalInformation = () => {
  const dispatch = useAppDispatch()
  const user = useSelector(selectUserData)
  const defaultUserAdditionalInformation: UserApiAdditionalInformation = {
    apiTerms: user.apiTerms,
    intendedUse: user.intendedUse,
    problemToResolve: user.problemToResolve,
    pullingDataOtherAPIS: user.pullingDataOtherAPIS,
    whoEndUsers: user.whoEndUsers,
  }
  const fetchStatus = useSelector(selectUserStatus)
  const status = useSelector(selectUserUpdateStatus)
  const [userAdditionalInformation, setUserAdditionalInformation] =
    useState<UserApiAdditionalInformation>(defaultUserAdditionalInformation)
  const router = useRouter()

  const error = useMemo(() => {
    const errors: FieldValidationError<UserApiAdditionalInformation> = {}
    const { apiTerms, intendedUse, problemToResolve, whoEndUsers } = userAdditionalInformation

    if (!intendedUse || !USER_APPLICATION_INTENDED_USES.includes(intendedUse as any)) {
      errors.intendedUse = 'Intended Use is required'
    }
    if (!whoEndUsers) {
      errors.whoEndUsers = 'Who are your end users is required'
    }
    if (!problemToResolve) {
      errors.problemToResolve = 'Problems to solve is required'
    }
    if (!apiTerms) {
      errors.apiTerms = 'API terms of use and attribution must be accepted.'
    }
    return errors
  }, [userAdditionalInformation])

  const valid = useMemo(() => Object.keys(error).length === 0, [error])

  const loading =
    fetchStatus !== AsyncReducerStatus.Finished && fetchStatus !== AsyncReducerStatus.Idle

  const update = useCallback(() => {
    if (valid) {
      dispatch(updateUserAdditionaInformationThunk(userAdditionalInformation))
    }
  }, [dispatch, userAdditionalInformation, valid])

  useEffect(() => {
    status === AsyncReducerStatus.Finished && router.replace('/')
  }, [router, status])

  return {
    error,
    loading,
    setUserAdditionalInformation,
    status,
    update,
    userAdditionalInformation,
    valid,
  }
}
