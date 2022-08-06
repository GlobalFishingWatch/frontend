import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'
import GeoTemporalSection from 'features/layers/GeoTemporalSection'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  function handleDragEnd(event) {
    const { active, over } = event
    // if (active && over && active.id !== over.id) {
    //   const oldIndex = dataviews.findIndex((d) => d.id === active.id)
    //   const newIndex = dataviews.findIndex((d) => d.id === over.id)
    //   const dataviewInstancesId = arrayMove(dataviews, oldIndex, newIndex).map((d) => d.id)
    //   dispatchQueryParams({ dataviewInstancesOrder: dataviewInstancesId })
    // }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <div className={styles.container}>
        <div className="scrollContainer">
          <SidebarHeader />
          <div className={styles.content}>
            <GeoTemporalSection />
          </div>
        </div>
      </div>
    </DndContext>
  )
}

export default Sidebar
