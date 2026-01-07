import { createFileRoute, Outlet } from '@tanstack/react-router'

import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks'
import { Spinner } from '@globalfishingwatch/ui-components'

export const Route = createFileRoute('/_auth')({
  ssr: false,
  component: () => <LoginWrapper />,
})

function LoginWrapper() {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)

  if (!login.logged) {
    return <Spinner />
  }
  // redirect to getFlagLabel(login.user.country)
  return <Outlet />
}
