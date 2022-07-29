import { useTranslation } from 'react-i18next'
import I18nNumber from 'features/i18n/i18nNumber'
import { TooltipEventFeature } from 'features/map/map.hooks'
import styles from './Popup.module.css'

type ComparisonRowProps = {
  feature: TooltipEventFeature
  showFeaturesDetails: boolean
}
function ComparisonRow({ feature, showFeaturesDetails = false }: ComparisonRowProps) {
  const { t } = useTranslation()

  return (
    <div className={styles.popupSection}>
      <div className={styles.popupSectionContent}>
        {showFeaturesDetails && (
          <h3 className={styles.popupSectionTitle}>
            {t('analysis.activityChange', 'Activity change')}
          </h3>
        )}
        <div className={styles.row}>
          <span className={styles.rowText}>
            {parseInt(feature.value) > 0 && '+'}
            <I18nNumber number={feature.value} />{' '}
            {/* sad little hack because i18n key is not plural while unit is */}
            {t([`common.${feature.unit?.replace(/s$/, '')}` as any, 'common.hour'], 'hours', {
              count: parseInt(feature.value), // neded to select the plural automatically
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ComparisonRow
