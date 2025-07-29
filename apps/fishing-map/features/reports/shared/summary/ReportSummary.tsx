import { useSelector } from 'react-redux'
import Sticky from 'react-sticky-el'

import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import ReportSummaryActivity from 'features/reports/shared/summary/ReportSummaryActivity'
import ReportSummaryEvents from 'features/reports/shared/summary/ReportSummaryEvents'
import ReportSummaryTags from 'features/reports/shared/summary/ReportSummaryTags'
import type { ReportActivityUnit } from 'features/reports/tabs/activity/reports-activity.types'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './ReportSummary.module.css'

type ReportSummaryProps = {
  activityUnit?: ReportActivityUnit
  reportStatus?: AsyncReducerStatus
}

export const PROPERTIES_EXCLUDED = ['flag', 'geartype']

export default function ReportSummary({
  activityUnit,
  reportStatus = AsyncReducerStatus.Finished,
}: ReportSummaryProps) {
  const reportCategory = useSelector(selectReportCategory)
  const dataviews = useSelector(selectActiveReportDataviews)

  return (
    <div className={styles.summaryWrapper}>
      {(reportCategory === ReportCategory.Activity ||
        reportCategory === ReportCategory.Detections) && (
        <div className={styles.summaryContainer}>
          <ReportSummaryActivity
            activityUnit={activityUnit || 'hour'}
            reportStatus={reportStatus}
          />
        </div>
      )}
      {reportCategory === ReportCategory.Events && (
        <div className={styles.summaryContainer}>
          <ReportSummaryEvents />
        </div>
      )}
      {dataviews?.length > 0 && (
        <Sticky scrollElement=".scrollContainer" stickyClassName={styles.sticky}>
          <div className={styles.tagsContainer}>
            {dataviews?.map((dataview) => (
              <ReportSummaryTags key={dataview.id} dataview={dataview} />
            ))}
          </div>
        </Sticky>
      )}
    </div>
  )
}
