import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import ReportVesselsGraphSelector from 'features/reports/vessels/ReportVesselsGraphSelector'
import { selectReportCategory } from 'features/app/app.selectors'
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
  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <label className={styles.blockTitle}>
          {reportCategory === DataviewCategory.Detections
            ? t('common.matchedVessels', 'Matched vessels')
            : t('common.vessel_other', 'Vessels')}
        </label>
        <ReportVesselsGraphSelector />
      </div>
      <ReportVesselsGraph />
      <ReportVesselsFilter />
      <ReportVesselsTable activityUnit={activityUnit} reportName={reportName} />
    </div>
  )
}
