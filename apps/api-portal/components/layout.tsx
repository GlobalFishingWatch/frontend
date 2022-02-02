import { Fragment } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
// import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { useUser } from 'features/user/user.hooks'
import styles from '../styles/layout.module.css'
import { APPLICATION_NAME } from './data/config'
import Header from './header/header'
import { Spinner } from './ui'

const LoginNoSSR = dynamic(() => import('./login'), {
  ssr: false,
})

const Layout: NextPage = ({ children }) => {
  const { user, loading: userLoading, authorized, logout } = useUser()

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

  return (
    <Fragment>
      <Head>
        <title>Access Tokens</title>
        <meta
          name="description"
          content="You need an acccess token to call Global Fishing Watch API endpoints like Vessel search
          or 4wings activity tiles. Read more about API access tokens in our documentation"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header title="Access Tokens" user={user} logout={logout} />
        <div className={styles.container}>
          {userLoading && <Spinner></Spinner>}
          {!userLoading && !user && (
            <p>
              Access tokens can be managed only by registered users, please <LoginNoSSR /> first.
            </p>
          )}
          {!userLoading && user && !authorized && (
            <p>
              You don't have enough permissions to perform this action, please{' '}
              <a href={mailto}>contact us</a>.
            </p>
          )}
          {!userLoading && user && authorized && <Fragment>{children}</Fragment>}
        </div>
      </main>
    </Fragment>
  )
}

export default Layout
