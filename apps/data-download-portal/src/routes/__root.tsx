import { Fragment } from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { Footer } from '@globalfishingwatch/ui-components'

import HeaderHtml from '../components/header/header'
import Loader from '../components/loader/loader'
import { useGFWLogin } from '../components/login/use-login'
import Login from '../pages/login/login'

import styles from '../app.module.css'

function RootComponent() {
  const { loading, logged } = useGFWLogin(GFWAPI)

  // if (!logged && !loading) {
  //   return <Login />
  // }

  return (
    <Fragment>
      <HeaderHtml />
      <div className={styles.container}>
        {loading ? (
          <Loader />
        ) : (
          <div className={styles.column}>
            <Outlet />
          </div>
        )}
      </div>
      <Footer />
    </Fragment>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
