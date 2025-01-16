import { useEffect,useState } from 'react'

import {
  getAccessTokenFromUrl,
  GFWAPI,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

export interface GFWLoginHook {
  logged: boolean
  loading: boolean
  user: UserData | null
  error: string | undefined
}

export const useGFWLoginRedirect = ({ logged, loading }: GFWLoginHook) => {
  if (logged === false && loading === false && typeof window !== 'undefined') {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }
}

export const useGFWLogin = (APIClient: typeof GFWAPI = GFWAPI): GFWLoginHook => {
  const [state, setState] = useState<GFWLoginHook>({
    logged: false,
    loading: true,
    user: null,
    error: undefined,
  })

  useEffect(() => {
    const accessToken = getAccessTokenFromUrl()
    APIClient.login({ accessToken })
      .then((user) => {
        const newState = user
          ? { loading: false, logged: true, user }
          : { loading: false, logged: false, error: 'no user' }

        setState((state) => ({ ...state, ...newState }))
        if (accessToken) {
          removeAccessTokenFromUrl()
        }
      })
      .catch((e) => {
        setState((state) => ({ ...state, loading: false, error: e }))
      })
  }, [APIClient])

  return state
}
