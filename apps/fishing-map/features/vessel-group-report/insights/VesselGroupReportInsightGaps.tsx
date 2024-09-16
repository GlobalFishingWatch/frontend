import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { groupBy } from 'lodash'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { getVesselId, getVesselProperty } from 'features/vessel/vessel.utils'
import { selectVesselGroupReportData } from '../vessel-group-report.slice'
import {
  selectFetchVesselGroupReportGapParams,
  selectVesselGroupGapInsightData,
} from '../vessel-group-report.selectors'
import styles from './VesselGroupReportInsight.module.css'
import VesselGroupReportInsightPlaceholder from './VesselGroupReportInsightsPlaceholders'
import VesselGroupReportInsightGapVesselEvents from './VesselGroupReportInsightGapVesselEvents'

const VesselGroupReportInsightGap = () => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedVesselIds, setExpandedVesselIds] = useState<string[]>([])
  console.log('🚀 ~ VesselGroupReportInsightGap ~ expandedVesselIds:', expandedVesselIds)
  const vesselGroup = useSelector(selectVesselGroupReportData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportGapParams)

  const { data, error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup,
  })
  // const dataFromSelector = useSelector(selectVesselGroupGapInsightData)

  const vesselsWithInsigth = data?.gap?.map((vessel) => vessel.vesselId)
  const vessels = vesselGroup?.vessels?.filter((vessel) =>
    vesselsWithInsigth?.includes(getVesselId(vessel))
  )

  // const infoVesselDatasets = Array.from(new Set(vessels?.flatMap((vessel) => vessel.dataset)))
  // const { data: events, isLoading: isEventsLoading } = useGetVesselEventsQuery(
  //   {
  //     datasets: vessels.flatMap((vessel) => vessel.dataset),
  //     vessels: expandedVesselIds,
  //     'start-date': start,
  //     'end-date': end,
  //   },
  //   { skip: !vesselGroup }
  // )
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
          open={isExpanded}
          className={styles.collapsable}
          labelClassName={styles.collapsableLabel}
          label={gapsTitle}
          onToggle={(isOpen) => isOpen !== isExpanded && setIsExpanded(!isExpanded)}
        >
          {vessels && vessels?.length > 0 && (
            <ul>
              {vessels.map((vessel) => {
                const vesselId = getVesselId(vessel)
                const isExpandedVessel = expandedVesselIds.includes(vesselId)
                // TODO: get the proper datasetId
                const eventsDatasetId = 'public-global-gaps-events:v3.0'
                return (
                  <li>
                    <Collapsable
                      id={vesselId}
                      open={isExpandedVessel}
                      className={styles.collapsable}
                      labelClassName={styles.collapsableLabel}
                      label={getVesselProperty(vessel, 'nShipname')}
                      onToggle={(isOpen, id) => {
                        setExpandedVesselIds((expandedIds) => {
                          return isOpen && id
                            ? [...expandedIds, id]
                            : expandedIds.filter((vesselId) => vesselId !== id)
                        })
                      }}
                    >
                      {isExpandedVessel && (
                        <VesselGroupReportInsightGapVesselEvents
                          vesselId={vesselId}
                          datasetId={eventsDatasetId}
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
