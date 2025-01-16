import React, { Fragment, useEffect } from 'react'
import { useAnalytics } from 'app/analytics.hooks'
// import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import { Spinner } from '@globalfishingwatch/ui-components'

import useUser from 'features/user/user'

import { APPLICATION_NAME, GOOGLE_TAG_MANAGER_ID, PATH_BASENAME } from './data/config'
import Header from './header/header'

import styles from '../styles/layout.module.css'

const Layout = ({ children }) => {
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
    if (redirectToLogin && !isLoading && ((!user && !logged) || guestUser) && loginLink) {
      router.push(loginLink)
    }
  }, [guestUser, isLoading, logged, loginLink, redirectToLogin, router, user])
  useAnalytics(user, logged, isLoading)
  return (
    <Fragment>
      <Head>
        <title>Access Tokens - Global Fishing Watch API Documentation</title>
        <meta
          name="description"
          content="You need an acccess token to call Global Fishing Watch API endpoints like Vessel search
          or 4wings activity tiles. Read more about API access tokens in our documentation"
        />
        <meta name="robots" content="noindex" />
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
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}" height="0" width="0" style="display: none; visibility: hidden;" />`,
        }}
      />
    </Fragment>
  )
}

export default Layout
