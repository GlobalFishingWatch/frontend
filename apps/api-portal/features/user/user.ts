import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useRouter } from 'next/router'

import {
  getAccessTokenFromUrl,
  GFWAPI,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import type { UserApiAdditionalInformation, UserPermission } from '@globalfishingwatch/api-types'
import { checkExistPermissionInList } from '@globalfishingwatch/auth-middleware/utils'

const fetchUser = async (accessToken: string) => {
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
  const queryResult = useQuery(
    ['user'],
    () => {
      if (!accessToken) return null
      return fetchUser(accessToken)
    },
    {}
  )
  const token = GFWAPI.token
  const refreshToken = GFWAPI.refreshToken
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
  Object.keys(data).forEach(
    (key) =>
      data[key as keyof UserApiAdditionalInformation] === null &&
      delete data[key as keyof UserApiAdditionalInformation]
  )
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
