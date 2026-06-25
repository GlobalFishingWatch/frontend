import { lazy, Suspense, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import UserAdditionalFields from 'components/user-additional-fields/user-additional-fields'
import useUser from 'features/user/user'

import styles from '../styles/index.module.css'

const Layout = lazy(() => import('components/layout'))

function Signup() {
  const { isUserApplicationsRequiredInfoCompleted } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    const isEditing = new URLSearchParams(window.location.search).has('edit')
    if (isUserApplicationsRequiredInfoCompleted && !isEditing) {
      navigate({ to: '/' })
    }
  }, [isUserApplicationsRequiredInfoCompleted, navigate])

  return (
    <Suspense fallback={null}>
      <Layout>
        <p className={styles.description}>
          To use the Global Fishing Watch REST API you need to provide some additional info.
        </p>
        <UserAdditionalFields></UserAdditionalFields>
      </Layout>
    </Suspense>
  )
}

export const Route = createFileRoute('/signup')({
  component: Signup,
})
