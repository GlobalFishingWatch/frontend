// import { useEffect } from 'react'
import { GFWAPI } from '@globalfishingwatch/api-client'

function Login() {
  const loginLink = GFWAPI.getLoginUrl(
    typeof window === 'undefined' ? '' : window.location.toString()
  )

  return <a href={loginLink}>login</a>
}

export default Login
