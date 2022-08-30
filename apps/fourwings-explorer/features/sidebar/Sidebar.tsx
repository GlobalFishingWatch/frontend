import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove } from '@dnd-kit/sortable'
import ContextSection from 'features/layers/ContextSection'
import GeoTemporalSection from 'features/layers/GeoTemporalSection'
import { useLayersConfig } from 'features/layers/layers.hooks'
import styles from './Sidebar.module.css'
import SidebarHeader from './SidebarHeader'

function Sidebar() {
  const { layersConfig, setLayers } = useLayersConfig()
  function handleDragEnd(event) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = layersConfig.findIndex((d) => d.id === active.id)
      const newIndex = layersConfig.findIndex((d) => d.id === over.id)
      const layersOrder = arrayMove(layersConfig, oldIndex, newIndex)
      setLayers(layersOrder)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <div className={styles.container}>
        <div className="scrollContainer">
          <SidebarHeader />
          <div className={styles.content}>
            <GeoTemporalSection />
            <ContextSection />
          </div>
        </div>
      </div>
    </DndContext>
  )
}

export default Sidebar
