import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { UserLayerPickingObject } from '@globalfishingwatch/deck-layers'

import { getDatasetLabel } from 'features/_map/datasets/datasets.utils'
import { selectDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'

import { useAreaRowExpansion } from '../context/area-tooltip-timeseries.hooks'
import { useContextInteractions } from '../context/ContextLayers.hooks'
import ContextTooltipRow from '../context/ContextTooltipRow'
import { getContextLayerId, getUserContextLayerLabel } from '../map-popups.utils'
import PopupSectionLayout from '../shared/PopupSectionLayout'

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
  const { canExpand, expandedId, toggleExpanded } = useAreaRowExpansion(
    features.map(getContextLayerId),
    showFeaturesDetails
  )
  return (
    <Fragment>
      {Object.values(featuresByType).map((featureByType, index) => {
        const { color, layerId, dataviewId, datasetId } = featureByType[0]
        const dataview = dataviews.find((d) => d.id === dataviewId)
        const dataset = dataview?.datasets?.find((d) => d.id === datasetId)
        const rowTitle = dataset ? getDatasetLabel(dataset) : layerId
        return (
          <PopupSectionLayout
            key={`${dataviewId}-${index}`}
            icon="polygons"
            iconColor={color}
            title={showFeaturesDetails ? rowTitle : undefined}
          >
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
                  canExpand={canExpand}
                  expanded={expandedId === id}
                  onToggleExpand={() => toggleExpanded(id)}
                  handleDownloadClick={(e) => onDownloadClick(e, feature)}
                  handleReportClick={(e) => onReportClick(e, feature)}
                />
              )
            })}
          </PopupSectionLayout>
        )
      })}
    </Fragment>
  )
}

export default UserContextTooltipSection
