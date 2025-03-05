import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Collapsable } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import InsightError from 'features/vessel/insights/InsightErrorMessage'

import { selectFetchVesselGroupReportIUUParams } from '../../report-vessel-group/vessel-group-report.selectors'
import { selectVGRData } from '../../report-vessel-group/vessel-group-report.slice'

import { selectVGRIUUVessels } from './vessel-group-report-insights.selectors'
import VesselGroupReportInsightPlaceholder from './VGRInsightsPlaceholders'
import VesselGroupReportInsightVesselTable from './VGRInsightVesselsTable'

import styles from './VGRInsights.module.css'

const VesselGroupReportInsightIUU = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const vesselGroup = useSelector(selectVGRData)
  const fetchVesselGroupParams = useSelector(selectFetchVesselGroupReportIUUParams)

  const { error, isLoading } = useGetVesselGroupInsightQuery(fetchVesselGroupParams, {
    skip: !vesselGroup || skip,
  })
  const vesselsWithIIU = useSelector(selectVGRIUUVessels)

  const onInsightToggle = (isOpen: boolean) => {
    if (isOpen !== isExpanded) {
      setIsExpanded(!isExpanded)
    }
    if (isOpen) {
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: 'vessel_group_profile_insights_tab_expand_insights',
        label: 'IUU expanded',
      })
    }
  }

  return (
    <div id="vessel-group-iuu" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t('vessel.insights.IUU', 'RFMO IUU Vessel List')}</label>
        <DataTerminology
          title={t('vessel.insights.IUU', 'RFMO IUU Vessel List')}
          terminologyKey="insightsIUU"
        />
      </div>
      {skip || isLoading || !vesselGroup ? (
        <VesselGroupReportInsightPlaceholder />
      ) : error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : !vesselsWithIIU || vesselsWithIIU.length === 0 ? (
        <span className={cx(styles.secondary, styles.nested, styles.row)}>
          {t(
            'vesselGroupReport.insights.IUUBlackListsEmpty',
            'No vessels are present on a RFMO IUU vessel list'
          )}
        </span>
      ) : (
        <div className={styles.nested}>
          <Collapsable
            id="no-take-vessels"
            open={isExpanded}
            className={styles.collapsable}
            labelClassName={cx(styles.collapsableLabel, styles.row)}
            label={t('vesselGroupReport.insights.IUUBlackListsCount', {
              defaultValue: '{{vessels}} vessels are present on a RFMO IUU vessel list',
              vessels: vesselsWithIIU.length,
            })}
            onToggle={onInsightToggle}
          >
            <div className={styles.nested}>
              <VesselGroupReportInsightVesselTable vessels={vesselsWithIIU} />
            </div>
          </Collapsable>
        </div>
      )}
    </div>
  )
}

export default VesselGroupReportInsightIUU
