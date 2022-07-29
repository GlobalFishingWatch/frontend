import Sticky from 'react-sticky-el'
import { Logo } from '@globalfishingwatch/ui-components'
import styles from './SidebarHeader.module.css'

function SidebarHeader() {
  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} />
        </a>
      </div>
    </Sticky>
  )
}

export default SidebarHeader
