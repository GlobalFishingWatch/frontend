import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import I18nNumber from 'features/i18n/i18nNumber'
import { useTimeCompareTimeDescription } from 'features/reports/reports-timecomparison.hooks'
import styles from './Popup.module.css'

type ComparisonRowProps = {
  // TODO:deck type this with its own type
  feature: any
  showFeaturesDetails: boolean
}
function ComparisonRow({ feature, showFeaturesDetails = false }: ComparisonRowProps) {
  const { t } = useTranslation()
  const timeCompareTimeDescription = useTimeCompareTimeDescription()

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
            {feature.sublayers[0].value > 0 ? '+' : ''}
            <I18nNumber number={feature.sublayers[0].value} />{' '}
            {/* sad little hack because i18n key is not plural while unit is */}
            {t([`common.${feature.unit?.replace(/s$/, '')}` as any, 'common.hour'], 'hours', {
              count: feature.sublayers[0].value, // neded to select the plural automatically
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ComparisonRow
