import React, { Fragment, useState } from 'react'
import Head from 'next/head'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { useGFWLogin } from '@globalfishingwatch/react-hooks/use-login'
import { getLoginUrl, redirectToLogin } from '@globalfishingwatch/react-hooks/use-login-redirect'
import { Button } from '@globalfishingwatch/ui-components/button'

import { APPLICATION_NAME } from '../../data/config'
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
        <Head>
          <title>{APPLICATION_NAME}</title>
          <meta name="description" content="User groups admin tool" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

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
