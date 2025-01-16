import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { Dataset } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ContextPickingObject,UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID } from 'features/map/map.config'

import { useContextInteractions } from './ContextLayers.hooks'
import ContextLayersRow from './ContextLayersRow'

import styles from '../Popup.module.css'

export function getContextLayerId(feature: ContextPickingObject | UserLayerPickingObject) {
  const { gfw_id } = feature.properties
  let id = `${feature.value}-${gfw_id}}`
  if (feature.layerId.includes(OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID)) {
    id = `${feature.properties.id}-${gfw_id}`
  }
  return id
}

export function getUserContextLayerLabel(
  feature: ContextPickingObject | UserLayerPickingObject,
  dataset?: Dataset
) {
  if (
    (feature.subcategory === 'draw-polygons' || feature.subcategory === 'draw-points') &&
    dataset
  ) {
    return getDatasetLabel(dataset)
  }
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

function UserContextTooltipSection({
  features,
  showFeaturesDetails = false,
}: UserContextLayersProps) {
  const dataviews = useSelector(selectDataviewInstancesResolved) as UrlDataviewInstance[]
  const { onReportClick, onDownloadClick } = useContextInteractions()
  const featuresByType = groupBy(features, (f) => f.layerId)
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const { color, datasetId, title } = featureByType[0]
        const dataview = dataviews.find((d) => d.id === title)
        const dataset = dataview?.datasets?.find((d) => d.id === datasetId)
        const rowTitle = dataset ? getDatasetLabel(dataset) : title
        return (
          <div key={`${featureByType[0].title}-${index}`} className={styles.popupSection}>
            <Icon icon="polygons" className={styles.layerIcon} style={{ color }} />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{rowTitle}</h3>}
              {featureByType.map((feature, index) => {
                const id = getContextLayerId(feature)
                const label = getUserContextLayerLabel(feature, dataset)
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

export default UserContextTooltipSection
