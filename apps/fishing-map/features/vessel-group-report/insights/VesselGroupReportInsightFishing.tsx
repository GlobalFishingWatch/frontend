import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectVesselGroupReportData } from '../vessel-group-report.slice'
import { selectFetchVesselGroupReportFishingParams } from '../vessel-group-report.selectors'
import styles from './VesselGroupReportInsight.module.css'
import VesselGroupReportInsightPlaceholder from './VesselGroupReportInsightsPlaceholders'
import VesselGroupReportInsightVesselEvents from './VesselGroupReportInsightVesselEvents'
import {
  selectVesselGroupReportVesselsWithNoTakeMpas,
  selectVesselGroupReportVesselsInRfmoWithoutKnownAuthorization,
} from './vessel-group-report-insights.selectors'

const VesselGroupReportInsightFishing = () => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedVesselIds, setExpandedVesselIds] = useState<string[]>([])
  const vesselGroup = useSelector(selectVesselGroupReportData)
  const reportFishingParams = useSelector(selectFetchVesselGroupReportFishingParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(reportFishingParams, {
    skip: !vesselGroup,
  })
  const vesselsWithNoTakeMpas = useSelector(selectVesselGroupReportVesselsWithNoTakeMpas)
  const vesselsInRfmoWithoutKnownAuthorization = useSelector(
    selectVesselGroupReportVesselsInRfmoWithoutKnownAuthorization
  )

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
      {isLoading ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : (
        <Fragment>
          {!vesselsWithNoTakeMpas || vesselsWithNoTakeMpas?.length === 0 ? (
            <label>
              {t(
                'vessel.insights.fishingEventsInNoTakeMpasEmpty',
                'No fishing events detected in no-take MPAs'
              )}
            </label>
          ) : (
            <Collapsable
              id="no-take-vessels"
              open={isExpanded}
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
              onToggle={(isOpen) => isOpen !== isExpanded && setIsExpanded(!isExpanded)}
            >
              {vesselsWithNoTakeMpas && vesselsWithNoTakeMpas?.length > 0 && (
                <ul>
                  {vesselsWithNoTakeMpas.map((vessel) => {
                    const vesselId = vessel.identity.id
                    const isExpandedVessel = expandedVesselIds.includes(vesselId)
                    // TODO: get the proper datasetId
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
              )}
            </Collapsable>
          )}
          {!vesselsInRfmoWithoutKnownAuthorization ||
          !vesselsInRfmoWithoutKnownAuthorization?.length ? (
            <label>
              {t(
                'vessel.insights.fishingEventsInRfmoWithoutKnownAuthorizationEmpty',
                'No fishing events detected outside known RFMO authorized areas'
              )}
            </label>
          ) : (
            <Collapsable
              id="without-known-authorization-vessels"
              open={isExpanded}
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
              onToggle={(isOpen) => isOpen !== isExpanded && setIsExpanded(!isExpanded)}
            >
              {vesselsInRfmoWithoutKnownAuthorization &&
                vesselsInRfmoWithoutKnownAuthorization?.length > 0 && (
                  <ul>
                    {vesselsInRfmoWithoutKnownAuthorization.map((vessel) => {
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
                            {isExpandedVessel && vessel.datasets?.[0] && (
                              <VesselGroupReportInsightVesselEvents
                                ids={vessel.eventsInRfmoWithoutKnownAuthorization}
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
                )}
            </Collapsable>
          )}
        </Fragment>
      )}
    </div>
  )
}

export default VesselGroupReportInsightFishing
