import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import {
  selectReportVesselFilter,
  selectReportVesselsSubCategory,
} from 'features/reports/reports.config.selectors'
import type { ReportVesselsSubCategory } from 'features/reports/reports.types'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import type { ReportActivityUnit } from 'features/reports/tabs/activity/reports-activity.types'

import {
  selectReportVesselsGraphAggregatedData,
  selectReportVesselsGraphDataKeys,
  selectReportVesselsPaginated,
} from './report-vessels.selectors'
import ReportVesselsFilter from './ReportVesselsFilter'
import ReportVesselsGraph from './ReportVesselsGraph'
import ReportVesselsGraphSelector from './ReportVesselsGraphSelector'
import ReportVesselsTable from './ReportVesselsTable'

import styles from './ReportVessels.module.css'

function ReportVessels({
  title,
  loading,
  color,
  activityUnit,
}: {
  title?: string
  loading?: boolean
  color?: string
  activityUnit?: ReportActivityUnit
}) {
  const { t } = useTranslation()
  const aggregatedData = useSelector(selectReportVesselsGraphAggregatedData)
  // const individualData = useSelector(selectReportVesselsGraphIndividualData)
  const property = useSelector(selectReportVesselsSubCategory)
  const filter = useSelector(selectReportVesselFilter)
  const vessels = useSelector(selectReportVesselsPaginated)
  const valueKeys = useSelector(selectReportVesselsGraphDataKeys)

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        {title && <label className={styles.blockTitle}>{title}</label>}
        <ReportVesselsGraphSelector />
      </div>
      {loading ? (
        <ReportVesselsPlaceholder showGraphHeader={false} />
      ) : aggregatedData && aggregatedData.length > 0 ? (
        <Fragment>
          <ReportVesselsGraph
            data={aggregatedData}
            // individualData={individualData}
            aggregatedValueKey={valueKeys}
            color={color}
            property={property as ReportVesselsSubCategory}
          />
          <ReportVesselsFilter filter={filter} />
          <ReportVesselsTable
            activityUnit={activityUnit}
            allowSorting={activityUnit === undefined}
            vessels={vessels}
          />
        </Fragment>
      ) : (
        <ReportVesselsPlaceholder>
          <div className={styles.emptyState}>
            <p>{t('analysis.noDataByArea', 'No data available for the selected area')}</p>
          </div>
        </ReportVesselsPlaceholder>
      )}
    </div>
  )
}

export default ReportVessels
