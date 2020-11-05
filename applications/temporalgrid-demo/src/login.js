import React from 'react'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import GFWAPI from '@globalfishingwatch/api-client'
import App from './App'

export default function Login() {
  const { logged, loading } = useGFWLogin()
  if (logged === false && loading === false) {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }
  if (!logged) return null
  return <App />
}
