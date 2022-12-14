import React, { Fragment, useEffect } from 'react'
// import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { getProviders, signIn, useSession } from 'next-auth/react'
import { Spinner } from '@globalfishingwatch/ui-components'
import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import useUser from 'features/user/user'
import styles from '../styles/layout.module.css'
import { APPLICATION_NAME, GOOGLE_TAG_MANAGER_KEY, PATH_BASENAME } from './data/config'
import Header from './header/header'

const Layout = ({ children }) => {
  const { data: user, isLoading: loading, authorized, logout, isError, error } = useUser()

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

  const logged = !!user?.id
  const guestUser = user && user.type === GUEST_USER_TYPE
  console.log({ loading, user, logged, guestUser, isError, error })
  useEffect(() => {
    async function signedInGuard() {
      if (!loading && ((!user && !logged) || guestUser || isError)) {
        const providers = await getProviders()
        const providerId =
          !!providers && Object.entries(providers).length === 1 && Object.keys(providers).pop()

        console.log(`to sign in with`, providerId)
        if (providerId) {
          signIn(providerId)
        } else {
          signIn()
        }
      }
    }
    signedInGuard()
  }, [guestUser, loading, logged, user])
  return (
    <Fragment>
      <Head>
        <title>Access Tokens - Global Fishing Watch API Documentation</title>
        <meta
          name="description"
          content="You need an acccess token to call Global Fishing Watch API endpoints like Vessel search
          or 4wings activity tiles. Read more about API access tokens in our documentation"
        />
        <link rel="icon" href={`${PATH_BASENAME}/favicon.ico`} />
      </Head>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_KEY}');
        `}
      </Script>
      <main className={styles.main}>
        <Header title="Access Tokens" user={user} logout={logout.mutate} />
        <div className={styles.container}>
          {(loading || !user) && <Spinner></Spinner>}
          {!loading && user && !authorized && (
            <p>
              You don't have enough permissions to perform this action, please{' '}
              <a href={mailto}>contact us</a>.
            </p>
          )}
          {!loading && user && authorized && <Fragment>{children}</Fragment>}
        </div>
      </main>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_KEY}" height="0" width="0" style="display: none; visibility: hidden;" />`,
        }}
      />
    </Fragment>
  )
}

export default Layout
