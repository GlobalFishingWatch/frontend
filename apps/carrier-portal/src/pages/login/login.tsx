import React from 'react'
import { useSelector } from 'react-redux'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { ReactComponent as IconLogo } from 'assets/images/gfw-white.svg'
import { getLocationSearch } from 'redux-modules/router/route.selectors'
import { BASE_URL } from 'data/constants'
import styles from './login.module.css'

const Login: React.FC = (): React.ReactElement => {
  const location = window.location.origin + BASE_URL
  const search = useSelector(getLocationSearch)
  const url = `${GFWAPI.getLoginUrl(location)}${search ? `?state=${window.btoa(search)}` : ''}`
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <IconLogo className={styles.logoImage} />
        <h1 className={styles.textTitle}>Carrier Vessel Portal</h1>
        <h2 className={styles.textSubtitle}>
          Only registered users can use this tool. Please log in with your Global Fishing Watch
          credentials.
        </h2>
        <a className={styles.link} href={url}>
          LOG IN
        </a>
      </div>
      <p className={styles.copyright}>© Juan Vilata</p>
    </div>
  )
}

export default Login
