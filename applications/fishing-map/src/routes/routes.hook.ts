import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { parse } from 'qs'
import GFWAPI, { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'
import { parseWorkspace } from '@globalfishingwatch/dataviews-client'
import { QueryParams } from 'types'
import useLocalStorage from 'hooks/use-local-storage'
import {
  selectCurrentLocation,
  selectLocationPayload,
  selectLocationType,
} from 'routes/routes.selectors'
// import { initialDispatch } from 'store'
import { ROUTE_TYPES } from './routes'
import { updateLocation } from './routes.actions'

export const CALLBACK_URL_KEY = 'CallbackUrl'
export const CALLBACK_URL_PARAM = 'callbackUrlStorage'

export const setRedirectUrl = () => {
  window.localStorage.setItem(CALLBACK_URL_KEY, window.location.toString())
}

export const getLoginUrl = () => {
  const { origin, pathname } = window.location
  return GFWAPI.getLoginUrl(`${origin}${pathname}?${CALLBACK_URL_PARAM}=true`)
}

export const redirectToLogin = () => {
  setRedirectUrl()
  window.location.href = getLoginUrl()
}

export const useLoginRedirect = () => {
  const [redirectUrl, setRedirectUrl] = useLocalStorage(CALLBACK_URL_KEY, '')

  const saveRedirectUrl = useCallback(() => {
    setRedirectUrl(window.location.toString())
  }, [setRedirectUrl])

  const onLoginClick = useCallback(() => {
    saveRedirectUrl()
    window.location.href = getLoginUrl()
  }, [saveRedirectUrl])

  const cleanRedirectUrl = useCallback(() => {
    localStorage.removeItem(CALLBACK_URL_KEY)
  }, [])

  return { redirectUrl, onLoginClick, saveRedirectUrl, cleanRedirectUrl }
}

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
