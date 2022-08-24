import { FpsView } from 'react-fps'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader />
        <FpsView />
      </div>
    </div>
  )
}

export default Sidebar
