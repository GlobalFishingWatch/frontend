import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import {
  selectReportVesselFilter,
  selectReportVesselsSubCategory,
} from 'features/reports/reports.config.selectors'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { ReportCategory, type ReportVesselsSubCategory } from 'features/reports/reports.types'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import type { ReportActivityUnit } from 'features/reports/tabs/activity/reports-activity.types'
import { selectIsVesselGroupReportLocation } from 'routes/routes.selectors'

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

function ReportVessels({ loading, color }: { loading?: boolean; color?: string }) {
  const { t } = useTranslation()
  const aggregatedData = useSelector(selectReportVesselsGraphAggregatedData)
  // const individualData = useSelector(selectReportVesselsGraphIndividualData)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const reportCategory = useSelector(selectReportCategory)
  const property = useSelector(selectReportVesselsSubCategory)
  const filter = useSelector(selectReportVesselFilter)
  const vessels = useSelector(selectReportVesselsPaginated)
  const valueKeys = useSelector(selectReportVesselsGraphDataKeys)

  const title = isVesselGroupReportLocation
    ? undefined
    : reportCategory === ReportCategory.Detections
      ? t('common.matchedVessels', 'Matched vessels')
      : t('common.vessel_other', 'Vessels')

  const activityUnit: ReportActivityUnit | undefined = isVesselGroupReportLocation
    ? undefined
    : reportCategory === ReportCategory.Activity
      ? 'hour'
      : 'detection'

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
        <ReportVesselsPlaceholder />
      )}
    </div>
  )
}

export default ReportVessels
