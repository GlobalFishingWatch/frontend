import { useLocation } from '@tanstack/react-router'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { logoutUser, useGFWLogin } from '@globalfishingwatch/react-hooks'
import { Header } from '@globalfishingwatch/ui-components'

import styles from './header.module.css'

export default function HeaderComponent() {
  const location = useLocation()
  const { logged, user, loading } = useGFWLogin(GFWAPI)
  const handleLoginRedirect = () => {
    if (!logged && typeof window !== 'undefined') {
      window.location.href = GFWAPI.getLoginUrl(window.location.toString())
    }
  }

  const isDatasetsPage = location.pathname.includes('/datasets/')

  return (
    <div className={styles.Header}>
      <Header
        className={styles.headerLinks}
        homeRedirectURL={isDatasetsPage ? '/' : undefined}
        user={user}
        onLoginClick={loading ? undefined : handleLoginRedirect}
        onLogoutClick={logoutUser}
      />
      <div className={styles.titleCover}>
        <h1 className={styles.title}>Datasets and Code</h1>
      </div>
    </div>
  )
}
