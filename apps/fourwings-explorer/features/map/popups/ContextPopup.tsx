import { ExtendedFeature } from '@globalfishingwatch/react-hooks/use-map-interaction'
import { useDatasetLayers } from 'features/layers/layers.hooks'
import { ContextApiDatasetConfig } from 'features/datasets/datasets.types'
import styles from './Popup.module.css'

type ContextPopupProps = {
  feature?: ExtendedFeature
}
function ContextPopup({ feature }: ContextPopupProps) {
  const layers = useDatasetLayers()
  const featureMeta = layers.find((l) => l.id === feature.generatorId)
  const polygonId = (featureMeta?.dataset?.configuration as ContextApiDatasetConfig)?.polygonId
  return (
    <div className={styles.popupSection}>
      <div className={styles.row}>
        <span className={styles.rowText}>
          {polygonId ? feature.properties[polygonId] : feature.value}
        </span>
      </div>
    </div>
  )
}

export default ContextPopup
