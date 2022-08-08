import { SortableContext } from '@dnd-kit/sortable'
import { Button } from '@globalfishingwatch/ui-components'
import { useGeoTemporalLayers } from 'features/layers/layers.hooks'
import GeoTemporalLayer from 'features/layers/GeoTemporalLayer'
import { useSetModal } from 'features/modals/modals.hooks'
import styles from './Sections.module.css'

function Section() {
  const setDatasetsLibraryModal = useSetModal('datasetLibrary')
  const setNewFourwingsDatasetModal = useSetModal('newFourwingsDataset')
  const geoTemporalLayers = useGeoTemporalLayers()

  return (
    <SortableContext items={geoTemporalLayers}>
      <div className={styles.content}>
        <h2>Geo temporal layers</h2>
        {geoTemporalLayers && geoTemporalLayers?.length > 0 && (
          <ul>
            {geoTemporalLayers.map((layer) => {
              return <GeoTemporalLayer key={layer.id} layer={layer} />
            })}
          </ul>
        )}
        <p>Add new layer</p>
        <Button onClick={() => setDatasetsLibraryModal(true)}>Public datasets</Button>
        <Button onClick={() => setNewFourwingsDatasetModal(true)}>Local File</Button>
      </div>
    </SortableContext>
  )
}

export default Section
