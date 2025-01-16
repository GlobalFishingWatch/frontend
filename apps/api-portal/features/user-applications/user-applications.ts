import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import type { FieldValidationError } from 'lib/types'
import { stringify } from 'qs'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { APIPagination, UserApplication } from '@globalfishingwatch/api-types'

import useUser, { checkUserApplicationPermission } from 'features/user/user'

export type UserApplicationCreateArguments = Omit<
  UserApplication,
  'id' | 'token' | 'createdAt' | 'userId'
>

async function fetchUserApplications(userId: number, limit = 0, offset = 0) {
  const query = stringify({
    'user-id': userId,
    ...((limit && { limit }) || {}),
    ...((offset && { offset }) || {}),
  })
  const url = `/auth/user-applications?${query}`
  const data = await GFWAPI.fetch<APIPagination<UserApplication>>(url).catch((error) => {
    return null
  })
  return data
}

export const useUserApplications = (userId) =>
  useQuery(['user-applications', userId], () => fetchUserApplications(userId), {})

async function deleteUserApplication(id: number) {
  const url = `/auth/user-applications/${id}`
  const userApplication = await GFWAPI.fetch<UserApplication>(url, {
    method: 'DELETE',
    responseType: 'default',
  })
  return { ...userApplication, id }
}

export const useDeleteUserApplication = (userId) => {
  const queryClient = useQueryClient()
  return useMutation(deleteUserApplication, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user-applications', userId])
    },
  })
}

export default useUserApplications

function createUserApplication(userId) {
  return async function (newUserApplication: UserApplicationCreateArguments) {
    const url = `/auth/user-applications`
    return await GFWAPI.fetch<UserApplication>(url, {
      method: 'POST',
      body: { ...newUserApplication, userId } as any,
    })
  }
}

const emptyToken: UserApplicationCreateArguments = {
  description: '',
  name: '',
}
export const useCreateUserApplication = () => {
  const { data: user } = useUser()
  const userId = user?.id ?? null

  const isAllowed = user?.permissions
    ? checkUserApplicationPermission('create', user?.permissions)
    : false

  const [token, setToken] = useState<UserApplicationCreateArguments>(emptyToken)

  const error = useMemo(() => {
    const errors: FieldValidationError<UserApplicationCreateArguments> = {}
    const { name, description } = token

    if (!name || name.length < 3) {
      errors.name = 'Application Name is required and must be at least three characters length.'
    }
    if (!description) {
      errors.description = 'Description is required'
    }
    return errors
  }, [token])

  const valid = useMemo(() => Object.keys(error).length === 0, [error])

  const queryClient = useQueryClient()
  const mutation = useMutation(createUserApplication(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['user-applications', userId])
      setToken(emptyToken)
    },
  })

  return {
    ...mutation,
    isAllowed,
    token,
    setToken,
    valid,
  }
}
