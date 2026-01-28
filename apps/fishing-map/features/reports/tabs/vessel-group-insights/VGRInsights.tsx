import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import { Icon } from '@globalfishingwatch/ui-components'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectVGRVesselDatasetsWithoutEventsRelated } from 'features/reports/shared/vessels/report-vessels.selectors'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { MIN_INSIGHTS_YEAR } from 'features/vessel/insights/insights.config'

import VesselGroupReportInsightFishing from './VGRInsightFishing'
import VesselGroupReportInsightFlagChange from './VGRInsightFlagChange'
import VesselGroupReportInsightGap from './VGRInsightGaps'
import VesselGroupReportInsightIUU from './VGRInsightIUU'
import VesselGroupReportInsightMOU from './VGRInsightMOU'

import styles from './VGRInsights.module.css'

const VesselGroupReportInsights = () => {
  const { t } = useTranslation()
  const { start, end } = useSelector(selectTimeRange)
  const vesselDatasets = useSelector(selectVesselsDatasets)
  const datasetsWithoutRelatedEvents = useSelector(selectVGRVesselDatasetsWithoutEventsRelated)

  if (datasetsWithoutRelatedEvents.length >= 1) {
    return (
      <div className={styles.disclaimer}>
        <Icon icon="warning" type="warning" />
        {t((t) => t.vesselGroup.disclaimerFeaturesNotAvailable, {
          features: t((t) => t.common.insights),

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
        {t((t) => t.vessel.insights.disclaimerTimeRangeBeforeMinYear, {
          year: MIN_INSIGHTS_YEAR,
        })}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className="print-only">{t((t) => t.vessel.sectionInsights)}</h2>
      <p className={styles.title}>
        {t((t) => t.vesselGroup.insightSectionTitle, {
          start: formatI18nDate(start),
          end: formatI18nDate(end),
        })}
        <DataTerminology
          title={t((t) => t.vesselGroupReport.insights.title)}
          terminologyKey="insightsVesselGroups"
        />
      </p>
      <VesselGroupReportInsightGap skip={!vesselDatasets.length} />
      <VesselGroupReportInsightFishing skip={!vesselDatasets.length} />
      <VesselGroupReportInsightIUU skip={!vesselDatasets.length} />
      <VesselGroupReportInsightFlagChange skip={!vesselDatasets.length} />
      <VesselGroupReportInsightMOU skip={!vesselDatasets.length} />
    </div>
  )
}

export default VesselGroupReportInsights
