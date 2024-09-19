import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { formatInfoField } from 'utils/info'
import { selectVGRData } from '../vessel-group-report.slice'
import { selectFetchVesselGroupReportFishingParams } from '../vessel-group-report.selectors'
import styles from './VGRInsights.module.css'
import VesselGroupReportInsightPlaceholder from './VGRInsightsPlaceholders'
import VesselGroupReportInsightVesselEvents from './VGRInsightVesselEvents'
import {
  selectVGRVesselsWithNoTakeMpas,
  selectVGRVesselsInRfmoWithoutKnownAuthorization,
  VesselGroupReportInsightVessel,
} from './vessel-group-report-insights.selectors'

const VesselGroupReportInsightFishing = () => {
  const { t } = useTranslation()
  const [isMPAExpanded, setIsMPAExpanded] = useState(false)
  const [isRFMOExpanded, setIsRFMOExpanded] = useState(false)
  const [expandedVesselIds, setExpandedVesselIds] = useState<string[]>([])
  const vesselGroup = useSelector(selectVGRData)
  const reportFishingParams = useSelector(selectFetchVesselGroupReportFishingParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(reportFishingParams, {
    skip: !vesselGroup,
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
  }

  const onRFMOToggle = (isOpen: boolean) => {
    if (isOpen !== isRFMOExpanded) {
      setIsRFMOExpanded(!isRFMOExpanded)
    }
    if (!isOpen) {
      setExpandedVesselIds([])
    }
  }

  const getVesselGroupReportInsighFishingVessels = (
    vessels: VesselGroupReportInsightVessel[],
    insight: 'eventsInNoTakeMPAs' | 'eventsInRFMOWithoutKnownAuthorization'
  ) => {
    return (
      <ul className={cx(styles.nested, styles.row)}>
        {vessels.map((vessel) => {
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
                  <span>
                    {formatInfoField(vessel.identity.shipname, 'name')}{' '}
                    <span className={styles.secondary}>
                      ({vessel.periodSelectedCounters[insight]})
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
                {isExpandedVessel && vessel.datasets?.[0] && (
                  <VesselGroupReportInsightVesselEvents
                    ids={vessel.eventsInNoTakeMpas}
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
          size="tiny"
          type="default"
          title={t('vessel.insights.fishing', 'Fishing Events')}
          terminologyKey="insightsFishing"
        />
      </div>
      {isLoading || !vesselGroup ? (
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
                  (acc, vessel) => acc + vessel.periodSelectedCounters.eventsInNoTakeMPAs,
                  0
                ),
                vessels: vesselsWithNoTakeMpas?.length,
              })}
              onToggle={onMPAToggle}
            >
              {getVesselGroupReportInsighFishingVessels(
                vesselsWithNoTakeMpas,
                'eventsInNoTakeMPAs'
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
                  (acc, vessel) =>
                    acc + vessel.periodSelectedCounters.eventsInRFMOWithoutKnownAuthorization,
                  0
                ),
                vessels: vesselsInRfmoWithoutKnownAuthorization.length,
              })}
              onToggle={onRFMOToggle}
            >
              {getVesselGroupReportInsighFishingVessels(
                vesselsInRfmoWithoutKnownAuthorization,
                'eventsInRFMOWithoutKnownAuthorization'
              )}
            </Collapsable>
          )}
        </div>
      )}
    </div>
  )
}

export default VesselGroupReportInsightFishing
