import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { groupBy } from 'lodash'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectVesselGroupReportData } from '../vessel-group-report.slice'
import { selectFetchVesselGroupReportGapParams } from '../vessel-group-report.selectors'
import styles from './VesselGroupReportInsight.module.css'
import VesselGroupReportInsightPlaceholder from './VesselGroupReportInsightsPlaceholders'
import VesselGroupReportInsightGapVesselEvents from './VesselGroupReportInsightGapVesselEvents'
import { selectVesselGroupReportGapVessels } from './vessel-group-insights.selectors'

const VesselGroupReportInsightGap = () => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedVesselIds, setExpandedVesselIds] = useState<string[]>([])
  const vesselGroup = useSelector(selectVesselGroupReportData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportGapParams)

  const { data, error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup,
  })
  const vesselsWithGaps = useSelector(selectVesselGroupReportGapVessels)

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
        <Collapsable
          id="gap-events"
          open={isExpanded}
          className={styles.collapsable}
          labelClassName={styles.collapsableLabel}
          label={gapsTitle}
          onToggle={(isOpen) => isOpen !== isExpanded && setIsExpanded(!isExpanded)}
        >
          {vesselsWithGaps && vesselsWithGaps?.length > 0 && (
            <ul>
              {vesselsWithGaps.map((vessel) => {
                const vesselId = vessel.id
                const isExpandedVessel = expandedVesselIds.includes(vesselId)
                // TODO: get the proper datasetId
                return (
                  <li>
                    <Collapsable
                      id={vesselId}
                      open={isExpandedVessel}
                      className={styles.collapsable}
                      labelClassName={styles.collapsableLabel}
                      label={vessel.nShipname}
                      onToggle={(isOpen, id) => {
                        setExpandedVesselIds((expandedIds) => {
                          return isOpen && id
                            ? [...expandedIds, id]
                            : expandedIds.filter((vesselId) => vesselId !== id)
                        })
                      }}
                    >
                      {isExpandedVessel && vessel.eventsDatasetId && (
                        <VesselGroupReportInsightGapVesselEvents
                          vesselId={vesselId}
                          datasetId={vessel.eventsDatasetId}
                          start={fetchVesselGroupParams.start}
                          end={fetchVesselGroupParams.end}
                        />
                      )}
                    </Collapsable>
                  </li>
                )
              })}
            </ul>
          )}
        </Collapsable>
      )}
    </div>
  )
}

export default VesselGroupReportInsightGap
