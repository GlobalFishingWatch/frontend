import { useTranslation } from 'react-i18next'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'
import InsightError from 'features/vessel/insights/InsightErrorMessage'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectVesselGroupReportData } from '../vessel-group-report.slice'
import { selectFetchVesselGroupReportIUUParams } from '../vessel-group-report.selectors'
import styles from './VesselGroupReportInsight.module.css'
import VesselGroupReportInsightPlaceholder from './VesselGroupReportInsightsPlaceholders'
import { selectVesselGroupReportIUUVessels } from './vessel-group-report-insights.selectors'
import VesselGroupReportInsightVesselTable from './VesselGroupReportInsightVesselsTable'

const VesselGroupReportInsightIUU = () => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const vesselGroup = useSelector(selectVesselGroupReportData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportIUUParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup,
  })
  const vesselsWithIIU = useSelector(selectVesselGroupReportIUUVessels)

  return (
    <div id="vessel-group-iuu" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t('vessel.insights.IUU', 'RFMO IUU Vessel List')}</label>
        <DataTerminology
          size="tiny"
          type="default"
          title={t('vessel.insights.IUU', 'RFMO IUU Vessel List')}
          terminologyKey="insightsIUU"
        />
      </div>
      {isLoading || !vesselGroup ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : !vesselsWithIIU || vesselsWithIIU.length === 0 ? (
        <span className={styles.secondary}>
          {t(
            'vesselGroupReport.insights.IUUBlackListsEmpty',
            'No vessels are present on a RFMO IUU vessel list'
          )}
        </span>
      ) : (
        <Collapsable
          id="no-take-vessels"
          open={isExpanded}
          className={styles.collapsable}
          labelClassName={styles.collapsableLabel}
          label={t('vesselGroupReport.insights.IUUBlackListsCount', {
            defaultValue: '{{vessels}} vessels are present on a RFMO IUU vessel list',
            vessels: vesselsWithIIU.length,
          })}
          onToggle={(isOpen) => isOpen !== isExpanded && setIsExpanded(!isExpanded)}
        >
          <VesselGroupReportInsightVesselTable vessels={vesselsWithIIU} />
        </Collapsable>
      )}
    </div>
  )
}

export default VesselGroupReportInsightIUU
