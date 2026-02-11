import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import type { FourwingsHeatmapPickingObject } from '@globalfishingwatch/deck-layers'
import type { FourwingsVectorsUnit } from '@globalfishingwatch/deck-loaders'
import { Icon } from '@globalfishingwatch/ui-components'

import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nNumber from 'features/i18n/i18nNumber'

import popupStyles from '../Popup.module.css'

type VectorsTooltipRowProps = {
  feature: FourwingsHeatmapPickingObject
  loading?: boolean
  error?: string
  showFeaturesDetails: boolean
}

function VectorsTooltipRow({ feature, showFeaturesDetails }: VectorsTooltipRowProps) {
  const { t } = useTranslation()
  const [speed, angle] = feature.aggregatedValues || []
  const unit = feature.sublayers?.[0]?.unit as FourwingsVectorsUnit
  if (!angle || !speed) {
    return null
  }

  const title = feature.sublayers.reduce((acc, { datasets }) => {
    const label = getDatasetLabel({ id: datasets[0] })
    if (label !== datasets[0]) {
      return label
    }
    return acc
  }, '')

  const color = feature.sublayers?.[0]?.color as string
  return (
    <Fragment>
      <div className={popupStyles.popupSection}>
        <span style={{ transform: `rotate(${angle})` }}>
          <Icon
            icon="vector-arrow"
            className={popupStyles.layerIcon}
            style={{ color, transform: `rotate(${angle}deg)` }}
          />
        </span>
        <div className={popupStyles.popupSectionContent}>
          {showFeaturesDetails && title && (
            <h3 className={popupStyles.popupSectionTitle}>{title}</h3>
          )}
          {speed && (
            <span>
              <I18nNumber number={speed} /> {t((t) => t.common[unit], { defaultValue: unit })}
            </span>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default VectorsTooltipRow
