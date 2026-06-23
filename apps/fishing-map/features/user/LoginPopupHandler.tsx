import { useEffect, useRef } from 'react'

import { getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components'

import { broadcastLogin } from 'features/user/auth-channel'
import { loginServerFn } from 'server-functions/auth.functions'

// Skip mounting the entire <App /> and just manage the login
function LoginPopupHandler() {
  const handled = useRef(false)

  useEffect(() => {
    const accessToken = getAccessTokenFromUrl()
    if (!accessToken || handled.current) return
    handled.current = true
    loginServerFn({ data: { accessToken } })
      .then(broadcastLogin)
      .catch((e) => console.warn('Popup login failed', e))
      .finally(() => window.close())
  }, [])

  return <Spinner />
}

export default LoginPopupHandler
