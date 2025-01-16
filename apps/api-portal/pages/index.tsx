import path from 'path'

import type { NextPage } from 'next'
// import Layout from 'components/layout'
import dynamic from 'next/dynamic'

import AccessTokenCreate from 'components/access-token/access-token-create/access-token-create'
import AccessTokenList from 'components/access-token/access-token-list/access-token-list'
import RequireAdditionalInfo from 'components/require-additional-info/require-additional-info'

import styles from '../styles/index.module.css'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

const Layout = dynamic(() => import('components/layout'), {
  ssr: false,
})

const Home: NextPage = (context) => {
  return (
    <Layout>
      <p className={styles.description}>
        You need an acccess token to call Global Fishing Watch API endpoints like Vessel search or
        4wings activity tiles. Read more about API access tokens in{' '}
        <a href="https://globalfishingwatch.org/our-apis/documentation">our documentation</a>
      </p>
      <RequireAdditionalInfo>
        <AccessTokenList></AccessTokenList>
        <AccessTokenCreate></AccessTokenCreate>
      </RequireAdditionalInfo>
    </Layout>
  )
}

export default Home
