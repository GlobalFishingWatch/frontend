import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { groupBy } from 'lodash'
import { useMemo } from 'react'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import styles from './VesselGroupReportInsight.module.css'
import VesselGroupReportInsightPlaceholder from './VesselGroupReportInsightsPlaceholders'

const VesselGroupReportInsightGap = ({
  vesselGroupId,
  start,
  end,
}: {
  vesselGroupId: string
  start: string
  end: string
}) => {
  const { t } = useTranslation()
  const { data, error, isLoading } = useGetVesselGroupInsightQuery({
    vesselGroupId: vesselGroupId,
    insight: 'GAP',
    start,
    end,
  })
  const eventsByVessel = useMemo(() => {
    return groupBy(data?.gap, (entry) => entry.vesselId)
  }, [data])
  const hasEvents = data?.gap !== undefined && data?.gap?.length > 0
  const vesselsInEvents = hasEvents ? Object.keys(eventsByVessel).length : 0
  const totalEvents = data?.gap?.reduce((acc, vessel) => acc + vessel.aisOff.length, 0) || 0
  const gapsTitle = hasEvents
    ? t('vesselGroups.insights.gaps', {
        defaultValue: '{{count}} AIS Off Event from {{vessels}} vessels detected',
        count: totalEvents,
        vessels: vesselsInEvents,
      })
    : t('vessel.insights.gapsEventsEmpty', 'No AIS Off events detected')
  return (
    <div id="vessel-group-gaps" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label className="experimental">{t('vessel.insights.gaps', 'AIS Off Events')}</label>
        <DataTerminology
          size="tiny"
          type="default"
          title={t('vessel.insights.gaps', 'AIS Off Events')}
          terminologyKey="insightsGaps"
        />
      </div>
      {isLoading ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : (
        <span>{gapsTitle}</span>
      )}
    </div>
  )
}

export default VesselGroupReportInsightGap
