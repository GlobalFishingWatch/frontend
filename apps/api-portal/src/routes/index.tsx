import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import AccessTokenCreate from 'components/access-token/access-token-create/access-token-create'
import AccessTokenList from 'components/access-token/access-token-list/access-token-list'
import RequireAdditionalInfo from 'components/require-additional-info/require-additional-info'

import styles from '../styles/index.module.css'

const Layout = lazy(() => import('components/layout'))

function Home() {
  return (
    <Suspense fallback={null}>
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
    </Suspense>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})
