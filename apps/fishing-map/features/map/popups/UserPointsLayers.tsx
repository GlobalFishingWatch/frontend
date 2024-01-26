import { Fragment } from 'react'
import { groupBy } from 'lodash'
import { useSelector } from 'react-redux'
import { Icon } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetConfigurationUI } from '@globalfishingwatch/api-types'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { selectDatasetById } from 'features/datasets/datasets.slice'
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
  const datasetId: string = features[0]?.datasetId || ''
  const dataset: Dataset = useSelector(selectDatasetById(datasetId))
  const labelProperty: DatasetConfigurationUI['labelProperty'] = getDatasetConfigurationProperty({
    dataset,
    property: 'labelProperty',
  })
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
              const label = feature.properties[labelProperty] ?? feature.value ?? feature.title
              const id = `${feature.value}-${gfw_id}`
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
