import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import InsightWrapper from './InsightWrapper'
import { INSIGHTS } from './insights.config'
import styles from './Insights.module.css'

const Insights = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)

  if (DateTime.fromISO(start).year < 2017) {
    return (
      <p className={styles.error}>
        {t(
          'vessel.insights.errorTimeRangeBeforeMinYear',
          'Vessel insights are not available before 2017'
        )}
      </p>
    )
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        {t('vessel.sectionInsights', 'Insights')}{' '}
        {t('common.dateRange', {
          defaultValue: 'between {{start}} and {{end}}',
          start: formatI18nDate(start),
          end: formatI18nDate(end),
        })}
      </p>
      {INSIGHTS.map((insight) => (
        <InsightWrapper insight={insight} key={insight} />
      ))}
    </div>
  )
}

export default Insights
