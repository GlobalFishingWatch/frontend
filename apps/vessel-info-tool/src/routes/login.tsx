import { createFileRoute, Outlet } from '@tanstack/react-router'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks'
import { Spinner } from '@globalfishingwatch/ui-components'

export const Route = createFileRoute('/login')({
  component: () => <LoginWrapper />,
  //   {
  //   if (typeof window !== 'undefined') {
  //     window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  //   }
  //   return <p>Redirecting to login…</p>
  // },
})

function LoginWrapper() {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)

  if (!login.logged) {
    return <Spinner />
  }
  return <Outlet />
}
