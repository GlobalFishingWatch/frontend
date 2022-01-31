import React, { Fragment } from 'react'
import dynamic from 'next/dynamic'
import { UserData } from '@globalfishingwatch/api-types'
import { Button } from '../../../../libs/ui-components/src/button'
import styles from './header.module.css'

const HeaderNoSSR = dynamic(() => import('@globalfishingwatch/ui-components/dist/header'), {
  ssr: false,
})

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
