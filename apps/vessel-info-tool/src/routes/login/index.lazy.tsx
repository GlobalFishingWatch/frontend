import { createLazyFileRoute, Navigate,Outlet  } from '@tanstack/react-router'

import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks'

export const Route = createLazyFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)

  if (login.logged) {
    return <Navigate to="/" replace />
  }

  if (!login.logged) return <Outlet />

  return null
}
