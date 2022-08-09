import Sticky from 'react-sticky-el'
import styles from './SidebarHeader.module.css'

function SidebarHeader() {
  return (
    <Sticky scrollElement=".scrollContainer">
      <div className={styles.sidebarHeader}>
        <h1 className={styles.title}>Geo-temporal data explorer</h1>
      </div>
    </Sticky>
  )
}

export default SidebarHeader
