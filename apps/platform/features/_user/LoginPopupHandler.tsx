import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { getAccessTokenFromUrl } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'

import { broadcastLogin } from 'features/_user/auth-channel'
import { getIsLoginPopup } from 'features/_user/user.hooks'
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
          navigate({ to: ROUTE_PATHS.MAP, search: {}, replace: true })
        }
      })
  }, [navigate])

  return <Spinner />
}

export default LoginPopupHandler
