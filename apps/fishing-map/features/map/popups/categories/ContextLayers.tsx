import { Fragment, useCallback } from 'react'
import { groupBy } from 'es-toolkit'
import { useSelector } from 'react-redux'
import { Icon } from '@globalfishingwatch/ui-components'
import { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectContextAreasDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import styles from '../Popup.module.css'
import ContextLayersRow from './ContextLayersRow'
import { useContextInteractions } from './ContextLayers.hooks'

type ContextTooltipRowProps = {
  features: (ContextPickingObject | UserLayerPickingObject)[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: ContextTooltipRowProps) {
  const { onReportClick, onDownloadClick } = useContextInteractions()
  const featuresByType = groupBy(features, (f) => f.layerId)
  const dataviews = useSelector(selectContextAreasDataviews) as UrlDataviewInstance[]

  const trackOnDownloadClick = useCallback(
    (event: any, feature: ContextPickingObject | UserLayerPickingObject) => {
      trackEvent({
        category: TrackCategory.DataDownloads,
        action: `Click on polygon, click on download icon`,
      })
      onDownloadClick(event, feature)
    },
    [onDownloadClick]
  )

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
            <div
              className={styles.popupSectionContent}
              data-test={`context-tooltip-section-${featureByType[0].datasetId}`}
            >
              {showFeaturesDetails && (
                // TODO translate this
                <h3 className={styles.popupSectionTitle}>
                  {dataview ? getDatasetTitleByDataview(dataview) : featureByType[0].title}
                </h3>
              )}
              {featureByType.map((feature, index) => {
                if (!feature.value) return null
                let label = (feature.value as string) ?? feature.title
                let linkHref = (feature as ContextPickingObject).link
                return (
                  <ContextLayersRow
                    id={feature.id as string}
                    key={`${feature.id}-${index}`}
                    label={label}
                    linkHref={linkHref}
                    feature={feature}
                    showFeaturesDetails={showFeaturesDetails}
                    handleDownloadClick={(e) => trackOnDownloadClick(e, feature)}
                    handleReportClick={onReportClick}
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
