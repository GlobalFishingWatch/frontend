import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { useRouter } from 'next/router'

import {
  getAccessTokenFromUrl,
  GFWAPI,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import type { UserApiAdditionalInformation, UserPermission } from '@globalfishingwatch/api-types'

const fetchUser = async (accessToken) => {
  if (accessToken) {
    removeAccessTokenFromUrl()
  }

  return await GFWAPI.login({ accessToken }).catch((error) => {
    return null
  })
}
type UserAction = 'read' | 'create' | 'delete'
export const checkUserApplicationPermission = (
  action: UserAction,
  permissions: UserPermission[]
) => {
  const permission = { type: 'entity', value: 'user-application', action }
  return checkExistPermissionInList(permissions, permission)
}

const logoutUser = async () => {
  await GFWAPI.logout()
}

export const useUser = () => {
  const accessToken = typeof window === 'undefined' ? null : getAccessTokenFromUrl()
  const queryResult = useQuery(['user'], () => fetchUser(accessToken), {})
  const token = GFWAPI.getToken()
  const refreshToken = GFWAPI.getRefreshToken()
  const { data: user } = queryResult

  const authorized = useMemo(() => {
    return user && checkUserApplicationPermission('read', user.permissions)
  }, [user])

  const loginLink = GFWAPI.getLoginUrl(
    typeof window === 'undefined' ? '' : window.location.toString()
  )

  const queryClient = useQueryClient()
  const logout = useMutation(logoutUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user'])
    },
  })

  const isUserApplicationsRequiredInfoCompleted = useMemo(
    () => user && user.intendedUse && user.whoEndUsers && user.problemToResolve && !!user.apiTerms,
    [user]
  )

  return {
    ...queryResult,
    authorized,
    isUserApplicationsRequiredInfoCompleted,
    loginLink,
    logout,
    refreshToken,
    token,
  }
}

const updateUserAdditionalFields = async (
  userAdditionalInformation: UserApiAdditionalInformation
) => {
  const data = { ...userAdditionalInformation }
  Object.keys(data).forEach((key) => data[key] === null && delete data[key])
  const result = await GFWAPI.fetch(`/auth/me`, {
    method: 'PATCH',
    body: data as any,
  })
  return (result ? result : data) as any
}
export const useUpdateUserAdditionalInformation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation(updateUserAdditionalFields, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user'])
      router.replace('/')
    },
  })
}

export const useUserAdditionalInformation = () => {
  const queryClient = useQueryClient()
  return useMutation(updateUserAdditionalFields, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user'])
    },
  })
}

export default useUser
