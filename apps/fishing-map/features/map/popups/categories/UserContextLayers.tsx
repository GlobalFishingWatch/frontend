import { Fragment } from 'react'
import { groupBy } from 'lodash'
import { useSelector } from 'react-redux'
import { Icon } from '@globalfishingwatch/ui-components'
import { UserLayerPickingObject, ContextPickingObject } from '@globalfishingwatch/deck-layers'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectCustomUserDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID } from 'features/map/map.config'
import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import styles from '../Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useContextInteractions } from './ContextLayers.hooks'

export function getContextLayerId(feature: ContextPickingObject | UserLayerPickingObject) {
  const { gfw_id } = feature.properties
  let id = `${feature.value}-${gfw_id}}`
  if (feature.layerId.includes(OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID)) {
    id = `${feature.properties.id}-${gfw_id}`
  }
  return id
}

export function getContextLayerLabel(feature: ContextPickingObject | UserLayerPickingObject) {
  let label = (feature.value ?? feature.title) as string
  if (feature.layerId.includes(OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID)) {
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

type UserContextLayersProps = {
  features: UserLayerPickingObject[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: UserContextLayersProps) {
  const dataviews = useSelector(selectCustomUserDataviews) as UrlDataviewInstance[]
  const { onReportClick, onDownloadClick } = useContextInteractions()
  const featuresByType = groupBy(features, 'layerId')
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const dataview = dataviews.find((d) => d.id === featureByType[0].title)
        return (
          <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
            <Icon
              icon="polygons"
              className={styles.layerIcon}
              style={{ color: featureByType[0].color }}
            />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && (
                <h3 className={styles.popupSectionTitle}>
                  {dataview ? getDatasetTitleByDataview(dataview) : featureByType[0].title}
                </h3>
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
                    handleDownloadClick={(e) => onDownloadClick(e, feature)}
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

export default ContextTooltipSection
