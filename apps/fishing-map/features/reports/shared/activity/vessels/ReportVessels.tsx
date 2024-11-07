import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReportVesselsGraphSelector from 'features/reports/shared/activity/vessels/ReportVesselsGraphSelector'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import ReportSummaryTags from 'features/reports/areas/summary/ReportSummaryTags'
import { FIELDS, getCommonProperties } from 'features/reports/areas/area-reports.utils'
import { PROPERTIES_EXCLUDED } from 'features/reports/areas/summary/ReportSummary'
import { ReportActivityUnit } from 'features/reports/areas/AreaReport'
import { selectReportVesselFilter } from 'features/reports/areas/area-reports.config.selectors'
import { ReportCategory } from 'features/reports/areas/area-reports.types'
import ReportVesselsGraph from './ReportVesselsGraph'
import ReportVesselsFilter from './ReportVesselsFilter'
import ReportVesselsTable from './ReportVesselsTable'
import styles from './ReportVessels.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
  reportName?: string
}

export default function ReportVessels({ activityUnit, reportName }: ReportVesselTableProps) {
  const { t } = useTranslation()
  const reportCategory = useSelector(selectReportCategory)
  const reportVesselFilter = useSelector(selectReportVesselFilter)
  const dataviews = useSelector(selectActiveReportDataviews)
  const commonProperties = useMemo(() => {
    return getCommonProperties(dataviews).filter(
      (property) =>
        !dataviews[0].config?.filters?.[property] || !PROPERTIES_EXCLUDED.includes(property)
    )
  }, [dataviews])
  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <label className={styles.blockTitle}>
          {reportCategory === ReportCategory.Detections
            ? t('common.matchedVessels', 'Matched vessels')
            : t('common.vessel_other', 'Vessels')}
        </label>
        <ReportVesselsGraphSelector />
      </div>
      <div className={styles.tagsContainer}>
        {dataviews?.map((dataview, index) => (
          <ReportSummaryTags
            key={dataview.id}
            dataview={dataview}
            index={index}
            hiddenProperties={commonProperties}
            availableFields={FIELDS}
          />
        ))}
      </div>
      <ReportVesselsGraph />
      <ReportVesselsFilter
        filter={reportVesselFilter}
        filterQueryParam="reportVesselFilter"
        pageQueryParam="reportVesselPage"
      />
      <ReportVesselsTable activityUnit={activityUnit} reportName={reportName} />
    </div>
  )
}
