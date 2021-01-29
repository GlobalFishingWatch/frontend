import React, {memo} from 'react'
import cx from 'classnames'
import vesselHistoryLogo from '../assets/images/splash-screen-image@2x.png'
// import { ReactComponent as GFWLogo } from '../assets/gfw_logo.svg'
import styles from './Splash.module.css'

function Splash() {
  return (
    <div className={cx(styles.centered, styles.splash)}>
      <img src={vesselHistoryLogo} alt="Vessel History" />
    </div>
  )
}
export default memo(Splash)
