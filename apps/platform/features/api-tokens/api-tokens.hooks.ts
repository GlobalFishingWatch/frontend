import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useLoaderData, useRouter } from '@tanstack/react-router'

import { selectUserData } from 'features/_user/selectors/user.selectors'

export const API_TOKENS_ROUTE_ID = '/_platform/_content/datasets-and-api/api-tokens' as const

export function useApiTokens() {
  return useLoaderData({ from: API_TOKENS_ROUTE_ID })
}

export function useReloadApiTokens() {
  const router = useRouter()
  return useCallback(
    () => router.invalidate({ filter: (match) => match.routeId === API_TOKENS_ROUTE_ID }),
    [router]
  )
}

/** The loader reads the user, so login, logout and session end must re-run it */
export function useReloadApiTokensOnUserChange() {
  const userId = useSelector(selectUserData)?.id
  const reloadApiTokens = useReloadApiTokens()
  const loadedUserId = useRef(userId)
  useEffect(() => {
    if (loadedUserId.current !== userId) {
      loadedUserId.current = userId
      reloadApiTokens()
    }
  }, [userId, reloadApiTokens])
}
