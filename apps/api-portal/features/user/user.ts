import { useMutation, useQuery, useQueryClient } from 'react-query'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { ApiError } from 'next/dist/server/api-utils'
import {
  getAccessTokenFromUrl,
  GFWAPI,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import { UserApiAdditionalInformation, UserPermission } from '@globalfishingwatch/api-types'
import { PATH_BASENAME } from 'components/data/config'
import useAuthedQuery from 'hooks/authed-query.hooks'

const fetchUser = async () => {
  const response = await fetch(`${PATH_BASENAME}/api/user/me`)
  const data = await response.json()
  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? 'Could not retrieve user data')
  }
  return data

  // .then((response) => response.json())
  // .catch((error) => {
  //   return null
  // })
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
  await signOut()
}

export const useUser = () => {
  const queryClient = useQueryClient()
  const queryResult = useAuthedQuery(['user'], () => fetchUser(), {})
  const token = GFWAPI.getToken()
  const refreshToken = GFWAPI.getRefreshToken()

  const { data: user } = queryResult

  const {
    // data: session,
    status,
  } = useSession()
  const authenticated = status === 'authenticated'
  const loading = status === 'loading'

  const authorized = useMemo(() => {
    return (
      user &&
      user.permissions &&
      authenticated &&
      checkUserApplicationPermission('read', user.permissions)
    )
  }, [user])

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
