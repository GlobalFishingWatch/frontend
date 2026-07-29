import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { NavigateOptions } from '@tanstack/react-router'
import { useRouter, useSearch } from '@tanstack/react-router'

import { SHOW_LEAVE_CONFIRMATION } from 'data/map/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectSuggestWorkspaceSave } from 'features/map/workspace/workspace.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { selectIsRouteWithWorkspace } from 'router/routes.selectors'
import type { QueryParams } from 'types'

// TanStack Router's navigate() without a `to` param resolves search to `never`
// because it can't infer the current route's search type at compile time.
// These helpers operate across all routes, so we define a route-agnostic options type.
type AppNavigateOptions = NavigateOptions & {
  search?: QueryParams | ((prev: QueryParams) => QueryParams)
}

/**
 * Root search params, read without binding to a layout route.
 *
 * `Route.useSearch()` from a specific layout would couple callers to one shell, but these params come
 * from `rootSearchSchema`, which BOTH shells validate — so components rendered in either (content
 * panel, markdown links) must not care which one they are in. Loose read, typed once here.
 */
export function useAppSearch(): QueryParams {
  return useSearch({ strict: false }) as QueryParams
}

export function useReplaceQueryParams() {
  const router = useRouter()

  const replaceQueryParams = useCallback(
    (search: Partial<QueryParams>) => {
      const opts: AppNavigateOptions = {
        replace: true,
        resetScroll: false,
        search: (prev: QueryParams) => ({ ...prev, ...search }),
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
