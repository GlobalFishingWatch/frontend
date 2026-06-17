import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { NavigateOptions } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'

import { SHOW_LEAVE_CONFIRMATION } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { selectSuggestWorkspaceSave } from 'features/workspace/workspace.selectors'
import { selectIsRouteWithWorkspace } from 'router/routes.selectors'
import type { QueryParams } from 'types'

// TanStack Router's navigate() without a `to` param resolves search to `never`
// because it can't infer the current route's search type at compile time.
// These helpers operate across all routes, so we define a route-agnostic options type.
type AppNavigateOptions = NavigateOptions & {
  search?: QueryParams | ((prev: QueryParams) => QueryParams)
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
