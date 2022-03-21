import { Fragment } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import HeaderComponent from '../components/header/header'
import { APPLICATION_NAME } from '../components/data/config'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <Fragment>
      <HeaderComponent title="GFW Minisite" />
      <div className={styles.container}>
        <Head>
          <title>{APPLICATION_NAME}</title>
          <meta name="description" content="Some description for your GFW Minisite" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <p className={styles.description}>Some description for your GFW Minisite</p>
        </main>
      </div>
    </Fragment>
  )
}

export default Home
