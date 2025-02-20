import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { RegionType, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Collapsable } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import VesselLink from 'features/vessel/VesselLink'
import { formatInfoField } from 'utils/info'

import { selectFetchVesselGroupReportFishingParams } from '../../report-vessel-group/vessel-group-report.selectors'
import { selectVGRData } from '../../report-vessel-group/vessel-group-report.slice'

import type { VesselGroupReportInsightVessel } from './vessel-group-report-insights.selectors'
import {
  selectVGRVesselsInRfmoWithoutKnownAuthorization,
  selectVGRVesselsWithNoTakeMpas,
} from './vessel-group-report-insights.selectors'
import VesselGroupReportInsightPlaceholder from './VGRInsightsPlaceholders'
import VesselGroupReportInsightVesselEvents from './VGRInsightVesselEvents'

import styles from './VGRInsights.module.css'

export const RFMO_REGIONS_PRIORITY: RegionType[] = [
  RegionType.rfmo,
  RegionType.mpa,
  RegionType.eez,
  RegionType.fao,
]

const VesselGroupReportInsightFishing = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
  const [isMPAExpanded, setIsMPAExpanded] = useState(false)
  const [isRFMOExpanded, setIsRFMOExpanded] = useState(false)
  const [expandedVesselIds, setExpandedVesselIds] = useState<string[]>([])
  const vesselGroup = useSelector(selectVGRData)
  const reportFishingParams = useSelector(selectFetchVesselGroupReportFishingParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(reportFishingParams, {
    skip: !vesselGroup || skip,
  })
  const vesselsWithNoTakeMpas = useSelector(selectVGRVesselsWithNoTakeMpas)
  const vesselsInRfmoWithoutKnownAuthorization = useSelector(
    selectVGRVesselsInRfmoWithoutKnownAuthorization
  )

  const onMPAToggle = (isOpen: boolean) => {
    if (isOpen !== isMPAExpanded) {
      setIsMPAExpanded(!isMPAExpanded)
    }
    if (!isOpen) {
      setExpandedVesselIds([])
    }
    if (isOpen) {
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: 'vessel_group_profile_insights_tab_expand_insights',
        label: 'fishing in no-take MPAs expanded',
      })
    }
  }

  const onRFMOToggle = (isOpen: boolean) => {
    if (isOpen !== isRFMOExpanded) {
      setIsRFMOExpanded(!isRFMOExpanded)
    }
    if (!isOpen) {
      setExpandedVesselIds([])
    }
    if (isOpen) {
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: 'vessel_group_profile_insights_tab_expand_insights',
        label: 'fishing RFMOs expanded',
      })
    }
  }

  const onVesselClick = (e: MouseEvent, vesselId?: string) => {
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: 'vessel_group_profile_insights_fishing_go_to_vessel',
      label: vesselId,
    })
  }

  const getVesselGroupReportInsighFishingVessels = (
    vessels: VesselGroupReportInsightVessel[],
    insight: 'eventsInNoTakeMpas' | 'eventsInRfmoWithoutKnownAuthorization'
  ) => {
    const expandedIdPrefix = insight === 'eventsInNoTakeMpas' ? 'no-take-' : 'rfmo-'
    return (
      <ul className={cx(styles.nested, styles.row)}>
        {vessels.map((vessel) => {
          const vesselId = vessel.identity.id
          const expandedVesselId = `${expandedIdPrefix}${vesselId}`
          const isExpandedVessel = expandedVesselIds.includes(expandedVesselId)
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
                      query={{ vesselIdentitySource: VesselIdentitySourceEnum.SelfReported }}
                    >
                      {formatInfoField(vessel.identity.shipname, 'shipname')}
                    </VesselLink>
                    <span className={cx(styles.secondary, styles.marginLeft)}>
                      ({vessel[insight].length})
                    </span>
                  </span>
                }
                onToggle={(isOpen, id) => {
                  setExpandedVesselIds((expandedIds) => {
                    return isOpen && id
                      ? [...expandedIds, expandedVesselId]
                      : expandedIds.filter((vesselId) => vesselId !== expandedVesselId)
                  })
                }}
              >
                {isExpandedVessel && vessel.datasets?.[0] && (
                  <VesselGroupReportInsightVesselEvents
                    ids={vessel[insight]}
                    vesselId={vesselId}
                    regionsPriority={
                      insight === 'eventsInRfmoWithoutKnownAuthorization'
                        ? RFMO_REGIONS_PRIORITY
                        : undefined
                    }
                    datasetId={vessel.datasets[0]}
                    start={reportFishingParams.start}
                    end={reportFishingParams.end}
                  />
                )}
              </Collapsable>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div id="vessel-group-fishing" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t('vessel.insights.fishing', 'Fishing Events')}</label>
        <DataTerminology
          title={t('vessel.insights.fishing', 'Fishing Events')}
          terminologyKey="insightsFishing"
        />
      </div>
      {skip || isLoading || !vesselGroup ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : (
        <div className={styles.nested}>
          {!vesselsWithNoTakeMpas || vesselsWithNoTakeMpas?.length === 0 ? (
            <p className={cx(styles.secondary, styles.row)}>
              {t(
                'vessel.insights.fishingEventsInNoTakeMpasEmpty',
                'No fishing events detected in no-take MPAs'
              )}
            </p>
          ) : (
            <Collapsable
              id="no-take-vessels"
              open={isMPAExpanded}
              className={styles.collapsable}
              labelClassName={styles.collapsableLabel}
              label={t('vesselGroups.insights.fishingInNoTakeMpas', {
                defaultValue:
                  '{{count}} fishing events from {{vessels}} vessels detected in no-take MPAs',
                count: vesselsWithNoTakeMpas.reduce(
                  (acc, vessel) => acc + vessel.eventsInNoTakeMpas.length,
                  0
                ),
                vessels: vesselsWithNoTakeMpas?.length,
              })}
              onToggle={onMPAToggle}
            >
              {getVesselGroupReportInsighFishingVessels(
                vesselsWithNoTakeMpas,
                'eventsInNoTakeMpas'
              )}
            </Collapsable>
          )}
          {!vesselsInRfmoWithoutKnownAuthorization ||
          !vesselsInRfmoWithoutKnownAuthorization?.length ? (
            <p className={cx(styles.secondary, styles.row)}>
              {t(
                'vessel.insights.fishingEventsInRfmoWithoutKnownAuthorizationEmpty',
                'No fishing events detected outside known RFMO authorized areas'
              )}
            </p>
          ) : (
            <Collapsable
              id="without-known-authorization-vessels"
              open={isRFMOExpanded}
              className={styles.collapsable}
              labelClassName={styles.collapsableLabel}
              label={t('vesselGroups.insights.fishingInRfmoWithoutKnownAuthorization', {
                defaultValue:
                  '{{count}} fishing events from {{vessels}} vessels detected outside known RFMO authorized areas',
                count: vesselsInRfmoWithoutKnownAuthorization.reduce(
                  (acc, vessel) => acc + vessel.eventsInRfmoWithoutKnownAuthorization.length,
                  0
                ),
                vessels: vesselsInRfmoWithoutKnownAuthorization.length,
              })}
              onToggle={onRFMOToggle}
            >
              {getVesselGroupReportInsighFishingVessels(
                vesselsInRfmoWithoutKnownAuthorization,
                'eventsInRfmoWithoutKnownAuthorization'
              )}
            </Collapsable>
          )}
        </div>
      )}
    </div>
  )
}

export default VesselGroupReportInsightFishing
