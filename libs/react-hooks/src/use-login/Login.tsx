import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks'

export function Login({ children }: any) {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)
  if (!login.logged) return null
  return children
}
