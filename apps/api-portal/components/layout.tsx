import { Fragment, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Spinner } from '@globalfishingwatch/ui-components'
import useUser, { GUEST_USER_TYPE } from 'features/user/user'
import styles from '../styles/layout.module.css'
import { APPLICATION_NAME, PATH_BASENAME } from './data/config'
import Header from './header/header'

const Layout: NextPage = ({ children }) => {
  // const { user, loading: isLoading, authorized, logout } = useUser(true)
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
  const router = useRouter()
  useEffect(() => {
    // if (!logged && !isLoading && (token || refreshToken || accessToken)) {
    //   dispatch(fetchUserThunk({ guest: false }))
    // } else
    if (redirectToLogin && !isLoading && ((!user && !logged) || guestUser) && loginLink) {
      router.push(loginLink)
    }
  }, [guestUser, isLoading, logged, loginLink, redirectToLogin, router, user])
  return (
    <Fragment>
      <Head>
        <title>Access Tokens</title>
        <meta
          name="description"
          content="You need an acccess token to call Global Fishing Watch API endpoints like Vessel search
          or 4wings activity tiles. Read more about API access tokens in our documentation"
        />
        <link rel="icon" href={`${PATH_BASENAME}/favicon.ico`} />
      </Head>
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
