import { Fragment } from 'react'
import { useSelector } from 'react-redux'

import {
  selectReportVesselFilter,
  selectReportVesselsSubCategory,
} from 'features/reports/reports.config.selectors'
import type { ReportVesselsSubCategory } from 'features/reports/reports.types'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import type { ReportActivityUnit } from 'features/reports/tabs/activity/reports-activity.types'

import { ReportBarGraphPlaceholder } from '../placeholders/ReportBarGraphPlaceholder'

import {
  selectReportVesselsGraphAggregatedData,
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
  loading: boolean
  color?: string
  activityUnit?: ReportActivityUnit
}) {
  const aggregatedData = useSelector(selectReportVesselsGraphAggregatedData)
  // const individualData = useSelector(selectReportVesselsGraphIndividualData)
  const property = useSelector(selectReportVesselsSubCategory)
  const filter = useSelector(selectReportVesselFilter)
  const vessels = useSelector(selectReportVesselsPaginated)

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        {title && <label className={styles.blockTitle}>{title}</label>}
        <ReportVesselsGraphSelector />
      </div>
      {/* TODO:CVP add when no data available */}
      {loading ? (
        <ReportVesselsPlaceholder showGraphHeader={false} />
      ) : (
        <Fragment>
          <ReportVesselsGraph
            data={aggregatedData}
            // individualData={individualData}
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
      )}
    </div>
  )
}

export default ReportVessels
