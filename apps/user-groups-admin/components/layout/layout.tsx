import Head from 'next/head'
import { Fragment, useState } from 'react'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { getLoginUrl, redirectToLogin, useGFWLogin } from '@globalfishingwatch/react-hooks'
import { Button } from '@globalfishingwatch/ui-components'
import Header from '../header/header'
import { APPLICATION_NAME } from '../../data/config'
import styles from './layout.module.css'

export function Layout({ children }) {
  const [loading, setLoading] = useState(false)
  const login = useGFWLogin()

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

        {login.logged === false && login.loading === false && typeof window !== 'undefined' ? (
          <div className={styles.login}>
            <Button href={getLoginUrl()}>Login</Button>
          </div>
        ) : (
          children
        )}
      </div>
    </Fragment>
  )
}
