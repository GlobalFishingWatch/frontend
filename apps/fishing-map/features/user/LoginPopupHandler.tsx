import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME } from 'data/config'
import { broadcastLogin } from 'features/user/auth-channel'
import { getIsLoginPopup } from 'features/user/user.hooks'
import { ROUTE_PATHS } from 'router/routes.utils'
import { loginServerFn } from 'server-functions/auth.functions'

// Skip mounting the entire <App /> and just manage the login
function LoginPopupHandler() {
  const handled = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = getAccessTokenFromUrl()
    if (!accessToken || handled.current) return
    handled.current = true
    loginServerFn({ data: { accessToken } })
      .then(broadcastLogin)
      .catch((e) => console.warn('Popup login failed', e))
      .finally(() => {
        if (getIsLoginPopup()) {
          window.close()
        }
        if (!window.closed) {
          // Full page load, not a client navigation: the session only exists as cookies
          window.location.replace(`${PATH_BASENAME.replace(/\/$/, '')}${ROUTE_PATHS.HOME}`)
        }
      })
  }, [navigate])

  return <Spinner />
}

export default LoginPopupHandler
