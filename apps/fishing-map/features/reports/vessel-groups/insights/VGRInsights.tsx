import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { Icon, Spinner } from '@globalfishingwatch/ui-components'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { MIN_INSIGHTS_YEAR } from 'features/vessel/insights/insights.config'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { selectVGRVesselDatasetsWithoutEventsRelated } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import styles from './VGRInsights.module.css'
import VesselGroupReportInsightCoverage from './VGRInsightCoverage'
import VesselGroupReportInsightGap from './VGRInsightGaps'
import VesselGroupReportInsightIUU from './VGRInsightIUU'
import VesselGroupReportInsightFishing from './VGRInsightFishing'
import VesselGroupReportInsightFlagChange from './VGRInsightFlagChange'
import VesselGroupReportInsightMOU from './VGRInsightMOU'

const VesselGroupReportInsights = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const vesselDatasets = useSelector(selectVesselsDatasets)
  const datasetsWithoutRelatedEvents = useSelector(selectVGRVesselDatasetsWithoutEventsRelated)

  if (!vesselDatasets.length) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  if (datasetsWithoutRelatedEvents.size >= 1) {
    return (
      <div className={styles.disclaimer}>
        <Icon icon="warning" type="warning" />
        {t('vesselGroup.disclaimerFeaturesNotAvailable', {
          defaultValue:
            '{{features}} are only available for AIS vessels and your group contains vessels from {{datasets}}.',
          features: t('common.insights', 'Insights'),
          datasets: Array.from(datasetsWithoutRelatedEvents)
            .map((d) => getDatasetLabel(d))
            .join(', '),
        })}
      </div>
    )
  }

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
        {t('vesselGroup.insightSectionTitle', {
          defaultValue: 'Vessel group insights between {{start}} and {{end}}',
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
      <VesselGroupReportInsightCoverage />
      <VesselGroupReportInsightGap />
      <VesselGroupReportInsightFishing />
      <VesselGroupReportInsightIUU />
      <VesselGroupReportInsightFlagChange />
      <VesselGroupReportInsightMOU />
    </div>
  )
}

export default VesselGroupReportInsights
