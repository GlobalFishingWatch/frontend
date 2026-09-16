import { Fragment, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'

import { getDatasetTitleByDataview } from 'features/_map/datasets/datasets.utils'
import { selectContextAreasDataviews } from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'

import { getContextValue } from '../map-popups.utils'
import PopupSectionLayout from '../shared/PopupSectionLayout'

import { useAreaRowExpansion } from './area-tooltip-timeseries.hooks'
import { useContextInteractions } from './ContextLayers.hooks'
import ContextTooltipRow from './ContextTooltipRow'

type ContextTooltipSectionProps = {
  features: (ContextPickingObject | UserLayerPickingObject)[]
  showFeaturesDetails: boolean
}

function ContextTooltipSection({
  features,
  showFeaturesDetails = false,
}: ContextTooltipSectionProps) {
  const { onReportClick, onDownloadClick } = useContextInteractions()
  const featuresByType = groupBy(features, (f) => f.layerId)
  const dataviews = useSelector(selectContextAreasDataviews) as UrlDataviewInstance[]
  const { canExpand, expandedId, toggleExpanded } = useAreaRowExpansion(
    features.map((f) => String(f.id)),
    showFeaturesDetails
  )

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
          <PopupSectionLayout
            key={`${dataviewId}-${index}`}
            icon="polygons"
            iconColor={featureByType[0].color}
            // TODO translate this
            title={
              showFeaturesDetails
                ? dataview
                  ? getDatasetTitleByDataview(dataview)
                  : datasetId
                : undefined
            }
            dataTest={`context-tooltip-section-${featureByType[0].datasetId}`}
          >
            {featureByType.map((feature, index) => {
              const label =
                getContextValue(feature) ||
                getDatasetTitleByDataview(dataview as UrlDataviewInstance) ||
                feature.layerId
              if (!label) return null
              const linkHref = (feature as ContextPickingObject).link
              const rowId = String(feature.id)
              return (
                <ContextTooltipRow
                  id={feature.id as string}
                  key={`${feature.id}-${index}`}
                  label={label}
                  linkHref={linkHref}
                  feature={feature}
                  showFeaturesDetails={showFeaturesDetails}
                  canExpand={canExpand}
                  expanded={expandedId === rowId}
                  onToggleExpand={() => toggleExpanded(rowId)}
                  handleDownloadClick={(e) => trackOnDownloadClick(e, feature)}
                  handleReportClick={onReportClick}
                />
              )
            })}
          </PopupSectionLayout>
        )
      })}
    </Fragment>
  )
}

export default ContextTooltipSection
