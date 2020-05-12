import GFWAPI, { UserData } from '@globalfishingwatch/api-client'
import { useState, useEffect } from 'react'

import { getURLParameterByName, removeUrlParameterByName } from '../utils/url'

const accessTokenString = 'access-token'

interface GFWLoginHook {
  logged: boolean
  loading: boolean
  user: UserData | null
  error: string | undefined
}

const useGFWLogin = (APIClient: typeof GFWAPI = GFWAPI): GFWLoginHook => {
  const [state, setState] = useState<GFWLoginHook>({
    logged: false,
    loading: true,
    user: null,
    error: undefined,
  })

  useEffect(() => {
    const accessToken = getURLParameterByName(accessTokenString)
    APIClient.login({ accessToken })
      .then((user) => {
        const newState = user
          ? { loading: false, logged: true, user }
          : { loading: false, logged: false, error: 'no user' }

        setState((state) => ({ ...state, ...newState }))
        if (accessToken) {
          removeUrlParameterByName(accessTokenString)
        }
      })
      .catch((e) => {
        setState((state) => ({ ...state, loading: false, error: e }))
      })
  }, [APIClient])

  return state
}

export default useGFWLogin
