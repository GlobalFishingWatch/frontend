import type { GFWLoginHook } from '@globalfishingwatch/react-hooks/use-login'
import { Button } from '@globalfishingwatch/ui-components/button'
import { Logo } from '@globalfishingwatch/ui-components/logo'

import styles from './header.module.css'

type HeaderProps = {
  login: GFWLoginHook
  loading: boolean
  onLogoutClick: () => void
}

export function Header({ login, loading, onLogoutClick }: HeaderProps) {
  return (
    <div className={styles.Header}>
      <Logo />
      {login && login.user && (
        <div>
          {login.user.email}
          <Button
            className={styles.logout}
            loading={loading}
            disabled={loading}
            onClick={onLogoutClick}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  )
}

export default Header
