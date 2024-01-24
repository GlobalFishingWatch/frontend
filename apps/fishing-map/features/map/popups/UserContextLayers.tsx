import { Fragment } from 'react'
import { groupBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Icon } from '@globalfishingwatch/ui-components'
import { DRAW_DATASET_SOURCE, Dataset } from '@globalfishingwatch/api-types'
import {
  DatasetConfigurationProperty,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import styles from './Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useContextInteractions } from './ContextLayers.hooks'

type UserContextLayersProps = {
  features: TooltipEventFeature[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: UserContextLayersProps) {
  const { t } = useTranslation()
  const { onReportClick, onDownloadClick } = useContextInteractions()
  const datasetId: string = features[0]?.datasetId || ''
  const dataset: Dataset = useSelector(selectDatasetById(datasetId))
  const labelProperty: DatasetConfigurationProperty['labelProperty'] =
    getDatasetConfigurationProperty({
      dataset,
      property: 'labelProperty',
    })
  const featuresByType = groupBy(features, 'layerId')
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => (
        <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
          <Icon
            icon="polygons"
            className={styles.layerIcon}
            style={{ color: featureByType[0].color }}
          />
          <div className={styles.popupSectionContent}>
            {showFeaturesDetails && (
              <h3 className={styles.popupSectionTitle}>{featureByType[0].title}</h3>
            )}
            {featureByType.map((feature, index) => {
              const { gfw_id } = feature.properties
              const defaultLabel =
                feature.properties[labelProperty] ?? feature.value ?? feature.title
              const label =
                feature.datasetSource === DRAW_DATASET_SOURCE
                  ? `${t('common.polygon', 'Polygon')} ${defaultLabel}`
                  : defaultLabel
              const id = `${feature.value}-${gfw_id}}`
              return (
                <ContextLayersRow
                  id={id}
                  key={`${id}-${index}`}
                  label={label}
                  feature={feature}
                  showFeaturesDetails={showFeaturesDetails}
                  handleDownloadClick={(e) => onDownloadClick(e, feature)}
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

export default ContextTooltipSection
