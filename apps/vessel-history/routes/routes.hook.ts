import { useCallback, useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { parse } from 'qs'
import type { QueryParams } from 'types'

import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'
import { parseWorkspace } from '@globalfishingwatch/dataviews-client'
import {
  getLoginUrl as commonGetLoginUrl,
  redirectToLogin as commonRedirectToLogin,
  setRedirectUrl as commonSetRedirectUrl,
  useLoginRedirect as commonUseLoginRedirect,
} from '@globalfishingwatch/react-hooks'

import {
  selectCurrentLocation,
  selectLocationPayload,
  selectLocationType,
} from 'routes/routes.selectors'

import type { ROUTE_TYPES } from './routes'
import { updateLocation } from './routes.actions'

export const CALLBACK_URL_KEY = 'CallbackUrl'
export const CALLBACK_URL_PARAM = 'callbackUrlStorage'

export const setRedirectUrl = () => commonSetRedirectUrl(CALLBACK_URL_KEY)

export const getLoginUrl = () => commonGetLoginUrl(CALLBACK_URL_PARAM)

export const redirectToLogin = () => commonRedirectToLogin(CALLBACK_URL_KEY, CALLBACK_URL_PARAM)

export const useLoginRedirect = () => commonUseLoginRedirect(CALLBACK_URL_KEY, CALLBACK_URL_PARAM)

export const useReplaceLoginUrl = () => {
  const { redirectUrl, cleanRedirectUrl } = useLoginRedirect()
  const dispatch = useDispatch()
  const locationPayload = useSelector(selectLocationPayload)
  const locationType = useSelector(selectLocationType)

  useEffect(() => {
    const currentQuery = parse(window.location.search, { ignoreQueryPrefix: true })
    const accessToken = currentQuery[ACCESS_TOKEN_STRING]
    if (redirectUrl && currentQuery[CALLBACK_URL_PARAM]) {
      const query = {
        ...parseWorkspace(new URL(redirectUrl).search),
        [ACCESS_TOKEN_STRING]: accessToken,
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
  const dispatch = useDispatch()
  const location = useSelector(selectCurrentLocation)
  const payload = useSelector(selectLocationPayload)

  const dispatchLocation = useCallback(
    (type: ROUTE_TYPES, customPayload: Record<string, any> = {}, replaceQuery = false) => {
      dispatch(updateLocation(type, { payload: { ...payload, ...customPayload }, replaceQuery }))
    },
    [dispatch, payload]
  )

  const dispatchQueryParams = useCallback(
    (query: QueryParams, replaceQuery = false) => {
      dispatch(updateLocation(location.type, { query, payload, replaceQuery }))
    },
    [dispatch, location.type, payload]
  )

  return { location, payload, dispatchLocation, dispatchQueryParams }
}
