import React, { Fragment, useState } from 'react'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { getLoginUrl, redirectToLogin, useGFWLogin } from '@globalfishingwatch/react-hooks'
import { Button } from '@globalfishingwatch/ui-components'

import Header from '../header/header'

import styles from './layout.module.css'

export function Layout({ children }: any) {
  const [loading, setLoading] = useState(false)
  const login = useGFWLogin(GFWAPI)

  const onLogoutClick = () => {
    setLoading(true)
    GFWAPI.logout().then(() => {
      setLoading(false)
      redirectToLogin()
    })
  }

  return (
    <Fragment>
      <Header login={login} loading={loading} onLogoutClick={onLogoutClick} />
      <div className={styles.container}>
        {login.logged === false ? (
          <div className={styles.login}>
            {typeof window !== 'undefined' && login.loading === false ? (
              <Button href={getLoginUrl('')}>Login</Button>
            ) : null}
          </div>
        ) : (
          React.cloneElement(children, { login })
        )}
      </div>
    </Fragment>
  )
}
