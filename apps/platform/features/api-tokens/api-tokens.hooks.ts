import { useCallback } from 'react'
import { useLoaderData, useRouter } from '@tanstack/react-router'

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
