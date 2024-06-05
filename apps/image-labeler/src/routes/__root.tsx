import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Fragment, useCallback } from 'react'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks/use-login'
import { Button } from '@globalfishingwatch/ui-components/button'

const RootComponent = () => {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)

  const handleLogoutClick = useCallback(() => {
    GFWAPI.logout().then(() => window.location.reload())
  }, [])

  if (!login.logged) {
    return <Spinner />
  }

  const isAdmin = login.user?.groups.some((group) => group.toLowerCase() === 'admin-group')
  if (login.logged && !isAdmin) {
    return (
      <div>
        You need to be an admin to access
        <Button onClick={handleLogoutClick}>Logout</Button>
      </div>
    )
  }

  return (
    <Fragment>
      <Outlet />
      <TanStackRouterDevtools />
    </Fragment>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
