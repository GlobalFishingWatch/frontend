import React from 'react'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { Logo } from '@globalfishingwatch/ui-components/logo'

// import { getLocationSearch } from '../../routes/routes.selectors'
import { BASE_URL } from '../../data/constants'

import styles from './Login.module.css'
// import { useSelector } from 'react-redux'

const Login: React.FC = (): React.ReactElement<any> => {
  const location = window.location.origin + BASE_URL
  // const search = useSelector(getLocationSearch)
  const url = GFWAPI.getLoginUrl(location)
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <Logo className={styles.logoImage} />
        <h1 className={styles.textTitle}>Tracks Labeler</h1>
        <h2 className={styles.textSubtitle}>
          Only registered users can use this tool. Please log in with your Global Fishing Watch
          credentials. If you don’t an account, create it here and contact your project lead to
          include you in this project.
        </h2>
        <a className={styles.link} href={url}>
          LOG IN
        </a>
      </div>
      <p className={styles.copyright}>© Jiri Rezac / Greenpeace</p>
    </div>
  )
}

export default Login
