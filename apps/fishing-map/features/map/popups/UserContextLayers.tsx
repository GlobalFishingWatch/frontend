import { Fragment } from 'react'
import { groupBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Icon } from '@globalfishingwatch/ui-components'
import { ContextPickingObject, UserContextPickingObject } from '@globalfishingwatch/deck-layers'
import styles from './Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useContextInteractions } from './ContextLayers.hooks'

type UserContextLayersProps = {
  features: (ContextPickingObject | UserContextPickingObject)[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: UserContextLayersProps) {
  const { t } = useTranslation()
  const { onReportClick, onDownloadClick } = useContextInteractions()
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
              const defaultLabel = feature.value ?? feature.title
              const label = defaultLabel as string
              // TODO:deck restore datasetSource
              // feature.datasetSource === DRAW_DATASET_SOURCE
              //   ? `${t('common.polygon', 'Polygon')} ${defaultLabel}`
              //   : defaultLabel
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
