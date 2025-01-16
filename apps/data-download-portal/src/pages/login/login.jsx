import { useEffect } from 'react'

import { GFWAPI } from '@globalfishingwatch/api-client'

function LoginPage() {
  useEffect(() => {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }, [])
  return null
}

export default LoginPage
