/* global window */
import { useGFWLogin } from '@globalfishingwatch/react-hooks'
import { GFWAPI } from '@globalfishingwatch/api-client'

export function Login({ children }: any) {
  const { logged, loading } = useGFWLogin()
  if (logged === false && loading === false && typeof window !== 'undefined') {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }
  if (!logged) return null
  return children
}
