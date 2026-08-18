import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/_map/datasets/datasets.utils'
import { selectCustomUserDataviews } from 'features/_map/dataviews/selectors/dataviews.categories.selectors'

import { useContextInteractions } from '../context/ContextLayers.hooks'
import ContextTooltipRow from '../context/ContextTooltipRow'
import { getContextLayerId, getUserContextLayerLabel } from '../map-popups.utils'

import styles from '../Popup.module.css'

type UserPointsTooltipSectionProps = {
  features: (ContextPickingObject | UserLayerPickingObject)[]
  showFeaturesDetails: boolean
}

function UserPointsTooltipSection({
  features,
  showFeaturesDetails = false,
}: UserPointsTooltipSectionProps) {
  const dataviews = useSelector(selectCustomUserDataviews) as UrlDataviewInstance[]
  const { onReportClick } = useContextInteractions()
  const featuresByType = groupBy(features, (f) => f.layerId)
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const { color, dataviewId, datasetId } = featureByType[0]
        const dataview = dataviews.find((d) => d.id === dataviewId)
        const dataset = dataview?.datasets?.find((d) => d.id === datasetId)
        const rowTitle = dataset ? getDatasetLabel(dataset) : datasetId
        return (
          <div key={`${dataviewId}-${index}`} className={styles.popupSection}>
            <Icon icon="dots" className={styles.layerIcon} style={{ color }} />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{rowTitle}</h3>}
              {featureByType.map((feature, index) => {
                const id = getContextLayerId(feature)
                const label = getUserContextLayerLabel(feature, dataset)
                return (
                  <ContextTooltipRow
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
