import React from 'react'
import { useTranslation } from 'react-i18next'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'

type ComparisonRowProps = {
  feature: TooltipEventFeature
}
function ComparisonRow({ feature }: ComparisonRowProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.popupSection}>
      <div className={styles.popupSectionContent}>
        <div className={styles.row}>
          <span className={styles.rowText}>
            {parseInt(feature.value) > 0 && '+'}
            <I18nNumber number={feature.value} />{' '}
            {t([`common.${feature.unit}` as any, 'common.hour'], 'hours', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ComparisonRow
