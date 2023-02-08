import React from 'react'
import { useTranslation } from 'react-i18next'
import ReportActivityGraphSelector from 'features/reports/ReportActivityGraphSelector'
import { ReportActivityUnit } from './Report'
import ReportActivityGraph from './ReportActivityGraph'
import styles from './ReportActivity.module.css'

type ReportVesselTableProps = {
  activityUnit: ReportActivityUnit
}

export default function ReportActivity({ activityUnit }: ReportVesselTableProps) {
  const { t } = useTranslation()
  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <label className={styles.blockTitle}>{t('common.activity', 'Activity')}</label>
        <ReportActivityGraphSelector />
      </div>
      <ReportActivityGraph />
    </div>
  )
}
