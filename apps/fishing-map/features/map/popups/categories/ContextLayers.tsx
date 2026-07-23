import { Fragment, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { selectContextAreasDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { getContextValue } from 'features/map/popups/map-popups.utils'

import { useContextInteractions } from './ContextLayers.hooks'
import ContextLayersRow from './ContextLayersRow'

import styles from '../Popup.module.css'

type ContextTooltipRowProps = {
  features: (ContextPickingObject | UserLayerPickingObject)[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({ features, showFeaturesDetails = false }: ContextTooltipRowProps) {
  const { onReportClick, onDownloadClick } = useContextInteractions()
  const featuresByType = groupBy(features, (f) => f.layerId)
  const isSingleArea = features.length === 1
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
        const { dataviewId, datasetId } = featureByType[0]
        const dataview = dataviews.find((d) => d.id === featureByType[0].dataviewId)
        return (
          <div key={`${dataviewId}-${index}`} className={styles.popupSection}>
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
                  {dataview ? getDatasetTitleByDataview(dataview) : datasetId}
                </h3>
              )}
              {featureByType.map((feature, index) => {
                const label =
                  getContextValue(feature) ||
                  getDatasetTitleByDataview(dataview as UrlDataviewInstance) ||
                  feature.layerId
                if (!label) return null
                const linkHref = (feature as ContextPickingObject).link
                return (
                  <ContextLayersRow
                    id={feature.id as string}
                    key={`${feature.id}-${index}`}
                    label={label}
                    linkHref={linkHref}
                    feature={feature}
                    showFeaturesDetails={showFeaturesDetails}
                    showSparkline={isSingleArea}
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
