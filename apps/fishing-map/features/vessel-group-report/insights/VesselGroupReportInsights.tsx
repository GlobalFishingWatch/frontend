import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { Icon } from '@globalfishingwatch/ui-components'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectReportVesselGroupId } from 'routes/routes.selectors'
import { INSIGHTS_FISHING, MIN_INSIGHTS_YEAR } from 'features/vessel/insights/insights.config'
import styles from './VesselGroupReportInsights.module.css'
import VesselGroupReportInsightWrapper from './VesselGroupReportInsightsWrapper'

const VesselGroupReportInsights = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const vesselGroupId = useSelector(selectReportVesselGroupId)

  if (DateTime.fromISO(start).year < MIN_INSIGHTS_YEAR) {
    return (
      <div className={styles.disclaimer}>
        <Icon icon="warning" type="warning" />
        {t('vessel.insights.disclaimerTimeRangeBeforeMinYear', {
          defaultValue:
            'Insights available from 1 January {{year}} onwards. Adjust your time range to view insights.',
          year: MIN_INSIGHTS_YEAR,
        })}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className="print-only">{t('vessel.sectionInsights', 'Insights')}</h2>
      <p className={styles.title}>
        {t('vessel.insights.sectionTitle', {
          defaultValue: 'Vessel insights between {{start}} and {{end}}',
          start: formatI18nDate(start),
          end: formatI18nDate(end),
        })}
        <DataTerminology
          size="tiny"
          type="default"
          title={t('vessel.sectionInsights', 'Insights')}
          terminologyKey="insights"
        />
      </p>
      {INSIGHTS_FISHING.map((insight) => (
        <VesselGroupReportInsightWrapper
          insight={insight}
          key={insight}
          vesselGroupId={vesselGroupId}
        />
      ))}
    </div>
  )
}

export default VesselGroupReportInsights
