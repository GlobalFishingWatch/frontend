/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useMemo } from 'react'
import { getProviders, signOut, useSession } from 'next-auth/react'
import { UserData } from '@globalfishingwatch/api-types'
import { Header as UIHeader, HeaderMenuItem, IconButton } from '@globalfishingwatch/ui-components'
import { MenuItem } from '@globalfishingwatch/ui-components/header/Header.links'
import styles from './header.module.css'

interface HeaderProps {
  title: string
  user?: UserData
  logout?: () => void
}
export function Header({ title = '', user, logout }: HeaderProps) {
  const userInitials = [
    (user?.firstName && user?.firstName?.slice(0, 1)) || '',
    (user?.lastName && user?.lastName?.slice(0, 1)) || '',
  ].join('')
  const userMenuItem: MenuItem = user && {
    className: styles.userMenuItem,
    label: (
      <Fragment>
        <IconButton type="solid" className={styles.userInitials}>
          {userInitials.toLocaleUpperCase()}
        </IconButton>
      </Fragment>
    ),
    childs: [
      {
        label: (
          <Fragment>
            <p className={styles.userFullname}>{`${user.firstName} ${user.lastName || ''}`}</p>
            <p className={styles.secondary}>{user.email}</p>
          </Fragment>
        ),
      },
      {
        className: styles.logoutLink,
        onClick: logout,
        label: 'Logout',
      },
    ],
  }
  return (
    <Fragment>
      <div className={styles.Header}>
        <UIHeader>{user && <HeaderMenuItem index={100} item={userMenuItem} />}</UIHeader>
        <div className={styles.titleCover}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    </Fragment>
  )
}

export default Header
