import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader />
        <h2>Hi!</h2>
      </div>
    </div>
  )
}

export default Sidebar
