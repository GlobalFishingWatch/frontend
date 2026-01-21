import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useGetVesselGroupInsightQuery } from 'queries/vessel-insight-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Icon } from '@globalfishingwatch/ui-components'

import { ReportBarGraphPlaceholder } from 'features/reports/shared/placeholders/ReportBarGraphPlaceholder'
import { selectReportVesselsFiltered } from 'features/reports/shared/vessels/report-vessels.selectors'

import { selectFetchVesselGroupReportCoverageParams } from '../../report-vessel-group/vessel-group-report.selectors'

import VesselGroupReportInsightCoverageGraph from './VGRInsightCoverageGraph'

import styles from './VGRInsights.module.css'

const VesselGroupReportInsightCoverage = ({ skip }: { skip?: boolean }) => {
  const { t } = useTranslation()
  const fetchParams = useSelector(selectFetchVesselGroupReportCoverageParams)
  const { data, error, isLoading } = useGetVesselGroupInsightQuery(fetchParams, { skip })
  const vessels = useSelector(selectReportVesselsFiltered)

  return (
    <div id="vessel-group-coverage" className={styles.insightContainer}>
      {skip || isLoading || error ? (
        <ReportBarGraphPlaceholder numberOfElements={6} animate={false}>
          <Fragment>
            {(error as ParsedAPIError)?.status === 403 && (
              <Icon
                icon="private"
                tooltip={t(
                  'vessel.insights.errorPermisions',
                  "You don't have permissions to see this insight"
                )}
              />
            )}
            {error && (error.message ?? t('analysis.error'))}
          </Fragment>
        </ReportBarGraphPlaceholder>
      ) : data?.coverage && data?.coverage?.length > 0 ? (
        <Fragment>
          {vessels?.length && vessels?.length > 0 ? (
            <VesselGroupReportInsightCoverageGraph data={vessels} />
          ) : (
            <ReportBarGraphPlaceholder numberOfElements={6} animate={false}>
              {t('analysis.noVesselDataFiltered')}
            </ReportBarGraphPlaceholder>
          )}
        </Fragment>
      ) : null}
    </div>
  )
}

export default VesselGroupReportInsightCoverage
