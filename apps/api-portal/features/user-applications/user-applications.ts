import { stringify } from 'qs'
import { useMutation, useQuery } from 'react-query'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { UserApplication } from '@globalfishingwatch/api-types'

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

export const useDeleteUserApplication = () => useMutation(deleteUserApplication)

export default useUserApplications
