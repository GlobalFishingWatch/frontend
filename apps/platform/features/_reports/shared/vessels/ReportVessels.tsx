import { Fragment, useRef } from 'react'
import { useSelector } from 'react-redux'

import { selectReportVesselFilter } from 'features/_reports/reports.config.selectors'
import { selectReportVesselGraph } from 'features/_reports/reports.selectors'
import { type ReportVesselsSubCategory } from 'features/_reports/reports.types'
import ReportGraphScreenshot from 'features/_reports/shared/download/ReportGraphScreenshot'
import ReportVesselsPlaceholder from 'features/_reports/shared/placeholders/ReportVesselsPlaceholder'
import type { ReportActivityUnit } from 'features/_reports/tabs/activity/reports-activity.types'
import VesselGroupReportInsightCoverage from 'features/_reports/tabs/vessel-group-insights/VGRInsightCoverage'
import { selectPrintMode } from 'features/app/print.slice'

import {
  selectReportVesselsGraphAggregatedData,
  selectReportVesselsGraphDataKeys,
  selectReportVesselsGraphIndividualData,
  selectReportVesselsOrdered,
  selectReportVesselsPaginated,
} from './report-vessels.selectors'
import ReportVesselsFilter from './ReportVesselsFilter'
import ReportVesselsGraph from './ReportVesselsGraph'
import ReportVesselsGraphSelector from './ReportVesselsGraphSelector'
import ReportVesselsTable from './ReportVesselsTable'

import styles from './ReportVessels.module.css'

function ReportVessels({
  loading,
  color,
  title,
  activityUnit,
  showOnlyTable,
}: {
  loading?: boolean
  color?: string
  title?: string
  activityUnit?: ReportActivityUnit
  showOnlyTable?: boolean
}) {
  const isPrinting = useSelector(selectPrintMode)
  const aggregatedData = useSelector(selectReportVesselsGraphAggregatedData)
  const individualData = useSelector(selectReportVesselsGraphIndividualData)
  const reportVesselGraph = useSelector(selectReportVesselGraph)
  const filter = useSelector(selectReportVesselFilter)
  const vessels = useSelector(
    isPrinting ? selectReportVesselsOrdered : selectReportVesselsPaginated
  )
  const valueKeys = useSelector(selectReportVesselsGraphDataKeys)
  const graphRef = useRef<HTMLDivElement>(null)

  return (
    <div className={styles.container}>
      {!showOnlyTable && (
        <div className={styles.titleRow}>
          {title && <label className={styles.blockTitle}>{title}</label>}
          {!loading && (
            <ReportGraphScreenshot
              graphRef={graphRef}
              name={`vessels-${reportVesselGraph}`}
              withSummary
              filter={filter}
            />
          )}
          <ReportVesselsGraphSelector loading={loading} />
        </div>
      )}
      {loading ? (
        <ReportVesselsPlaceholder showGraphHeader={false} />
      ) : (
        <Fragment>
          {!showOnlyTable && (
            <Fragment>
              <div ref={graphRef}>
                {reportVesselGraph === 'coverage' ? (
                  <VesselGroupReportInsightCoverage />
                ) : (
                  <ReportVesselsGraph
                    data={aggregatedData!}
                    individualData={individualData}
                    aggregatedValueKey={valueKeys}
                    color={color}
                    property={reportVesselGraph as ReportVesselsSubCategory}
                  />
                )}
              </div>
              <ReportVesselsFilter filter={filter} />
            </Fragment>
          )}
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
