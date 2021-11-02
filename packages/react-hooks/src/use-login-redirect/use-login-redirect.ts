import { useCallback } from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import useLocalStorage from '../use-local-storage'

export const DEFAULT_CALLBACK_URL_KEY = 'CallbackUrl'
export const DEFAULT_CALLBACK_URL_PARAM = 'callbackUrlStorage'

export const setRedirectUrl = (callbackUrlKey: string = DEFAULT_CALLBACK_URL_KEY) => {
  window.localStorage.setItem(callbackUrlKey, window.location.toString())
}

export const getLoginUrl = (callbackUrlParam: string = DEFAULT_CALLBACK_URL_PARAM) => {
  const { origin, pathname } = window.location
  return GFWAPI.getLoginUrl(`${origin}${pathname}?${callbackUrlParam}=true`)
}

export const redirectToLogin = (
  callbackUrlKey: string = DEFAULT_CALLBACK_URL_KEY,
  callbackUrlParam: string = DEFAULT_CALLBACK_URL_PARAM
) => {
  setRedirectUrl(callbackUrlKey)
  window.location.href = getLoginUrl(callbackUrlParam)
}

export const useLoginRedirect = (
  callbackUrlKey: string = DEFAULT_CALLBACK_URL_KEY,
  callbackUrlParam: string = DEFAULT_CALLBACK_URL_PARAM
) => {
  const [redirectUrl, setRedirectUrl] = useLocalStorage(callbackUrlKey, '')

  const saveRedirectUrl = useCallback(() => {
    setRedirectUrl(callbackUrlKey, window.location.toString())
  }, [callbackUrlKey, setRedirectUrl])

  const onLoginClick = useCallback(() => {
    saveRedirectUrl()
    window.location.href = getLoginUrl(callbackUrlParam)
  }, [callbackUrlParam, saveRedirectUrl])

  const cleanRedirectUrl = useCallback(() => {
    localStorage.removeItem(callbackUrlKey)
  }, [callbackUrlKey])

  return { redirectUrl, onLoginClick, saveRedirectUrl, cleanRedirectUrl }
}

export default useLoginRedirect
