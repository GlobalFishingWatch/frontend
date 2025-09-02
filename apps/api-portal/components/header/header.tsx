import React, { Fragment } from 'react'

import type { UserData } from '@globalfishingwatch/api-types'
import type { MenuItem } from '@globalfishingwatch/ui-components'
import { Header as UIHeader, HeaderMenuItem, IconButton } from '@globalfishingwatch/ui-components'

import styles from './header.module.css'

interface HeaderProps {
  title: string
  user?: UserData | null
  logout?: () => void
}
export function Header({ title = '', user, logout }: HeaderProps) {
  const userInitials = [
    (user?.firstName && user?.firstName?.slice(0, 1)) || '',
    (user?.lastName && user?.lastName?.slice(0, 1)) || '',
  ].join('')
  const userMenuItem =
    user &&
    ({
      className: styles.userMenuItem,
      label: (
        <IconButton type="solid" className={styles.userInitials}>
          {userInitials.toLocaleUpperCase()}
        </IconButton>
      ),
      items: [
        {
          label: `${user.firstName} ${user.lastName || ''}`,
          items: [
            {
              label: user.email,
            },
            {
              label: 'Logout',
              className: styles.logoutLink,
              onClick: logout,
            },
          ],
        },
      ],
    } as MenuItem)
  return (
    <Fragment>
      <div className={styles.Header}>
        {userMenuItem && (
          <UIHeader>{user && <HeaderMenuItem index={100} item={userMenuItem} />}</UIHeader>
        )}
        <div className={styles.titleCover}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    </Fragment>
  )
}

export default Header
