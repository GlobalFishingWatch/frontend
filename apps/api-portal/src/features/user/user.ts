import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from '@tanstack/react-router'

import {
  getAccessTokenFromUrl,
  GFWAPI,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import type { UserApiAdditionalInformation, UserPermission } from '@globalfishingwatch/api-types'
import { checkExistPermissionInList } from '@globalfishingwatch/auth-middleware/utils'

const fetchUser = async (accessToken: string | null) => {
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
  const queryResult = useQuery(
    ['user'],
    () => {
      const accessToken = typeof window === 'undefined' ? null : getAccessTokenFromUrl()
      return fetchUser(accessToken)
    },
    { staleTime: 5 * 60 * 1000 }
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
  const navigate = useNavigate()
  return useMutation(updateUserAdditionalFields, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user'])
      navigate({ to: '/' })
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
