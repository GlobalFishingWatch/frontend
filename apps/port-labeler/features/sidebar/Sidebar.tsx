import Table from 'features/table-anchorage/TableAnchorage'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

type SidebarProps = {
  onMenuClick: () => void
}

function Sidebar({ onMenuClick }: SidebarProps) {
  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader />
        <Table></Table>
      </div>
    </div>
  )
}

export default Sidebar
