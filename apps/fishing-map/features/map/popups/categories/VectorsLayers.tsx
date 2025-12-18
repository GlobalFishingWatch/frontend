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
  return (
    <Fragment>
      <div className={popupStyles.popupSection}>
        <span style={{ transform: `rotate(${angle})` }}>
          <Icon
            icon="vessel"
            className={popupStyles.layerIcon}
            style={{ color: feature.color, transform: `rotate(${angle - 45}deg)` }}
          />
        </span>
        <div className={popupStyles.popupSectionContent}>
          {showFeaturesDetails && title && (
            <h3 className={popupStyles.popupSectionTitle}>{title}</h3>
          )}
          {speed && (
            <span>
              <I18nNumber number={speed} /> {t(`common.${unit}`, unit)}
            </span>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default VectorsTooltipRow
