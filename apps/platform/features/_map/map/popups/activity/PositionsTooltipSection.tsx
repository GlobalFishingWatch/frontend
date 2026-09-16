import { useState } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { FourwingsPositionsPickingObject } from '@globalfishingwatch/deck-layers'
import { getPositionBearing } from '@globalfishingwatch/deck-layers'
import type { IconType } from '@globalfishingwatch/ui-components'

import { getDatasetTitleByDataview } from 'features/_map/datasets/datasets.utils'
import { selectAllDataviewInstancesResolved } from 'features/_map/dataviews/selectors/dataviews.resolvers.selectors'

import type { SliceExtendedFourwingsPickingObject } from '../../map.slice'
import PopupSectionLayout from '../shared/PopupSectionLayout'

import PositionsTooltipRow from './PositionsTooltipRow'

import styles from '../Popup.module.css'

type PositionsTooltipSectionProps = {
  features: SliceExtendedFourwingsPickingObject[]
  showFeaturesDetails: boolean
  loading: boolean
  error: string
}

function PositionsTooltipSection({
  features,
  showFeaturesDetails = false,
  loading,
  error,
}: PositionsTooltipSectionProps) {
  const [expandedId, setExpandedId] = useState<string | undefined>(features[0]?.id)
  const dataviewInstances = useSelector(selectAllDataviewInstancesResolved)

  if (features.length === 0) {
    return null
  }

  // the vessel arrow points along the position's course, like the icon drawn on the map
  const getIconProps = (feature: SliceExtendedFourwingsPickingObject) => {
    const bearing = getPositionBearing(feature as any as FourwingsPositionsPickingObject)
    return {
      icon: (bearing !== undefined ? 'vessel' : 'circle') as IconType,
      iconColor: feature.sublayers?.[0]?.color,
      iconStyle: { transform: `rotate(${bearing !== undefined ? bearing - 45 : 0}deg)` },
    }
  }

  if (showFeaturesDetails) {
    const getTitle = (feature: SliceExtendedFourwingsPickingObject) => {
      const dataview = dataviewInstances?.find((instance) => instance.id === feature.layerId)
      return dataview
        ? getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
        : feature.title
    }
    const featuresByLayer = groupBy(features, (feature) => feature.layerId)
    return Object.entries(featuresByLayer).map(([layerId, layerFeatures]) => (
      <PopupSectionLayout
        key={layerId}
        title={getTitle(layerFeatures[0])}
        {...(layerFeatures.length === 1
          ? getIconProps(layerFeatures[0])
          : { icon: 'vessel' as IconType, iconColor: layerFeatures[0].sublayers?.[0]?.color })}
      >
        {layerFeatures.map((feature, i) => {
          const expandable = feature.category === 'detections' && layerFeatures.length > 1
          const isExpanded = expandedId === feature.id
          return (
            <div key={`${feature.id}-${i}`} className={styles.popupSectionRow}>
              <PositionsTooltipRow
                loading={loading}
                error={(expandable ? isExpanded : i === 0) ? error : ''}
                feature={feature as any as FourwingsPositionsPickingObject}
                showFeaturesDetails={true}
                {...(expandable && {
                  expanded: isExpanded,
                  onToggleExpand: () =>
                    setExpandedId((prev) => (prev === feature.id ? undefined : feature.id)),
                })}
              />
            </div>
          )
        })}
      </PopupSectionLayout>
    ))
  }

  return features.map((feature, i) => {
    return (
      <PopupSectionLayout key={`${feature.id}-${i}`} {...getIconProps(feature)}>
        <PositionsTooltipRow
          loading={loading}
          error={error}
          feature={feature as any as FourwingsPositionsPickingObject}
          showFeaturesDetails={false}
        />
      </PopupSectionLayout>
    )
  })
}

export default PositionsTooltipSection
