import { Fragment, useCallback } from 'react'
import { createFileRoute, Navigate,Outlet } from '@tanstack/react-router'

import { getAccessTokenFromUrl, GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'
import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks'
import { Button, Spinner } from '@globalfishingwatch/ui-components'

const isAuthenticated = () => {
  let user: UserData | null = null
  const accessToken = getAccessTokenFromUrl()
  GFWAPI.login({ accessToken }).then((u) => {
    user = u
  })
  return user !== undefined && user !== null
}

export const Route = createFileRoute('/_auth')({
  ssr: false,
  component: () => {
    if (!isAuthenticated()) {
      return <Login />
    }
    return <Outlet />
  },
})

function Login() {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)

  const handleLogoutClick = useCallback(() => {
    GFWAPI.logout().then(() => window.location.reload())
  }, [])

  if (!login.logged) {
    return <Spinner />
  }

  const hasAccessPermissions = login.user?.permissions

  if (login.logged && !hasAccessPermissions) {
    return (
      <div>
        <p>{login.user?.email}</p>
        <p>You don't have permissions to access this page</p>
        <Button onClick={handleLogoutClick}>Logout</Button>
      </div>
    )
  }

  return <Outlet />
}
