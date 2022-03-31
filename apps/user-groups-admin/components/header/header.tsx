import React, { useState } from 'react'
import { Button, Logo } from '@globalfishingwatch/ui-components'
import { redirectToLogin, useGFWLogin, useGFWLoginRedirect } from '@globalfishingwatch/react-hooks'
import { GFWAPI } from '@globalfishingwatch/api-client'
import styles from './header.module.css'

export function HeaderComponent() {
  const [loading, setLoading] = useState(false)
  const login = useGFWLogin()
  useGFWLoginRedirect(login)

  const onLogoutClick = () => {
    setLoading(true)
    GFWAPI.logout().then(() => {
      setLoading(false)
      redirectToLogin()
    })
  }
  return (
    <div className={styles.Header}>
      <Logo />
      {login && login.user && (
        <div>
          {login.user.email}
          <Button loading={loading} disabled={loading} onClick={onLogoutClick}>
            Logout
          </Button>
        </div>
      )}
    </div>
  )
}

export default HeaderComponent
