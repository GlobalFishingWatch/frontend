import { useCallback, useEffect } from 'react'

import { getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components'

import { broadcastLogin } from 'features/user/auth-channel'
import { loginServerFn } from 'server-functions/auth.functions'

const popupLoginHandledKey = (accessToken: string) => `gfw-popup-login:${accessToken}`

// Skip mounting the entire <App /> and just manage the login
function LoginPopupHandler() {
  const login = useCallback(async (accessToken: string) => {
    const handledKey = popupLoginHandledKey(accessToken)
    try {
      const user = await loginServerFn({ data: { accessToken } })
      broadcastLogin(user)
    } catch (e) {
      sessionStorage.removeItem(handledKey)
      console.warn('Popup login failed', e)
    } finally {
      window.close()
    }
  }, [])

  useEffect(() => {
    const accessToken = getAccessTokenFromUrl()
    if (!accessToken) return
    const handledKey = popupLoginHandledKey(accessToken)
    // Per-token key avoids StrictMode double-calls while still allowing retries on failure.
    if (sessionStorage.getItem(handledKey)) return
    sessionStorage.setItem(handledKey, '1')
    login(accessToken)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Spinner />
}

export default LoginPopupHandler
