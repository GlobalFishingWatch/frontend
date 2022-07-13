import Head from 'next/head'
import { Fragment, useState } from 'react'
import { GFWAPIV2 } from '@globalfishingwatch/api-client'
import { getLoginUrl, redirectToLogin, useGFWLogin } from '@globalfishingwatch/react-hooks'
import { Button } from '@globalfishingwatch/ui-components'
import Header from '../header/header'
import { APPLICATION_NAME } from '../../data/config'
import styles from './layout.module.css'

export function Layout({ children }) {
  const [loading, setLoading] = useState(false)
  const login = useGFWLogin(GFWAPIV2)

  const onLogoutClick = () => {
    setLoading(true)
    GFWAPIV2.logout().then(() => {
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
          children
        )}
      </div>
    </Fragment>
  )
}
