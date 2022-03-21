import type { NextPage } from 'next'
// import Layout from 'components/layout'
import dynamic from 'next/dynamic'
import { Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'
import AccessTokenList from 'components/access-token/access-token-list/access-token-list'
import AccessTokenCreate from 'components/access-token/access-token-create/access-token-create'
import { useUser } from 'features/user/user'
import styles from '../styles/index.module.css'

const Layout = dynamic(() => import('components/layout'), {
  ssr: false,
})

const Home: NextPage = (context) => {
  const { isUserApplicationsRequiredInfoCompleted, isFetched, isSuccess } = useUser()
  const router = useRouter()
  console.log({ isUserApplicationsRequiredInfoCompleted, isFetched, isSuccess })
  useEffect(() => {
    if (
      isUserApplicationsRequiredInfoCompleted !== undefined &&
      !isUserApplicationsRequiredInfoCompleted
    ) {
      router.push('/signup')
    }
  }, [isUserApplicationsRequiredInfoCompleted, router])
  return (
    <Layout>
      <p className={styles.description}>
        You need an acccess token to call Global Fishing Watch API endpoints like Vessel search or
        4wings activity tiles. Read more about API access tokens in{' '}
        <a href="https://slatedocs.github.io/slate/#introduction">our documentation</a>
      </p>
      {isUserApplicationsRequiredInfoCompleted && (
        <Fragment>
          <AccessTokenList></AccessTokenList>
          <AccessTokenCreate></AccessTokenCreate>
        </Fragment>
      )}
      {!isUserApplicationsRequiredInfoCompleted && <div>provide more details</div>}
    </Layout>
  )
}

export default Home
