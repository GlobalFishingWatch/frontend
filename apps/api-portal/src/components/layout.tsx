import { Fragment, useEffect } from 'react'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components'

import useUser from 'features/user/user'

import { APPLICATION_NAME } from './data/config'
import Header from './header/header'

import styles from '../styles/layout.module.css'

const Layout = ({ children }: any) => {
  const { data: user, isLoading, authorized, logout, loginLink } = useUser()

  const errorInfo = [
    `Not enough permissions to access ` + APPLICATION_NAME,
    user ? 'User:' + user.email : '',
  ]
  const mailto = [
    'mailto:support@globalfishingwatch.org?',
    Object.entries({
      subject: 'Not authorized',
      body: errorInfo.join('\n'),
    })
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&'),
  ].join('')

  const redirectToLogin = true
  const logged = !!user?.id
  const guestUser = user && user.type === GUEST_USER_TYPE
  useEffect(() => {
    if (redirectToLogin && !isLoading && ((!user && !logged) || guestUser) && loginLink) {
      window.location.href = loginLink
    }
  }, [guestUser, isLoading, logged, loginLink, redirectToLogin, user])

  return (
    <Fragment>
      <main className={styles.main}>
        <Header title="Access Tokens" user={user} logout={logout.mutate} />
        <div className={styles.container}>
          {(isLoading || !user) && <Spinner></Spinner>}
          {!isLoading && user && !authorized && (
            <p>
              You don't have enough permissions to perform this action, please{' '}
              <a href={mailto}>contact us</a>.
            </p>
          )}
          {!isLoading && user && authorized && <Fragment>{children}</Fragment>}
        </div>
      </main>
    </Fragment>
  )
}

export default Layout
