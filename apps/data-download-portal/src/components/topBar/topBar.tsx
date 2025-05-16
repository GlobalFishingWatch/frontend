import type { ReactNode } from 'react'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { logoutUser, useGFWLogin } from '@globalfishingwatch/react-hooks'
import { Button, Icon } from '@globalfishingwatch/ui-components'

import Loader from '../loader/loader'

import styles from './topBar.module.css'

interface TopBarProps {
  children?: ReactNode
}

const TopBar = ({ children }: TopBarProps) => {
  const { logged, user, loading } = useGFWLogin(GFWAPI)
  const handleLoginRedirect = () => {
    if (!logged && typeof window !== 'undefined') {
      window.location.href = GFWAPI.getLoginUrl(window.location.toString())
    }
  }
  return (
    <div className={styles.topBar}>
      {children}
      <div>
        {loading ? (
          <Loader />
        ) : logged || user ? (
          <div className={styles.loggedIn}>
            <p>
              You’re logged in as {user?.email},<br />
              <span
                role="button"
                tabIndex={0}
                className={styles.logoutButton}
                onClick={() => {
                  logoutUser()
                }}
              >
                log out
              </span>
              and try a different account if you can't find a dataset.
            </p>
          </div>
        ) : (
          <div className={styles.container}>
            <p className={styles.loggedIn}>Can’t find a dataset you’re looking for?</p>
            <Button onClick={() => handleLoginRedirect()} type="secondary" size="medium">
              <Icon icon={'user'} /> LOG IN
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopBar
