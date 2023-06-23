import ContextLayersSection from 'features/sidebar/ContextLayersSection'
import VesselsSection from 'features/sidebar/VesselsSection'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader />
        <VesselsSection />
        <ContextLayersSection />
      </div>
    </div>
  )
}

export default Sidebar
