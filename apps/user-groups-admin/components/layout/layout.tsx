import Head from 'next/head'
import { Login } from '@globalfishingwatch/react-hooks'
import UserGroupsList from 'components/user-groups/list'
import HeaderComponent from '../header/header'
import { APPLICATION_NAME } from '../../data/config'
import styles from './layout.module.css'

export function Layout({ children }) {
  return (
    <Login>
      <HeaderComponent />
      <div className={styles.container}>
        <Head>
          <title>{APPLICATION_NAME}</title>
          <meta name="description" content="User groups admin tool" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {children}
      </div>
    </Login>
  )
}
