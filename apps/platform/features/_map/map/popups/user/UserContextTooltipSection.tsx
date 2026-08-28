import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/_map/datasets/datasets.utils'
import { selectDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'

import { useContextInteractions } from '../context/ContextLayers.hooks'
import ContextTooltipRow from '../context/ContextTooltipRow'
import { getContextLayerId, getUserContextLayerLabel } from '../map-popups.utils'

import styles from '../Popup.module.css'

type UserContextTooltipSectionProps = {
  features: UserLayerPickingObject[]
  showFeaturesDetails: boolean
}

function UserContextTooltipSection({
  features,
  showFeaturesDetails = false,
}: UserContextTooltipSectionProps) {
  const dataviews = useSelector(selectDataviewInstancesResolved) as UrlDataviewInstance[]
  const { onReportClick, onDownloadClick } = useContextInteractions()
  const featuresByType = groupBy(features, (f) => f.layerId)
  const isSingleArea = features.length === 1
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const { color, layerId, dataviewId, datasetId } = featureByType[0]
        const dataview = dataviews.find((d) => d.id === dataviewId)
        const dataset = dataview?.datasets?.find((d) => d.id === datasetId)
        const rowTitle = dataset ? getDatasetLabel(dataset) : layerId
        return (
          <div key={`${dataviewId}-${index}`} className={styles.popupSection}>
            <Icon icon="polygons" className={styles.layerIcon} style={{ color }} />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{rowTitle}</h3>}
              {featureByType.map((feature, index) => {
                const id = getContextLayerId(feature)
                const label = getUserContextLayerLabel(feature, dataset)
                return (
                  <ContextTooltipRow
                    id={id}
                    key={`${id}-${index}`}
                    label={label}
                    feature={feature}
                    showFeaturesDetails={showFeaturesDetails}
                    showSparkline={isSingleArea}
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
