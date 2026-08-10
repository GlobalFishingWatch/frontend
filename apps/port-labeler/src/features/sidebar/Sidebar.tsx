import Table from 'features/table-anchorage/TableAnchorage'

import SidebarHeader from './SidebarHeader'

import styles from './Sidebar.module.css'

function Sidebar() {
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
