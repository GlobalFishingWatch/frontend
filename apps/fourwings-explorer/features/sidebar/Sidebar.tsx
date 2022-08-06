import { Button } from '@globalfishingwatch/ui-components'
import { useDatasetsLibraryModal } from 'features/datasets/DatasetsLibraryModal'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  const [_, setDatasetsLibraryModal] = useDatasetsLibraryModal()

  return (
    <div className={styles.container}>
      <div className="scrollContainer">
        <SidebarHeader />
        <h2>Geo temporal layers</h2>
        <Button onClick={() => setDatasetsLibraryModal(true)}>Public datasets</Button>
      </div>
    </div>
  )
}

export default Sidebar
