import React from 'react'
import { ReactComponent as IconLogo } from 'assets/logo.svg'
import styles from './Header.module.css'

// let deferredPrompt
const Header = () => {
  return (
    <header className={styles.header}>
      {/* <Link to={`/`} className={styles.logoIconContainer}>
        <IconLogo className={styles.logoIcon} />
        <span className={styles.logoIconText}>Port Inspector App</span>
      </Link> */}
      <IconLogo className={styles.logoIcon} />

      {/* {showInstall && (
        <button className={styles.actionBtn} onClick={onInstallClick}>
          Install app
        </button>
      )} */}
    </header>
  )
}
export default Header
