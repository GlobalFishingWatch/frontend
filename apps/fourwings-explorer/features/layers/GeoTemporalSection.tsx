import { SortableContext } from '@dnd-kit/sortable'
import { Button } from '@globalfishingwatch/ui-components'
import { useGeoTemporalLayers } from 'features/layers/layers.hooks'
import GeoTemporalLayer from 'features/layers/GeoTemporalLayer'
import { useSetModal } from 'features/modals/modals.hooks'
import { useAreAPIDatasetsImporting } from 'features/datasets/datasets.hooks'
import styles from './Sections.module.css'

function Section() {
  const setDatasetsLibraryModal = useSetModal('datasetLibrary')
  const setNewFourwingsDatasetModal = useSetModal('newFourwingsDataset')
  const geoTemporalLayers = useGeoTemporalLayers()
  const areDatasetImporting = useAreAPIDatasetsImporting()

  return (
    <SortableContext items={geoTemporalLayers}>
      <div className={styles.content}>
        <h2 className={styles.title}>Geo temporal layers</h2>
        {geoTemporalLayers && geoTemporalLayers?.length > 0 && (
          <ul>
            {geoTemporalLayers.map((layer) => {
              return <GeoTemporalLayer key={layer.id} layer={layer} />
            })}
          </ul>
        )}
        <div className={styles.actions}>
          <label>Add new dataset</label>
          <Button className={styles.cta} size="small" onClick={() => setDatasetsLibraryModal(true)}>
            Public dataset library
          </Button>
          <Button
            className={styles.cta}
            size="small"
            loading={areDatasetImporting}
            disabled={areDatasetImporting}
            onClick={() => setNewFourwingsDatasetModal(true)}
            type="secondary"
          >
            Local File
          </Button>
        </div>
      </div>
    </SortableContext>
  )
}

export default Section
