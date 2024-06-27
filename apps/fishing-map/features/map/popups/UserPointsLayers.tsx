import { Fragment } from 'react'
import { groupBy } from 'lodash'
import { Icon } from '@globalfishingwatch/ui-components'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID } from '../map.config'
import styles from './Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useContextInteractions } from './ContextLayers.hooks'

type UserPointsLayersProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function UserPointsTooltipSection({
  features,
  showFeaturesDetails = false,
}: UserPointsLayersProps) {
  const { onReportClick } = useContextInteractions()
  const featuresByType = groupBy(features, 'layerId')
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => (
        <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
          <Icon
            icon="dots"
            className={styles.layerIcon}
            style={{ color: featureByType[0].color }}
          />
          <div className={styles.popupSectionContent}>
            {showFeaturesDetails && (
              <h3 className={styles.popupSectionTitle}>{featureByType[0].title}</h3>
            )}
            {featureByType.map((feature, index) => {
              const { gfw_id } = feature.properties
              let label = feature.value ?? feature.title
              let id = `${feature.value}-${gfw_id}`
              if (feature.layerId.includes(OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID)) {
                label = `${feature.properties.label} - ${
                  feature.properties.label_confidence
                } confidence (from ${new Date(
                  Number(feature.properties.structure_start_date)
                ).toLocaleDateString()} to ${new Date(
                  Number(feature.properties.structure_end_date)
                ).toLocaleDateString()})`
                id = `${feature.properties.id}-${gfw_id}`
              }
              return (
                <ContextLayersRow
                  id={id}
                  key={`${id}-${index}`}
                  label={label}
                  feature={feature}
                  showFeaturesDetails={showFeaturesDetails}
                  handleReportClick={(e) => onReportClick(e, feature)}
                />
              )
            })}
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default UserPointsTooltipSection
