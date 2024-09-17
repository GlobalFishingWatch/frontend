import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { useState } from 'react'
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
import { selectVesselGroupReportGapVessels } from './vessel-group-report-insights.selectors'

const VesselGroupReportInsightGap = () => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedVesselIds, setExpandedVesselIds] = useState<string[]>([])
  const vesselGroup = useSelector(selectVesselGroupReportData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportGapParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup,
  })
  const vesselsWithGaps = useSelector(selectVesselGroupReportGapVessels)

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
      ) : !vesselsWithGaps || vesselsWithGaps?.length === 0 ? (
        <label>{t('vessel.insights.gapsEventsEmpty', 'No AIS Off events detected')}</label>
      ) : (
        <Collapsable
          id="gap-events"
          open={isExpanded}
          className={styles.collapsable}
          labelClassName={styles.collapsableLabel}
          label={t('vesselGroups.insights.gaps', {
            defaultValue: '{{count}} AIS Off Event from {{vessels}} vessels detected',
            count: vesselsWithGaps?.reduce(
              (acc, vessel) => acc + vessel.periodSelectedCounters.eventsGapOff,
              0
            ),
            vessels: vesselsWithGaps.length,
          })}
          onToggle={(isOpen) => isOpen !== isExpanded && setIsExpanded(!isExpanded)}
        >
          {vesselsWithGaps && vesselsWithGaps?.length > 0 && (
            <ul>
              {vesselsWithGaps.map((vessel) => {
                const vesselId = vessel.identity.id
                const isExpandedVessel = expandedVesselIds.includes(vesselId)
                return (
                  <li>
                    <Collapsable
                      id={vesselId}
                      open={isExpandedVessel}
                      className={styles.collapsable}
                      labelClassName={styles.collapsableLabel}
                      label={vessel.identity.nShipname}
                      onToggle={(isOpen, id) => {
                        setExpandedVesselIds((expandedIds) => {
                          return isOpen && id
                            ? [...expandedIds, id]
                            : expandedIds.filter((vesselId) => vesselId !== id)
                        })
                      }}
                    >
                      {isExpandedVessel && vessel.datasets[0] && (
                        <VesselGroupReportInsightGapVesselEvents
                          vesselId={vesselId}
                          datasetId={vessel.datasets[0]}
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
