import React, { memo } from 'react'
import cx from 'classnames'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import vesselHistoryLogo from '../assets/images/splash-screen-image@2x.png'
import tmtLogo from '../assets/images/tmt_logo_final_full_colour@2x.png'
import styles from './Splash.module.css'

function Splash() {
  return (
    <div className={cx(styles.container, styles.splash)}>
      <img src={vesselHistoryLogo} className={styles.vhLogo} alt="Vessel History" />
      <div className={styles.secondary}>
        <img src={tmtLogo} className={styles.tmtLogo} alt="Trygg Mat Tracking" />
        <Logo className={styles.gfwLogo} />
      </div>
    </div>
  )
}
export default memo(Splash)
