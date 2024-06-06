import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useCallback } from 'react'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'
import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks/use-login'
import { Button } from '@globalfishingwatch/ui-components/button'

const labelerPermission = {
  type: 'labeler-project',
  value: '*',
  action: 'read',
}

const RootComponent = () => {
  const login = useGFWLogin()
  useGFWLoginRedirect(login)

  const handleLogoutClick = useCallback(() => {
    GFWAPI.logout().then(() => window.location.reload())
  }, [])

  if (!login.logged) {
    return <Spinner />
  }

  const hasAccessPermissions = checkExistPermissionInList(
    login.user?.permissions,
    labelerPermission
  )
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

export const Route = createRootRoute({
  component: RootComponent,
})
