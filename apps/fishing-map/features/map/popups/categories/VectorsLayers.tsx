import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import type { FourwingsHeatmapPickingObject } from '@globalfishingwatch/deck-layers'
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

function metersPerSecondToKnots(speedInMps: number): number {
  return speedInMps * 1.94384 // Convert m/s to knots
}

function VectorsTooltipRow({ feature, showFeaturesDetails }: VectorsTooltipRowProps) {
  const { t } = useTranslation()
  const [speed, angle] = feature.aggregatedValues || []

  if (!angle || !speed) {
    return null
  }
  const title = getDatasetLabel({
    id: feature.sublayers?.[0]?.datasets?.[0],
  })
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
              <I18nNumber number={metersPerSecondToKnots(speed)} /> {t('common.knots')}
            </span>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default VectorsTooltipRow
