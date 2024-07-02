import { Fragment } from 'react'
import { groupBy } from 'lodash'
import { Icon } from '@globalfishingwatch/ui-components'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { OFFSHORE_FIXED_INFRASTRUCTURE_DATAVIEW_ID } from 'data/layer-library/layers-context'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { t } from 'features/i18n/i18n'
import styles from './Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useContextInteractions } from './ContextLayers.hooks'

export function getContextLayerId(feature: TooltipEventFeature) {
  const { gfw_id } = feature.properties
  let id = `${feature.value}-${gfw_id}}`
  if (feature.layerId.includes(OFFSHORE_FIXED_INFRASTRUCTURE_DATAVIEW_ID)) {
    id = `${feature.properties.id}-${gfw_id}`
  }
  return id
}

export function getContextLayerLabel(feature: TooltipEventFeature) {
  let label = (feature.value ?? feature.title) as string
  if (feature.layerId.includes(OFFSHORE_FIXED_INFRASTRUCTURE_DATAVIEW_ID)) {
    const startDate = Number(feature.properties.structure_start_date)
    const endDate = Number(feature.properties.structure_end_date)
    const i18nParams = { format: { month: 'long', year: 'numeric' } }
    const rangeLabel =
      startDate && endDate
        ? t('common.timerangeDescription', {
            start: formatI18nDate(startDate, i18nParams),
            end: formatI18nDate(endDate, i18nParams),
          })
        : `${t('common.since', 'since')} ${formatI18nDate(startDate, i18nParams)}`
    label = `${feature.properties.label} - ${feature.properties.label_confidence} ${t(
      'common.confidence',
      'confidence'
    )} (${rangeLabel})`
  }
  return label
}

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
              const id = getContextLayerId(feature)
              const label = getContextLayerLabel(feature)
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
