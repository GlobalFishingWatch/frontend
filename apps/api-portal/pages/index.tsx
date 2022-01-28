import { Fragment } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import HeaderComponent from '../components/header/header'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <Fragment>
      <HeaderComponent title="Access Tokens" />
      <div className={styles.container}>
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
          <p className={styles.description}>
            You need an acccess token to call Global Fishing Watch API endpoints like Vessel search
            or 4wings activity tiles. Read more about API access tokens in{' '}
            <a href="#api-documentation">our documentation</a>
          </p>
        </main>
      </div>
    </Fragment>
  )
}

export default Home
