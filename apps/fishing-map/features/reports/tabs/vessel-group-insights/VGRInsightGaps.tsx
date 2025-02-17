import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Collapsable } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import VesselLink from 'features/vessel/VesselLink'
import { formatInfoField } from 'utils/info'

import { selectFetchVesselGroupReportGapParams } from '../../report-vessel-group/vessel-group-report.selectors'
import { selectVGRData } from '../../report-vessel-group/vessel-group-report.slice'

import { selectVGRGapVessels } from './vessel-group-report-insights.selectors'
import VesselGroupReportInsightPlaceholder from './VGRInsightsPlaceholders'
import VesselGroupReportInsightVesselEvents from './VGRInsightVesselEvents'

import styles from './VGRInsights.module.css'

const VesselGroupReportInsightGap = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedVesselIds, setExpandedVesselIds] = useState<string[]>([])
  const vesselGroup = useSelector(selectVGRData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportGapParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup || skip,
  })
  const vesselsWithGaps = useSelector(selectVGRGapVessels)
  const onInsightToggle = (isOpen: boolean) => {
    if (isOpen !== isExpanded) {
      setIsExpanded(!isExpanded)
    }
    if (isOpen) {
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: 'vessel_group_profile_insights_tab_expand_insights',
        label: 'gaps expanded',
      })
    }
  }

  const onVesselClick = (e: MouseEvent, vesselId?: string) => {
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: 'vessel_group_profile_insights_gaps_go_to_vessel',
      label: vesselId,
    })
  }

  return (
    <div id="vessel-group-gaps" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label className="experimental">{t('vessel.insights.gaps', 'AIS Off Events')}</label>
        <DataTerminology
          title={t('vessel.insights.gaps', 'AIS Off Events')}
          terminologyKey="insightsGaps"
        />
      </div>
      {skip || isLoading || !vesselGroup ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : !vesselsWithGaps || vesselsWithGaps?.length === 0 ? (
        <p className={cx(styles.nested, styles.secondary, styles.row)}>
          {t('vessel.insights.gapsEventsEmpty', 'No AIS Off events detected')}
        </p>
      ) : (
        <div className={cx(styles.nested, styles.row)}>
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
            onToggle={onInsightToggle}
          >
            {vesselsWithGaps && vesselsWithGaps?.length > 0 && (
              <ul className={styles.nested}>
                {vesselsWithGaps.map((vessel) => {
                  const vesselId = vessel.identity.id
                  const isExpandedVessel = expandedVesselIds.includes(vesselId)
                  return (
                    <li className={styles.row} key={vesselId}>
                      <Collapsable
                        id={vesselId}
                        open={isExpandedVessel}
                        className={styles.collapsable}
                        labelClassName={styles.collapsableLabel}
                        label={
                          <span className={styles.vesselName}>
                            <VesselLink
                              className={styles.link}
                              vesselId={vesselId}
                              datasetId={vessel.identity.dataset as string}
                              onClick={onVesselClick}
                              query={{
                                vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
                              }}
                            >
                              {formatInfoField(vessel.identity.shipname, 'shipname')}
                            </VesselLink>{' '}
                            <span className={styles.secondary}>
                              ({vessel.periodSelectedCounters.eventsGapOff})
                            </span>
                          </span>
                        }
                        onToggle={(isOpen, id) => {
                          setExpandedVesselIds((expandedIds) => {
                            return isOpen && id
                              ? [...expandedIds, id]
                              : expandedIds.filter((vesselId) => vesselId !== id)
                          })
                        }}
                      >
                        {isExpandedVessel && vessel.datasets[0] && (
                          <VesselGroupReportInsightVesselEvents
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
        </div>
      )}
    </div>
  )
}

export default VesselGroupReportInsightGap
