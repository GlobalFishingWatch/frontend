import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { formatInfoField } from 'utils/info'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import VesselLink from 'features/vessel/VesselLink'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVGRData } from '../vessel-group-report.slice'
import { selectFetchVesselGroupReportFlagChangeParams } from '../vessel-group-report.selectors'
import styles from './VGRInsights.module.css'
import VesselGroupReportInsightPlaceholder from './VGRInsightsPlaceholders'
import { selectVGRFlagChangesVessels } from './vessel-group-report-insights.selectors'

const VesselGroupReportInsightFlagChange = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const guestUser = useSelector(selectIsGuestUser)
  const vesselGroup = useSelector(selectVGRData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportFlagChangeParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup || skip,
  })

  const vesselsWithFlagChanges = useSelector(selectVGRFlagChangesVessels)

  const onInsightToggle = (isOpen: boolean) => {
    if (isOpen !== isExpanded) {
      setIsExpanded(!isExpanded)
    }
    if (isOpen) {
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: 'vessel_group_profile_insights_tab_expand_insights',
        label: 'flag changes expanded',
      })
    }
  }

  const onVesselClick = (e: MouseEvent, vesselId?: string) => {
    trackEvent({
      category: TrackCategory.VesselGroupReport,
      action: 'vessel_group_profile_insights_flag_changes_go_to_vessel',
      label: vesselId,
    })
  }

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
      ) : skip || isLoading || !vesselGroup ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : !vesselsWithFlagChanges || vesselsWithFlagChanges.length === 0 ? (
        <span className={cx(styles.secondary, styles.nested, styles.row)}>
          {t(
            'vesselGroupReport.insights.flagChangesEmpty',
            'There are no vessels with flag changes'
          )}
        </span>
      ) : (
        <div className={styles.nested}>
          <Collapsable
            id="no-take-vessels"
            open={isExpanded}
            className={styles.collapsable}
            labelClassName={cx(styles.collapsableLabel, styles.row)}
            label={t('vesselGroupReport.insights.flagChangesCount', {
              defaultValue: '{{vessels}} vessels had flag changes',
              vessels: vesselsWithFlagChanges.length,
            })}
            onToggle={onInsightToggle}
          >
            <ul className={styles.nested}>
              {vesselsWithFlagChanges.map((vessel) => (
                <li key={vessel.identity.id} className={cx(styles.vessel, styles.row)}>
                  <VesselLink
                    className={styles.link}
                    vesselId={vessel.vesselId}
                    datasetId={vessel.identity.dataset as string}
                    onClick={onVesselClick}
                    query={{
                      start: fetchVesselGroupParams.start,
                      end: fetchVesselGroupParams.end,
                      vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
                    }}
                  >
                    {formatInfoField(vessel.identity.shipname, 'shipname')} (
                  </VesselLink>
                  {vessel.flagsChanges?.valuesInThePeriod.map((v) =>
                    formatInfoField(v.value, 'flag')
                  )}
                  )
                </li>
              ))}
            </ul>
          </Collapsable>
        </div>
      )}
    </div>
  )
}

export default VesselGroupReportInsightFlagChange
