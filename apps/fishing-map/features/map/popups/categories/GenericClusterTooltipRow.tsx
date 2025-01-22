import { Icon } from '@globalfishingwatch/ui-components'

import type { ExtendedFeatureSingleEvent, SliceExtendedClusterPickingObject } from '../../map.slice'

import styles from '../Popup.module.css'

type EncountersLayerProps = {
  feature: SliceExtendedClusterPickingObject<ExtendedFeatureSingleEvent>
  showFeaturesDetails: boolean
  error?: string
}

function GenericClusterTooltipRow({ feature, showFeaturesDetails, error }: EncountersLayerProps) {
  return (
    <div className={styles.popupSection}>
      <Icon icon="clusters" style={{ color: feature.color }} />
      <div className={styles.popupSectionContent}>
        {<h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
        {error && <p className={styles.error}>{error}</p>}
        {showFeaturesDetails && feature.properties && (
          <div className={styles.row}>
            <ul className={styles.list}>
              {Object.entries(feature.properties).map(([key, value]) => {
                if (key === 'count' || key === 'expansionZoom') {
                  return null
                }
                return (
                  <li key={key}>
                    <span className={styles.strong}>{key}</span>: {JSON.stringify(value)}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default GenericClusterTooltipRow
