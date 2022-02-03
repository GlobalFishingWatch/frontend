import React, { Fragment } from 'react'
import { UserData } from '@globalfishingwatch/api-types'
import { Header as UIHeader } from '@globalfishingwatch/ui-components'
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
        <UIHeader />
        <div className={styles.titleCover}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    </Fragment>
  )
}

export default Header
