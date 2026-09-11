import { useState } from 'react'
import { useSelector } from 'react-redux'

import type { FourwingsPositionsPickingObject } from '@globalfishingwatch/deck-layers'
import { getPositionBearing } from '@globalfishingwatch/deck-layers'
import type { IconType } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

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
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)
  const dataviewInstances = useSelector(selectAllDataviewInstancesResolved)

  const handlePreviousFeature = () => {
    setCurrentFeatureIndex((prev) => (prev > 0 ? prev - 1 : features.length - 1))
  }

  const handleNextFeature = () => {
    setCurrentFeatureIndex((prev) => (prev < features.length - 1 ? prev + 1 : 0))
  }

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

  const currentFeature = features[currentFeatureIndex]

  if (!currentFeature) {
    return null
  }

  if (showFeaturesDetails) {
    const dataview = dataviewInstances?.find((instance) => instance.id === currentFeature.layerId)
    const title = dataview
      ? getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
      : currentFeature.title
    return (
      <PopupSectionLayout title={title} {...getIconProps(currentFeature)}>
        <PositionsTooltipRow
          key={`${currentFeature.id}-${currentFeatureIndex}`}
          loading={loading}
          error={error}
          feature={currentFeature as any as FourwingsPositionsPickingObject}
          showFeaturesDetails={true}
        />
        {features.length > 1 && (
          <div className={styles.navigationFooter}>
            <IconButton
              icon="arrow-left"
              size="small"
              onClick={handlePreviousFeature}
              aria-label="Previous feature"
            />
            <span className={styles.navigationCounter}>
              {currentFeatureIndex + 1} / {features.length}
            </span>
            <IconButton
              icon="arrow-right"
              size="small"
              onClick={handleNextFeature}
              aria-label="Next feature"
            />
          </div>
        )}
      </PopupSectionLayout>
    )
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
