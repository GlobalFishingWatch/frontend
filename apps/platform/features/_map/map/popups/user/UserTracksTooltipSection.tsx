import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/_map/datasets/datasets.utils'
import { selectCustomUserDataviews } from 'features/_map/dataviews/selectors/dataviews.categories.selectors'

import ContextTooltipRow from '../context/ContextTooltipRow'
import { getUserContextLayerLabel } from '../map-popups.utils'

import styles from '../Popup.module.css'

type UserTracksTooltipSectionProps = {
  features: (ContextPickingObject | UserLayerPickingObject)[]
  showFeaturesDetails: boolean
}

function UserTracksTooltipSection({
  features,
  showFeaturesDetails = false,
}: UserTracksTooltipSectionProps) {
  const dataviews = useSelector(selectCustomUserDataviews) as UrlDataviewInstance[]
  const featuresByType = groupBy(features, (f) => f.layerId)
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const { color, datasetId, dataviewId } = featureByType[0]
        const dataview = dataviews.find((d) => d.id === dataviewId)
        const dataset = dataview?.datasets?.find((d) => d.id === datasetId)
        const rowTitle = dataset ? getDatasetLabel(dataset) : datasetId
        return (
          <div key={`${featureByType[0].dataviewId}-${index}`} className={styles.popupSection}>
            <Icon icon="track" className={styles.layerIcon} style={{ color }} />
            <div className={styles.popupSectionContent}>
              {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{rowTitle}</h3>}
              {featureByType.map((feature, index) => {
                const id = feature.id
                const label = getUserContextLayerLabel(feature, dataset)
                return (
                  <ContextTooltipRow
                    id={id}
                    key={`${id}-${index}`}
                    label={label as string}
                    feature={feature}
                    showFeaturesDetails={showFeaturesDetails}
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

export default UserTracksTooltipSection
