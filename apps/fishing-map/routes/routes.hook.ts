import { useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo } from 'react'
import { parse } from 'qs'
import { ACCESS_TOKEN_STRING, removeUrlParameterByName } from '@globalfishingwatch/api-client'
import { parseWorkspace } from '@globalfishingwatch/dataviews-client'
import { DEFAULT_CALLBACK_URL_PARAM, useLoginRedirect } from '@globalfishingwatch/react-hooks'
import type { QueryParams } from 'types'
import { selectLocationPayload, selectLocationType } from 'routes/routes.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectSuggestWorkspaceSave } from 'features/workspace/workspace.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import type { ROUTE_TYPES } from './routes'
import { updateLocation } from './routes.actions'

export const useBeforeUnload = () => {
  const dispatch = useAppDispatch()
  const suggestWorkspaceSave = useSelector(selectSuggestWorkspaceSave)
  const isGuestUser = useSelector(selectIsGuestUser)
  useEffect(() => {
    let fn
    if (suggestWorkspaceSave && !isGuestUser) {
      fn = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        const confirmationMessage = '\\o/'
        dispatch(setModalOpen({ id: 'createWorkspace', open: true }))
        e.returnValue = confirmationMessage // Gecko, Trident, Chrome 34+
        return confirmationMessage // Gecko, WebKit, Chrome <34
      }
      window.addEventListener('beforeunload', fn)
    } else {
      if (fn) {
        window.removeEventListener('beforeunload', fn)
      }
    }
  }, [suggestWorkspaceSave])
}

export const useReplaceLoginUrl = () => {
  const { redirectUrl, cleanRedirectUrl } = useLoginRedirect()
  const dispatch = useAppDispatch()
  const locationPayload = useSelector(selectLocationPayload)
  const locationType = useSelector(selectLocationType)

  useEffect(() => {
    const currentQuery = parse(window.location.search, { ignoreQueryPrefix: true })
    const hasCallbackUrlStorageQuery = currentQuery[DEFAULT_CALLBACK_URL_PARAM]
    const accessToken = currentQuery[ACCESS_TOKEN_STRING]
    if (redirectUrl && hasCallbackUrlStorageQuery) {
      removeUrlParameterByName('callbackUrlStorage')
      const query = {
        ...parseWorkspace(new URL(redirectUrl).search),
        [ACCESS_TOKEN_STRING]: accessToken,
        [DEFAULT_CALLBACK_URL_PARAM]: undefined,
      } as QueryParams

      dispatch(
        updateLocation(locationType, {
          query,
          payload: locationPayload,
          replaceQuery: true,
        })
      )
      cleanRedirectUrl()
    }
    return () => {
      // ensures the localStorage is clean when the app is unmounted
      cleanRedirectUrl()
    }
  }, [])
}

export const useLocationConnect = () => {
  const dispatch = useAppDispatch()
  const locationType = useSelector(selectLocationType)
  const payload = useSelector(selectLocationPayload)

  const dispatchLocation = useCallback(
    (
      type: ROUTE_TYPES,
      params = {} as { query?: QueryParams; payload?: Record<string, any> },
      { replaceQuery = false, replaceUrl = false } = {}
    ) => {
      const { query = {}, payload: customPayload = {} } = params
      dispatch(
        updateLocation(type, {
          query,
          payload: { ...payload, ...customPayload },
          replaceQuery,
          replaceUrl,
        })
      )
    },
    [dispatch, payload]
  )

  const dispatchQueryParams = useCallback(
    (query: QueryParams, replaceQuery = false) => {
      dispatch(updateLocation(locationType, { query, payload, replaceQuery }))
    },
    [dispatch, locationType, payload]
  )

  return useMemo(
    () => ({ location: locationType, payload, dispatchLocation, dispatchQueryParams }),
    [dispatchLocation, dispatchQueryParams, locationType, payload]
  )
}
