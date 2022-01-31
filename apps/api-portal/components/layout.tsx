import { Fragment } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/layout.module.css'
import HeaderComponent from './header/header'

const Layout: NextPage = ({ children }) => {
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
      <HeaderComponent title="Access Tokens" />
      <div className={styles.container}>
        <main className={styles.main}>{children}</main>
      </div>
    </Fragment>
  )
}

export default Layout
