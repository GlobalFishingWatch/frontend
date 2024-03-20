import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import InsightWrapper from './InsightWrapper'
import { INSIGHTS } from './insights.config'
import styles from './Insights.module.css'

const Insights = () => {
  const { t } = useTranslation()
  const { start } = useSelector(selectTimeRange)
  console.log('start:', DateTime.fromISO(start).year < 2017)

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
      <h2 className="print-only">{t('vessel.sectionInsights', 'Insights')}</h2>
      {INSIGHTS.map((insight) => (
        <InsightWrapper insight={insight} key={insight} />
      ))}
    </div>
  )
}

export default Insights
