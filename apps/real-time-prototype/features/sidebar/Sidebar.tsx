import ContextLayersSection from 'features/sidebar/ContextLayersSection'
import VesselsSection from 'features/sidebar/VesselsSection'
import SidebarHeader from './SidebarHeader'
import styles from './Sidebar.module.css'

function Sidebar({ lastUpdate }) {
  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader />
        {lastUpdate && (
          <div className={styles.row}>
            <label>Last update</label>
            {new Date(lastUpdate).toLocaleString()}
          </div>
        )}
        <VesselsSection />
        <ContextLayersSection />
      </div>
    </div>
  )
}

export default Sidebar
