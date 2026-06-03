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
import { fetchUserThunk } from 'features/user/user.slice'
import {
  selectIncludeRelatedIdentities,
  selectVesselDatasetId,
} from 'features/vessel/vessel.config.selectors'
import { fetchVesselInfoThunk } from 'features/vessel/vessel.slice'
import { useFetchWorkspace } from 'features/workspace/workspace.hook'
import { selectSuggestWorkspaceSave, selectWorkspace } from 'features/workspace/workspace.selectors'
import { setWorkspaceHistoryNavigation } from 'features/workspace/workspace.slice'
import {
  selectIsAnyVesselLocation,
  selectIsRouteWithWorkspace,
  selectLocationPayload,
  selectLocationTo,
  selectVesselId,
  selectWorkspaceId,
} from 'router/routes.selectors'
import type { QueryParams } from 'types'

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

const SUCCESS_LOGIN_MESSAGE = 'LOGIN_SUCCESS'
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

    if (hasCallbackUrlStorageQuery && window?.opener) {
      window.opener.postMessage(
        { type: SUCCESS_LOGIN_MESSAGE, accessToken },
        window.location.origin
      )
      window.close()
      return
    }

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

export function useLoginPopupListener() {
  const dispatch = useAppDispatch()
  const fetchWorkspace = useFetchWorkspace()
  const isAnyVesselProfileLocation = useSelector(selectIsAnyVesselLocation)
  const vesselId = useSelector(selectVesselId)
  const workspace = useSelector(selectWorkspace)
  const workspaceId = useSelector(selectWorkspaceId)
  const datasetId = useSelector(selectVesselDatasetId)
  const includeRelatedIdentities = useSelector(selectIncludeRelatedIdentities)

  const reloadDataAfterLogin = useCallback(() => {
    if (isAnyVesselProfileLocation) {
      dispatch(
        fetchVesselInfoThunk({ vesselId, datasetId, includeRelatedIdentities, isRefresh: true })
      )
    }
    fetchWorkspace({ workspaceId: workspaceId || '', isRefresh: workspace !== null })
  }, [
    datasetId,
    dispatch,
    fetchWorkspace,
    includeRelatedIdentities,
    isAnyVesselProfileLocation,
    vesselId,
    workspaceId,
    workspace,
  ])

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === SUCCESS_LOGIN_MESSAGE) {
        await dispatch(fetchUserThunk({ accessToken: event.data.accessToken }))
        reloadDataAfterLogin()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [dispatch, reloadDataAfterLogin])
}
