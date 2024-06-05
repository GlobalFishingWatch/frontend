import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Fragment } from 'react'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks/use-login'

const RootComponent = () => {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)

  if (!login.logged) {
    return <Spinner />
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
