import { Fragment, useCallback } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks/use-login'
import { Button } from '@globalfishingwatch/ui-components/button'
import { Spinner } from '@globalfishingwatch/ui-components/spinner'

import styles from './__root.module.css'

const labelerPermission = {
  type: 'entity',
  value: 'labelling-project',
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

  return (
    <Fragment>
      <div className={styles.userInfo}>
        <p>{login.user?.email}</p>
        <Button type="secondary" size="small" onClick={handleLogoutClick}>
          Logout
        </Button>
      </div>
      <Outlet />
    </Fragment>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
