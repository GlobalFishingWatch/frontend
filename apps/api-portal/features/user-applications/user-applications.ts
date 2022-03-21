import { stringify } from 'qs'
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query'
import { useMemo, useState, useEffect } from 'react'
import { FieldValidationError } from 'lib/types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { UserApplication } from '@globalfishingwatch/api-types'
import useUser, { checkUserApplicationPermission } from 'features/user/user'
import { UserApplicationCreateArguments } from './user-applications.slice'

export interface UserApplicationFetchResponse {
  offset: number
  metadata: any
  total: number
  limit: number | null
  nextOffset: number
  entries: UserApplication[]
}

async function fetchUserApplications(userId: number, limit = 0, offset = 0) {
  const query = stringify({
    'user-id': userId,
    ...((limit && { limit }) || {}),
    ...((offset && { offset }) || {}),
  })
  const url = `/v2/auth/user-applications?${query}`
  const data = await GFWAPI.fetch<UserApplicationFetchResponse>(url).catch((error) => {
    return null
  })
  return data
}

export const useUserApplications = (userId) =>
  useQuery(['user-applications', userId], () => fetchUserApplications(userId), {})

async function deleteUserApplication(id: number) {
  const url = `/v2/auth/user-applications/${id}`
  const userApplication = await GFWAPI.fetch<UserApplication>(url, {
    method: 'DELETE',
    responseType: 'default',
  })
  return { ...userApplication, id }
}

export const useDeleteUserApplication = (userId) => {
  // const url = `/v2/auth/user-applications?user-id=${userId}`

  const queryClient = useQueryClient()
  return useMutation(deleteUserApplication, {
    onSuccess: () => {
      queryClient.invalidateQueries(['user-applications', userId])
    },
  })
}

export default useUserApplications

const emptyToken: UserApplicationCreateArguments = {
  description: '',
  name: '',
  userId: null,
}

async function createUserApplication(newUserApplication: UserApplicationCreateArguments) {
  const url = `/v2/auth/user-applications`
  return await GFWAPI.fetch<UserApplication>(url, {
    method: 'POST',
    body: newUserApplication as any,
    // signal,
  })
}
export const useCreateUserApplication = () => {
  const { data: user } = useUser()

  const isAllowed = checkUserApplicationPermission('create', user.permissions)

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
  const mutation = useMutation(createUserApplication, {
    onSuccess: () => {
      const url = `/v2/auth/user-applications?user-id=${user?.id}`
      console.log(url)
      queryClient.invalidateQueries(['user-applications', user?.id])
      setToken(emptyToken)
    },
  })
  useEffect(() => {
    setToken({ ...token, userId: user.id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  return {
    ...mutation,
    isAllowed,
    token,
    setToken,
    valid,
  }
}
