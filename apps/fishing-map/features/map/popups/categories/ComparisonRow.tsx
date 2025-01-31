import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { FourwingsHeatmapPickingObject } from '@globalfishingwatch/deck-layers'

import I18nNumber from 'features/i18n/i18nNumber'
import { useTimeCompareTimeDescription } from 'features/reports/tabs/activity/reports-activity-timecomparison.hooks'

import styles from '../Popup.module.css'

type ComparisonRowProps = {
  feature: FourwingsHeatmapPickingObject
  showFeaturesDetails: boolean
}
function ComparisonRow({ feature, showFeaturesDetails = false }: ComparisonRowProps) {
  const { t } = useTranslation()
  const timeCompareTimeDescription = useTimeCompareTimeDescription()
  const value = feature.sublayers?.[0]?.value as number
  const unit = feature.sublayers?.[0]?.unit as string

  return (
    <div className={cx(styles.popupSection, styles.noIcon)}>
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && (
          <h3 className={styles.popupSectionTitle}>
            {t('analysis.activityChange', 'Activity change')}
          </h3>
        )}
        <div className={styles.row}>
          <span className={styles.rowText}>
            <span className={styles.secondary}>{timeCompareTimeDescription}</span>
            <br />
            {value > 0 ? '+' : ''}
            <I18nNumber number={value} />{' '}
            {/* sad little hack because i18n key is not plural while unit is */}
            {t([`common.${unit?.replace(/s$/, '')}` as any, 'common.hour'], 'hours', {
              count: value, // neded to select the plural automatically
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ComparisonRow
