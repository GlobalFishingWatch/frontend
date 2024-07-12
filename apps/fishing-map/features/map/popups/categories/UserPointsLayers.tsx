import { Fragment } from 'react'
import { groupBy } from 'es-toolkit'
import { Icon } from '@globalfishingwatch/ui-components'
import { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import styles from '../Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useContextInteractions } from './ContextLayers.hooks'
import { getContextLayerId, getContextLayerLabel } from './UserContextLayers'

type UserPointsLayersProps = {
  features: (ContextPickingObject | UserLayerPickingObject)[]
  showFeaturesDetails: boolean
}

function UserPointsTooltipSection({
  features,
  showFeaturesDetails = false,
}: UserPointsLayersProps) {
  const { onReportClick } = useContextInteractions()
  const featuresByType = groupBy(features, (f) => f.layerId)
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const { color, datasetId, title } = featureByType[0]
        const rowTitle = datasetId ? getDatasetLabel({ id: datasetId }) : title
        return (
          <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
            <Icon icon="dots" className={styles.layerIcon} style={{ color }} />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{rowTitle}</h3>}
              {featureByType.map((feature, index) => {
                const id = getContextLayerId(feature)
                const label = getContextLayerLabel(feature)
                return (
                  <ContextLayersRow
                    id={id}
                    key={`${id}-${index}`}
                    label={label as string}
                    feature={feature}
                    showFeaturesDetails={showFeaturesDetails}
                    handleReportClick={(e) => onReportClick(e, feature)}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}

export default UserPointsTooltipSection
