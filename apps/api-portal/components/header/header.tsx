import React, { Fragment } from 'react'
import { UserData } from '@globalfishingwatch/api-types'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { HeaderNoSSR } from 'components/ui'
import styles from './header.module.css'

interface HeaderProps {
  title: string
  user?: UserData
  logout?: () => void
}
export function Header({ title = '', user, logout }: HeaderProps) {
  return (
    <Fragment>
      <div className={styles.Header}>
        <HeaderNoSSR />
        <div className={styles.titleCover}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
      {user && logout && (
        <div className={styles.userMenu}>
          <Button onClick={logout}>Logout</Button>
        </div>
      )}
    </Fragment>
  )
}

export default Header
