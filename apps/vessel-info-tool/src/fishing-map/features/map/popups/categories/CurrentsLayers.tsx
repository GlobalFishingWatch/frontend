import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import type { FourwingsHeatmapPickingObject } from '@globalfishingwatch/deck-layers'
import { Icon } from '@globalfishingwatch/ui-components'

import I18nNumber from 'features/i18n/i18nNumber'

import popupStyles from '../Popup.module.css'

type CurrentsTooltipRowProps = {
  feature: FourwingsHeatmapPickingObject
  loading?: boolean
  error?: string
  showFeaturesDetails: boolean
}

function metersPerSecondToKnots(speedInMps: number): number {
  return speedInMps * 1.94384 // Convert m/s to knots
}

function CurrentsTooltipRow({ feature, showFeaturesDetails }: CurrentsTooltipRowProps) {
  const { t } = useTranslation()
  const angle = feature.sublayers.find((s) => s.id.includes('currents-vo'))?.value
  const speed = feature.sublayers.find((s) => s.id.includes('currents-uo'))?.value

  if (!angle || !speed) {
    return null
  }
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
          {showFeaturesDetails && feature.title && (
            <h3 className={popupStyles.popupSectionTitle}>{feature.title}</h3>
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

export default CurrentsTooltipRow
