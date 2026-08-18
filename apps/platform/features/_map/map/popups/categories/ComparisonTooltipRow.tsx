import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { FourwingsHeatmapPickingObject } from '@globalfishingwatch/deck-layers'

import { useTimeCompareTimeDescription } from 'features/_reports/tabs/activity/reports-activity-timecomparison.hooks'
import I18nNumber from 'features/i18n/i18nNumber'

import styles from '../Popup.module.css'

type ComparisonTooltipRowProps = {
  feature: FourwingsHeatmapPickingObject
  showFeaturesDetails: boolean
}
function ComparisonTooltipRow({ feature, showFeaturesDetails = false }: ComparisonTooltipRowProps) {
  const { t } = useTranslation()
  const timeCompareTimeDescription = useTimeCompareTimeDescription()
  const value = feature.sublayers?.[0]?.value as number
  const unit = feature.sublayers?.[0]?.unit as string

  return (
    <div className={cx(styles.popupSection, styles.noIcon)} translate="no">
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && (
          <h3 className={styles.popupSectionTitle}>{t((t) => t.analysis.activityChange)}</h3>
        )}
        <div className={styles.row}>
          <span className={styles.rowText}>
            <span className={styles.secondary}>{timeCompareTimeDescription}</span>
            <br />
            {value > 0 ? '+' : ''}
            <I18nNumber number={value} />{' '}
            {/* sad little hack because i18n key is not plural while unit is */}
            {t((t) => (t.common as any)[unit?.replace(/s$/, '') ?? 'hours'], {
              defaultValue: 'hours',
              count: value, // neded to select the plural automatically
            } as any)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ComparisonTooltipRow
