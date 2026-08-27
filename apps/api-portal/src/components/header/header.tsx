import { Fragment } from 'react'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'
import { Header as UIHeader } from '@globalfishingwatch/ui-components'

import styles from './header.module.css'

interface HeaderProps {
  title: string
  user?: UserData | null
  logout?: () => void
}

const openSettings = () => {
  window.open(GFWAPI.getSettingsUrl(window.location.href), '_blank')
}

export function Header({ title = '', user, logout }: HeaderProps) {
  return (
    <Fragment>
      <div className={styles.Header}>
        {user && <UIHeader user={user} onSettingsClick={openSettings} onLogoutClick={logout} />}
        <div className={styles.titleCover}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    </Fragment>
  )
}

export default Header
