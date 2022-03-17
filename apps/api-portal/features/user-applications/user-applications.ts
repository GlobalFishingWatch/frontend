import { stringify } from 'qs'
import { useQuery } from 'react-query'
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

function useUserApplications(userId) {
  return useQuery(['user-applications', userId], () => fetchUserApplications(userId), {})
}
export default useUserApplications
