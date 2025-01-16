import { useEffect, useState } from 'react'

import {
    getAccessTokenFromUrl,
    removeAccessTokenFromUrl,
  } from '@globalfishingwatch/api-client'

export const useGFWLogin = (APIClient) => {
    const [state, setState] = useState({
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