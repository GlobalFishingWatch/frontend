import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { formatInfoField } from 'utils/info'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { selectVesselGroupReportData } from '../vessel-group-report.slice'
import { selectFetchVesselGroupReportFlagChangeParams } from '../vessel-group-report.selectors'
import styles from './VesselGroupReportInsight.module.css'
import VesselGroupReportInsightPlaceholder from './VesselGroupReportInsightsPlaceholders'
import { selectVesselGroupReportFlagChangesVessels } from './vessel-group-report-insights.selectors'

const VesselGroupReportInsightFlagChange = () => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)
  const vesselGroup = useSelector(selectVesselGroupReportData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportFlagChangeParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup,
  })

  const vesselsWithFlagChanges = useSelector(selectVesselGroupReportFlagChangesVessels)

  return (
    <div id="vessel-group-flags" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t('vessel.insights.flagChanges', 'Flag Changes')}</label>
        <DataTerminology
          size="tiny"
          type="default"
          title={t('vessel.insights.flagChanges', 'Flag Changes')}
          terminologyKey="insightsFlagsChanges"
        />
      </div>
      {guestUser ? (
        <VesselIdentityFieldLogin />
      ) : isLoading || !vesselGroup ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : !vesselsWithFlagChanges || vesselsWithFlagChanges.length === 0 ? (
        <span className={styles.secondary}>
          {t(
            'vesselGroupReport.insights.flagChangesEmpty',
            'There are no vessels with flag changes'
          )}
        </span>
      ) : (
        <Collapsable
          id="no-take-vessels"
          open={isExpanded}
          className={styles.collapsable}
          labelClassName={styles.collapsableLabel}
          label={t('vesselGroupReport.insights.flagChangesCount', {
            defaultValue: '{{vessels}} vessels had flag changes',
            vessels: vesselsWithFlagChanges.length,
          })}
          onToggle={(isOpen) => isOpen !== isExpanded && setIsExpanded(!isExpanded)}
        >
          <ul>
            {vesselsWithFlagChanges.map((vessel) => (
              <li key={vessel.identity.id} className={styles.vessel}>
                {formatInfoField(vessel.identity.shipname, 'name')} (
                {vessel.flagsChanges?.valuesInThePeriod.map((v) =>
                  formatInfoField(v.value, 'flag')
                )}
                )
              </li>
            ))}
          </ul>
        </Collapsable>
      )}
    </div>
  )
}

export default VesselGroupReportInsightFlagChange
