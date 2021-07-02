import React, { Fragment } from 'react'
import { groupBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature, useClickedEventConnect } from 'features/map/map.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from './Popup.module.css'

type PresenceTooltipRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function PresenceTooltipRow({ feature, showFeaturesDetails }: PresenceTooltipRowProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.popupSection}>
      <span className={styles.popupSectionColor} style={{ backgroundColor: feature.color }} />
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && <h3 className={styles.popupSectionTitle}>{feature.title}</h3>}
        <div className={styles.row}>
          <span className={styles.rowText}>
            <I18nNumber number={feature.value} />{' '}
            {t([`common.${feature.unit}` as any, 'common.detection'], 'detections', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PresenceTooltipRow
