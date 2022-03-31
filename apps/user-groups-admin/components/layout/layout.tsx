import Head from 'next/head'
import { Fragment } from 'react'
import HeaderComponent from '../header/header'
import { APPLICATION_NAME } from '../../data/config'
import styles from './layout.module.css'

export function Layout({ children }) {
  return (
    <Fragment>
      <HeaderComponent />
      <div className={styles.container}>
        <Head>
          <title>{APPLICATION_NAME}</title>
          <meta name="description" content="User groups admin tool" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {children}
      </div>
    </Fragment>
  )
}
