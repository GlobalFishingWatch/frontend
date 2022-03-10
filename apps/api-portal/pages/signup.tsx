import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import { useGetUserApplications } from 'features/user-applications/user-applications.hooks'
import UserAdditionalFields from 'components/user-additional-fields/user-additional-fields'
import styles from '../styles/index.module.css'

const Layout = dynamic(() => import('components/layout'), {
  ssr: false,
})

const Signup: NextPage = () => {
  const { isUserApplicationsRequiredInfoCompleted } = useGetUserApplications()

  if (
    isUserApplicationsRequiredInfoCompleted &&
    !Object.keys(Router?.query || {}).includes('edit')
  ) {
    Router.push('/')
  }
  return (
    <Layout>
      <p className={styles.description}>
        To use the Global Fishing Watch REST API you need to provide some additional info.
      </p>
      <UserAdditionalFields></UserAdditionalFields>
    </Layout>
  )
}

export default Signup
