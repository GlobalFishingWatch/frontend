import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { NavigateOptions } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { parse } from 'qs'

import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'
import { parseWorkspace } from '@globalfishingwatch/dataviews-client'
import { DEFAULT_CALLBACK_URL_PARAM, useLoginRedirect } from '@globalfishingwatch/react-hooks'

import { SHOW_LEAVE_CONFIRMATION } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { selectSuggestWorkspaceSave } from 'features/workspace/workspace.selectors'
import { setWorkspaceHistoryNavigation } from 'features/workspace/workspace.slice'
import {
  selectIsRouteWithWorkspace,
  selectLocationPayload,
  selectLocationTo,
} from 'router/routes.selectors'
import type { QueryParams } from 'types'

import type { NavigationState } from './router-sync'
import { cleanAccessTokenQueryParams } from './routes.utils'

// TanStack Router's navigate() without a `to` param resolves search to `never`
// because it can't infer the current route's search type at compile time.
// These helpers operate across all routes, so we define a route-agnostic options type.
type AppNavigateOptions = NavigateOptions & {
  search?: QueryParams | ((prev: QueryParams) => QueryParams)
}

export function useReplaceQueryParams() {
  const router = useRouter()

  const replaceQueryParams = useCallback(
    (search: Partial<QueryParams>, { skipHistoryNavigation = true } = {}) => {
      const navState: NavigationState = { skipHistoryNavigation }
      const opts: AppNavigateOptions = {
        replace: true,
        resetScroll: false,
        search: (prev: QueryParams) => ({ ...prev, ...search }),
        state: (prev) => ({ ...prev, ...navState }),
      }
      router.navigate(opts)
    },
    [router]
  )

  const cleanQueryParams = useCallback(() => {
    const opts: AppNavigateOptions = {
      replace: true,
      resetScroll: false,
      search: () => ({}) as QueryParams,
    }
    router.navigate(opts)
  }, [router])

  return useMemo(
    () => ({ replaceQueryParams, cleanQueryParams }),
    [replaceQueryParams, cleanQueryParams]
  )
}

export const useBeforeUnload = () => {
  const dispatch = useAppDispatch()
  const isRouteWithWorkspace = useSelector(selectIsRouteWithWorkspace)
  const suggestWorkspaceSave = useSelector(selectSuggestWorkspaceSave)
  const isGuestUser = useSelector(selectIsGuestUser)

  const beforeUnLoad = useCallback(
    (e: BeforeUnloadEvent) => {
      e.preventDefault()
      setTimeout(() => {
        dispatch(setModalOpen({ id: 'createWorkspace', open: true }))
      }, 400)
    },
    [dispatch]
  )

  useEffect(() => {
    if (isRouteWithWorkspace && suggestWorkspaceSave && !isGuestUser && SHOW_LEAVE_CONFIRMATION) {
      window.addEventListener('beforeunload', beforeUnLoad)
    }
    return () => {
      window.removeEventListener('beforeunload', beforeUnLoad)
    }
  }, [beforeUnLoad, dispatch, isGuestUser, isRouteWithWorkspace, suggestWorkspaceSave])
}

export const useReplaceLoginUrl = () => {
  const router = useRouter()
  const { redirectUrl, historyNavigation, cleanRedirectUrl } = useLoginRedirect()
  const dispatch = useAppDispatch()
  const locationTo = useSelector(selectLocationTo)
  const locationParams = useSelector(selectLocationPayload)

  useEffect(() => {
    const currentQuery = parse(window.location.search, { ignoreQueryPrefix: true })
    const hasCallbackUrlStorageQuery = currentQuery[DEFAULT_CALLBACK_URL_PARAM]
    const accessToken = currentQuery[ACCESS_TOKEN_STRING]
    if (redirectUrl && hasCallbackUrlStorageQuery) {
      const query = {
        ...parseWorkspace(new URL(redirectUrl).search),
        [ACCESS_TOKEN_STRING]: accessToken,
        [DEFAULT_CALLBACK_URL_PARAM]: undefined,
      } as QueryParams

      const to = locationTo || '/'
      const params = locationParams

      router.navigate({
        to: to as string,
        params,
        search: (prev: QueryParams) => cleanAccessTokenQueryParams({ ...prev, ...query }),
        replace: true,
        resetScroll: false,
      })

      if (historyNavigation && historyNavigation.length > 0) {
        dispatch(setWorkspaceHistoryNavigation(historyNavigation))
      }

      cleanRedirectUrl()
    }
    return () => {
      // ensures the localStorage is clean when the app is unmounted
      cleanRedirectUrl()
    }
  }, [])
}
