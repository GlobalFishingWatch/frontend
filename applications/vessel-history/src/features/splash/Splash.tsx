import React, { memo } from 'react'
import Logo from '@globalfishingwatch/ui-components/dist/logo'
import vesselHistoryLogo from '../../assets/images/splash-screen-image@2x.png'
import tmtLogo from '../../assets/images/tmt_logo_final_full_colour@2x.png'
import styles from './Splash.module.css'

function Splash() {
  return (
    <div className={styles.container}>
      <div className={styles.splash}>
        <img src={vesselHistoryLogo} className={styles.vhLogo} alt="Vessel History" />
      </div>
      <div className={styles.secondary}>
        <img src={tmtLogo} className={styles.tmtLogo} alt="Trygg Mat Tracking" />
        <Logo className={styles.gfwLogo} />
      </div>
    </div>
  )
}
export default memo(Splash)
