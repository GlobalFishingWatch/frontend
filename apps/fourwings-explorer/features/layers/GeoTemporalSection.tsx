import { SortableContext } from '@dnd-kit/sortable'
import { Button } from '@globalfishingwatch/ui-components'
import { useMapGeoTemporalLayers } from 'features/layers/layers.hooks'
import GeoTemporalLayer from 'features/layers/GeoTemporalLayer'
import { useModal } from 'features/modals/modals.hooks'
import styles from './Sections.module.css'

function Section() {
  const [_, setDatasetsLibraryModal] = useModal('datasetLibrary')
  const geoTemporalLayers = useMapGeoTemporalLayers()

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
      </div>
    </SortableContext>
  )
}

export default Section
