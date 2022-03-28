import React from 'react'
import { Logo } from '@globalfishingwatch/ui-components'
import styles from './header.module.css'

export function HeaderComponent() {
  return (
    <div className={styles.Header}>
      <Logo />
    </div>
  )
}

export default HeaderComponent
