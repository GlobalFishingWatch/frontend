import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { getContextLayerId, getUserContextLayerLabel } from 'features/map/popups/map-popups.utils'

import { useContextInteractions } from './ContextLayers.hooks'
import ContextLayersRow from './ContextLayersRow'

import styles from '../Popup.module.css'

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
