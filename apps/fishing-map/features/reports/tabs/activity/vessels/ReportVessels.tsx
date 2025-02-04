import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { FIELDS, getCommonProperties } from 'features/reports/report-area/area-reports.utils'
import { PROPERTIES_EXCLUDED } from 'features/reports/report-area/summary/ReportSummary'
import ReportSummaryTags from 'features/reports/report-area/summary/ReportSummaryTags'
import { ReportCategory } from 'features/reports/reports.types'
import { ReportBarGraphPlaceholder } from 'features/reports/shared/placeholders/ReportBarGraphPlaceholder'
import ReportVessels from 'features/reports/shared/vessels/ReportVessels'
import type { ReportActivityUnit } from 'features/reports/tabs/activity/reports-activity.types'

import {
  selectReportVesselsGraphDataGrouped,
  selectReportVesselsGraphIndividualData,
} from './report-activity-vessels.selectors'

import styles from './ReportVessels.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
  reportName?: string
}

export default function ReportVesselsLegacy({ activityUnit, reportName }: ReportVesselTableProps) {
  const { t } = useTranslation()
  const reportCategory = useSelector(selectReportCategory)
  const dataviews = useSelector(selectActiveReportDataviews)

  const data = useSelector(selectReportVesselsGraphDataGrouped)!
  const individualData = useSelector(selectReportVesselsGraphIndividualData)

  const commonProperties = useMemo(() => {
    return getCommonProperties(dataviews).filter(
      (property) =>
        !dataviews[0].config?.filters?.[property] || !PROPERTIES_EXCLUDED.includes(property)
    )
  }, [dataviews])

  const title =
    reportCategory === ReportCategory.Detections
      ? t('common.matchedVessels', 'Matched vessels')
      : t('common.vessel_other', 'Vessels')

  if (!data) {
    return (
      <div className={styles.graph} data-test="activity-report-vessels-graph">
        <ReportBarGraphPlaceholder animate={false} />
      </div>
    )
  }

  return (
    <div className={styles.graph} data-test="activity-report-vessels-graph">
      {/* TODO:CVP add activityUnit */}
      <ReportVessels data={data} individualData={individualData} title={title} loading={false} />
    </div>
  )
}
