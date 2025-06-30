import { useState } from 'react'

import type { FourwingsPositionsPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import type { SliceExtendedFourwingsPickingObject } from 'features/map/map.slice'
import PositionsRow from 'features/map/popups/categories/PositionsRow'

import styles from '../Popup.module.css'

type PositionsTooltipRowProps = {
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
}: PositionsTooltipRowProps) {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)

  const handlePreviousFeature = () => {
    setCurrentFeatureIndex((prev) => (prev > 0 ? prev - 1 : features.length - 1))
  }

  const handleNextFeature = () => {
    setCurrentFeatureIndex((prev) => (prev < features.length - 1 ? prev + 1 : 0))
  }

  if (features.length === 0) {
    return null
  }

  const currentFeature = features[currentFeatureIndex]

  if (showFeaturesDetails) {
    return (
      <div className={styles.popupSection}>
        <div>
          <PositionsRow
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
        </div>
      </div>
    )
  }

  return features.map((feature, i) => {
    return (
      <div className={styles.popupSection}>
        <PositionsRow
          key={`${feature.id}-${i}`}
          loading={loading}
          error={error}
          feature={feature as any as FourwingsPositionsPickingObject}
          showFeaturesDetails={false}
        />
      </div>
    )
  })
}

export default PositionsTooltipSection
