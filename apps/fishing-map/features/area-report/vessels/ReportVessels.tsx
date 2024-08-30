import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReportVesselsGraphSelector from 'features/area-report/vessels/ReportVesselsGraphSelector'
import {
  selectActiveReportDataviews,
  selectReportCategory,
  selectReportVesselFilter,
} from 'features/app/selectors/app.reports.selector'
import { ReportCategory } from 'types'
import ReportSummaryTags from 'features/area-report/summary/ReportSummaryTags'
import { FIELDS, getCommonProperties } from 'features/area-report/reports.utils'
import { PROPERTIES_EXCLUDED } from 'features/area-report/summary/ReportSummary'
import { ReportActivityUnit } from '../Report'
import ReportVesselsGraph from './ReportVesselsGraph'
import ReportVesselsFilter from './ReportVesselsFilter'
import ReportVesselsTable from './ReportVesselsTable'
import styles from './ReportVessels.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
  reportName: string
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
