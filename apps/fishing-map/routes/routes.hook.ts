import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
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
  selectLocationType,
} from 'routes/routes.selectors'
import type { QueryParams } from 'types'

import type { ROUTE_TYPES } from './routes'
import { updateLocation } from './routes.actions'

export const useBeforeUnload = () => {
  const dispatch = useAppDispatch()
  const isRouteWithWorkspace = useSelector(selectIsRouteWithWorkspace)
  const suggestWorkspaceSave = useSelector(selectSuggestWorkspaceSave)
  const isGuestUser = useSelector(selectIsGuestUser)

  const beforeUnLoad = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault()
    setTimeout(() => {
      dispatch(setModalOpen({ id: 'createWorkspace', open: true }))
    }, 400)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  const { redirectUrl, historyNavigation, cleanRedirectUrl } = useLoginRedirect()
  const dispatch = useAppDispatch()
  const locationPayload = useSelector(selectLocationPayload)
  const locationType = useSelector(selectLocationType)

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

      updateLocation(locationType, {
        query,
        payload: locationPayload,
        replaceQuery: true,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useLocationConnect = () => {
  const locationType = useSelector(selectLocationType)
  const payload = useSelector(selectLocationPayload)

  const dispatchLocation = useCallback(
    (
      type: ROUTE_TYPES,
      params = {} as { query?: QueryParams; payload?: Record<string, string | undefined> },
      { replaceQuery = false, replaceUrl = false } = {}
    ) => {
      const { query = {}, payload: customPayload = {} } = params
      updateLocation(type, {
        query,
        payload: { ...payload, ...customPayload },
        replaceQuery,
        replaceUrl,
      })
    },
    [payload]
  )

  return useMemo(
    () => ({ location: locationType, payload, dispatchLocation }),
    [dispatchLocation, locationType, payload]
  )
}
