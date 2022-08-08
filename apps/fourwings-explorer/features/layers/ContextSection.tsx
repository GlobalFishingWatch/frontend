import { SortableContext } from '@dnd-kit/sortable'
import { Button } from '@globalfishingwatch/ui-components'
import { useContexLayers } from 'features/layers/layers.hooks'
import ContextLayer from 'features/layers/ContextLayer'
import { useSetModal } from 'features/modals/modals.hooks'
import styles from './Sections.module.css'

function Section() {
  const setNewFourwingsDatasetModal = useSetModal('newContextDataset')
  const contextLayers = useContexLayers()

  return (
    <SortableContext items={contextLayers}>
      <div className={styles.content}>
        <h2>Polygon layers</h2>
        {contextLayers && contextLayers?.length > 0 && (
          <ul>
            {contextLayers.map((layer) => {
              return <ContextLayer key={layer.id} layer={layer} />
            })}
          </ul>
        )}
        <p>Add new layer</p>
        <Button onClick={() => setNewFourwingsDatasetModal(true)}>Local File</Button>
      </div>
    </SortableContext>
  )
}

export default Section
