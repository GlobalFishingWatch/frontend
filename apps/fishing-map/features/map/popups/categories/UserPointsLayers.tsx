import { Fragment } from 'react'
import { groupBy } from 'es-toolkit'
import { useSelector } from 'react-redux'
import { Icon } from '@globalfishingwatch/ui-components'
import { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectCustomUserDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import styles from '../Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useContextInteractions } from './ContextLayers.hooks'
import { getContextLayerId, getUserContextLayerLabel } from './UserContextLayers'

type UserPointsLayersProps = {
  features: (ContextPickingObject | UserLayerPickingObject)[]
  showFeaturesDetails: boolean
}

function UserPointsTooltipSection({
  features,
  showFeaturesDetails = false,
}: UserPointsLayersProps) {
  const dataviews = useSelector(selectCustomUserDataviews) as UrlDataviewInstance[]
  const { onReportClick } = useContextInteractions()
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
            <Icon icon="dots" className={styles.layerIcon} style={{ color }} />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{rowTitle}</h3>}
              {featureByType.map((feature, index) => {
                const id = getContextLayerId(feature)
                const label = getUserContextLayerLabel(feature, dataset)
                return (
                  <ContextLayersRow
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
