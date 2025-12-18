import { useCallback } from 'react'

import { GFWAPI } from '@globalfishingwatch/api-client'

import { useLocalStorage } from '../use-local-storage'

export const DEFAULT_CALLBACK_URL_KEY = 'CallbackUrl'
export const DEFAULT_CALLBACK_URL_PARAM = 'callbackUrlStorage'
export const DEFAULT_HISTORY_NAVIGATION_KEY = 'HistoryNavigation'

export const setRedirectUrl = (callbackUrlKey: string = DEFAULT_CALLBACK_URL_KEY) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(callbackUrlKey, window.location.toString())
  }
}

export const setHistoryNavigation = (
  historyNavigation: any[],
  historyNavigationKey: string = DEFAULT_HISTORY_NAVIGATION_KEY
) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(historyNavigationKey, JSON.stringify(historyNavigation))
  }
}

export const getHistoryNavigation = (
  historyNavigationKey: string = DEFAULT_HISTORY_NAVIGATION_KEY
) => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(historyNavigationKey)
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export const getLoginUrl = (callbackUrlParam: string = DEFAULT_CALLBACK_URL_PARAM) => {
  if (typeof window !== 'undefined') {
    const { origin, pathname } = window.location
    return GFWAPI.getLoginUrl(
      `${origin}${pathname}${callbackUrlParam ? `?${callbackUrlParam}=true` : ''}`
    )
  }
  return ''
}

export const redirectToLogin = (
  callbackUrlKey: string = DEFAULT_CALLBACK_URL_KEY,
  callbackUrlParam: string = DEFAULT_CALLBACK_URL_PARAM,
  historyNavigation?: any[],
  historyNavigationKey: string = DEFAULT_HISTORY_NAVIGATION_KEY
) => {
  setRedirectUrl(callbackUrlKey)
  if (historyNavigation) {
    setHistoryNavigation(historyNavigation, historyNavigationKey)
  }
  window.location.href = getLoginUrl(callbackUrlParam)
}

export const useLoginRedirect = (
  callbackUrlKey: string = DEFAULT_CALLBACK_URL_KEY,
  callbackUrlParam: string = DEFAULT_CALLBACK_URL_PARAM,
  historyNavigationKey: string = DEFAULT_HISTORY_NAVIGATION_KEY
) => {
  const [localStorageRedirectUrl, setLocalStorageRedirectUrl] = useLocalStorage(callbackUrlKey, '')
  const [localStorageHistoryNavigation, setLocalStorageHistoryNavigation] = useLocalStorage<any[]>(
    historyNavigationKey,
    []
  )

  const saveRedirectUrl = useCallback(() => {
    try {
      setLocalStorageRedirectUrl(window.location.toString())
    } catch (error) {
      console.error(error)
    }
  }, [setLocalStorageRedirectUrl])

  const saveHistoryNavigation = useCallback(
    (historyNavigation: any[]) => {
      try {
        setLocalStorageHistoryNavigation(historyNavigation)
      } catch (error) {
        console.error(error)
      }
    },
    [setLocalStorageHistoryNavigation]
  )

  const onLoginClick = useCallback(() => {
    saveRedirectUrl()
    window.location.href = getLoginUrl(callbackUrlParam)
  }, [callbackUrlParam, saveRedirectUrl])

  const cleanRedirectUrl = useCallback(() => {
    localStorage.removeItem(callbackUrlKey)
    localStorage.removeItem(historyNavigationKey)
  }, [callbackUrlKey, historyNavigationKey])

  return {
    redirectUrl: localStorageRedirectUrl,
    historyNavigation: localStorageHistoryNavigation || [],
    onLoginClick,
    saveRedirectUrl,
    saveHistoryNavigation,
    cleanRedirectUrl,
  }
}
