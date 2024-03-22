import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { useMemo } from 'react'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectVisibleEvents } from 'features/app/selectors/app.selectors'
import InsightWrapper from './InsightWrapper'
import { INSIGHTS_ALL, INSIGHTS_FISHING } from './insights.config'
import styles from './Insights.module.css'

const Insights = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const currentVisibleEvents = useSelector(selectVisibleEvents)
  const isFishingVessel = currentVisibleEvents === 'all' || currentVisibleEvents.includes('fishing')
  const insightsByVesselType = useMemo(
    () => (isFishingVessel ? [...INSIGHTS_ALL, ...INSIGHTS_FISHING] : INSIGHTS_ALL),
    [isFishingVessel]
  )

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
        {t('vessel.insights.sectionTitle', {
          defaultValue: 'Vessel insights between {{start}} and {{end}}',
          start: formatI18nDate(start),
          end: formatI18nDate(end),
        })}
      </p>
      {insightsByVesselType.map((insight) => (
        <InsightWrapper insight={insight} key={insight} />
      ))}
    </div>
  )
}

export default Insights
