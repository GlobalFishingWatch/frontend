import { useGFWLogin, useGFWLoginRedirect } from '../use-login/use-login'

export function Login({ children }: any) {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)
  if (!login.logged) return null
  return children
}
